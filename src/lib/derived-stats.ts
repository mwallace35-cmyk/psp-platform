/**
 * Advanced Derived Stats Library for PhillySportsPack.com
 * Computes complex analytics from game and team-season data
 */

import { createClient } from "@/lib/supabase/server";
import { SPORT_META } from "@/lib/sports";

// ============================================================================
// TYPES
// ============================================================================

export interface EloRating {
  schoolId: number;
  schoolName: string;
  schoolSlug: string;
  elo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  ties?: number;
}

export interface PowerIndexComponent {
  champPoints: number;
  winPctScore: number;
  proAlumni: number;
  recentScore: number;
}

export interface SchoolPowerIndex {
  schoolId: number;
  schoolName: string;
  schoolSlug: string;
  powerIndex: number;
  components: PowerIndexComponent;
}

export interface PythagoreanStats {
  schoolId: number;
  schoolName: string;
  schoolSlug: string;
  expectedWins: number;
  actualWins: number;
  luck: number; // actual - expected
  gamesPlayed: number;
}

export interface DecadeLeader {
  name: string;
  schoolName: string;
  schoolSlug: string;
  schoolId: number;
  value: number;
}

export interface HeadToHeadRecord {
  schoolA: { name: string; wins: number };
  schoolB: { name: string; wins: number };
  ties: number;
  totalGames: number;
  recentGames: Array<{
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
  }>;
}

export interface ScheduleStrength {
  schoolId: number;
  schoolName: string;
  schoolSlug: string;
  sos: number; // strength of schedule
  opponents: Array<{
    name: string;
    winPct: number;
  }>;
  rank: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getEloExponent(sportId: string): number {
  // K-factor adjustment for different sports
  return 32; // standard
}

function getExponent(sportId: string): number {
  // Pythagorean exponent by sport
  const exponents: Record<string, number> = {
    football: 2.37,
    basketball: 13.91,
    baseball: 1.83,
  };
  return exponents[sportId] ?? 2.0;
}

function calculateExpectedWins(pf: number, pa: number, games: number, exponent: number): number {
  if (pf === 0 || pa === 0) return 0;
  const ratio = Math.pow(pf, exponent) / (Math.pow(pf, exponent) + Math.pow(pa, exponent));
  return ratio * games;
}

function getDecadeRange(decade: string): { start: number; end: number } | null {
  const match = decade.match(/^(\d{3})0s$/);
  if (!match) return null;
  const start = parseInt(match[1] + "0", 10);
  return { start, end: start + 9 };
}

// ============================================================================
// 1. ELO RATINGS
// ============================================================================

export async function computeEloRatings(sportId: string): Promise<EloRating[]> {
  try {
    const supabase = await createClient();

    // Fetch all games for this sport, ordered by date
    const { data: games, error: gamesError } = await supabase
      .from("games")
      .select(
        `
        id, game_date, home_school_id, away_school_id, home_score, away_score,
        game_type, playoff_round,
        schools!home_school_id(id, name, slug),
        schools!away_school_id(id, name, slug)
      `
      )
      .eq("sport_id", sportId)
      .order("game_date", { ascending: true });

    if (gamesError) {
      console.error("[computeEloRatings] Games error:", gamesError);
      return [];
    }

    if (!games || games.length === 0) return [];

    // Initialize all schools with 1500 elo
    const schoolElo: Record<number, number> = {};
    const schoolStats: Record<number, { wins: number; losses: number; ties: number }> = {};
    const schoolInfo: Record<number, { name: string; slug: string }> = {};

    // Collect all unique schools
    const schoolIds = new Set<number>();
    games.forEach((game: any) => {
      if (game.home_school_id) schoolIds.add(game.home_school_id);
      if (game.away_school_id) schoolIds.add(game.away_school_id);
    });

    for (const schoolId of schoolIds) {
      schoolElo[schoolId] = 1500;
      schoolStats[schoolId] = { wins: 0, losses: 0, ties: 0 };
    }

    // Store school info
    games.forEach((game: any) => {
      if (game.home_school_id && game.schools) {
        schoolInfo[game.home_school_id] = {
          name: game.schools.name,
          slug: game.schools.slug,
        };
      }
      if (game.away_school_id) {
        const awaySchool = (game as any)["schools!away_school_id"];
        if (awaySchool) {
          schoolInfo[game.away_school_id] = {
            name: awaySchool.name,
            slug: awaySchool.slug,
          };
        }
      }
    });

    // Process games chronologically
    for (const game of games) {
      const homeId = game.home_school_id;
      const awayId = game.away_school_id;
      const homeScore = game.home_score ?? 0;
      const awayScore = game.away_score ?? 0;

      if (!homeId || !awayId || homeScore === null || awayScore === null) continue;

      // Determine K-factor (playoff = 48, regular = 32)
      const isPlayoff = game.game_type === "playoff" || game.playoff_round;
      const kFactor = isPlayoff ? 48 : 32;

      const homeElo = schoolElo[homeId];
      const awayElo = schoolElo[awayId];

      // Calculate expected scores
      const homeExpected = 1 / (1 + Math.pow(10, (awayElo - homeElo) / 400));
      const awayExpected = 1 / (1 + Math.pow(10, (homeElo - awayElo) / 400));

      let homeActual: number, awayActual: number;

      if (homeScore > awayScore) {
        homeActual = 1;
        awayActual = 0;
        schoolStats[homeId].wins++;
        schoolStats[awayId].losses++;
      } else if (awayScore > homeScore) {
        homeActual = 0;
        awayActual = 1;
        schoolStats[awayId].wins++;
        schoolStats[homeId].losses++;
      } else {
        homeActual = 0.5;
        awayActual = 0.5;
        schoolStats[homeId].ties++;
        schoolStats[awayId].ties++;
      }

      // Update elo ratings
      schoolElo[homeId] = homeElo + kFactor * (homeActual - homeExpected);
      schoolElo[awayId] = awayElo + kFactor * (awayActual - awayExpected);
    }

    // Build result array
    const results: EloRating[] = Array.from(schoolIds).map((schoolId) => ({
      schoolId,
      schoolName: schoolInfo[schoolId]?.name ?? "Unknown",
      schoolSlug: schoolInfo[schoolId]?.slug ?? "unknown",
      elo: Math.round(schoolElo[schoolId]),
      gamesPlayed:
        schoolStats[schoolId].wins + schoolStats[schoolId].losses + schoolStats[schoolId].ties,
      wins: schoolStats[schoolId].wins,
      losses: schoolStats[schoolId].losses,
      ties: schoolStats[schoolId].ties,
    }));

    // Sort by elo descending
    return results.sort((a, b) => b.elo - a.elo);
  } catch (error) {
    console.error("[computeEloRatings] Error:", error);
    return [];
  }
}

// ============================================================================
// 2. SCHOOL POWER INDEX
// ============================================================================

export async function computeSchoolPowerIndex(sportId: string): Promise<SchoolPowerIndex[]> {
  try {
    const supabase = await createClient();

    // Fetch all team seasons for this sport
    const { data: teamSeasons, error: tsError } = await supabase
      .from("team_seasons")
      .select(
        `
        school_id, season_id, wins, losses, ties, sport_id,
        schools(id, name, slug),
        seasons(year_start, year_end)
      `
      )
      .eq("sport_id", sportId);

    if (tsError || !teamSeasons) {
      console.error("[computeSchoolPowerIndex] TeamSeasons error:", tsError);
      return [];
    }

    // Fetch championships
    const { data: champs, error: champsError } = await supabase
      .from("championships")
      .select("school_id, level")
      .eq("sport_id", sportId);

    if (champsError) {
      console.error("[computeSchoolPowerIndex] Championships error:", champsError);
    }

    // Fetch pro athletes
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id")
      .not("pro_team", "is", null);

    if (playersError) {
      console.error("[computeSchoolPowerIndex] Players error:", playersError);
    }

    // Count pro athletes by school
    const { data: proBySchool } = await supabase
      .from("football_player_seasons")
      .select("player_id, school_id")
      .in(
        "player_id",
        (players || []).map((p: any) => p.id)
      );

    const proCountBySchool: Record<number, number> = {};
    if (proBySchool) {
      proBySchool.forEach((ps: any) => {
        if (!proCountBySchool[ps.school_id]) proCountBySchool[ps.school_id] = 0;
        proCountBySchool[ps.school_id]++;
      });
    }

    // Aggregate by school
    const schoolStats: Record<
      number,
      {
        name: string;
        slug: string;
        totalWins: number;
        totalLosses: number;
        totalTies: number;
        totalGames: number;
        seasonsPlayed: number;
        recentWins: number;
        recentGames: number;
      }
    > = {};

    teamSeasons.forEach((ts: any) => {
      const schoolId = ts.school_id;
      if (!schoolStats[schoolId]) {
        schoolStats[schoolId] = {
          name: ts.schools.name,
          slug: ts.schools.slug,
          totalWins: 0,
          totalLosses: 0,
          totalTies: 0,
          totalGames: 0,
          seasonsPlayed: 0,
          recentWins: 0,
          recentGames: 0,
        };
      }

      const stats = schoolStats[schoolId];
      const gamesInSeason = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);

      stats.totalWins += ts.wins ?? 0;
      stats.totalLosses += ts.losses ?? 0;
      stats.totalTies += ts.ties ?? 0;
      stats.totalGames += gamesInSeason;
      stats.seasonsPlayed++;

      // Last 5 seasons
      if (ts.seasons && ts.seasons.year_start >= new Date().getFullYear() - 5) {
        stats.recentWins += ts.wins ?? 0;
        stats.recentGames += gamesInSeason;
      }
    });

    // Count championships by school and level
    const champsBySchool: Record<number, { league: number; district: number; state: number }> = {};
    if (champs) {
      champs.forEach((c: any) => {
        if (!champsBySchool[c.school_id]) {
          champsBySchool[c.school_id] = { league: 0, district: 0, state: 0 };
        }
        if (c.level === "state") champsBySchool[c.school_id].state++;
        else if (c.level === "district") champsBySchool[c.school_id].district++;
        else if (c.level === "league") champsBySchool[c.school_id].league++;
      });
    }

    // Compute power index
    const results: SchoolPowerIndex[] = Object.entries(schoolStats).map(([schoolIdStr, stats]) => {
      const schoolId = parseInt(schoolIdStr, 10);

      // Championship points
      const champs_ = champsBySchool[schoolId] ?? { league: 0, district: 0, state: 0 };
      const champPoints = champs_.state * 10 + champs_.district * 5 + champs_.league * 3;

      // All-time win percentage
      const allTimeWinPct = stats.totalGames > 0 ? stats.totalWins / stats.totalGames : 0;
      const winPctScore = Math.round(allTimeWinPct * 100);

      // Recent success (weighted 2x)
      const recentWinPct = stats.recentGames > 0 ? stats.recentWins / stats.recentGames : 0;
      const recentScore = Math.round(recentWinPct * 100 * 2);

      // Pro athletes
      const proAlumni = proCountBySchool[schoolId] ?? 0;

      // Composite power index (scale 0-1000)
      const powerIndex =
        champPoints * 3 + // championships heavily weighted
        winPctScore * 2 + // all-time record
        recentScore * 3 + // recent success is most important
        Math.min(proAlumni * 5, 100); // pro pipeline bonus (capped)

      return {
        schoolId,
        schoolName: stats.name,
        schoolSlug: stats.slug,
        powerIndex: Math.round(powerIndex),
        components: {
          champPoints,
          winPctScore,
          proAlumni,
          recentScore,
        },
      };
    });

    return results.sort((a, b) => b.powerIndex - a.powerIndex);
  } catch (error) {
    console.error("[computeSchoolPowerIndex] Error:", error);
    return [];
  }
}

// ============================================================================
// 3. PYTHAGOREAN EXPECTATION
// ============================================================================

export async function computePythagoreanWins(
  sportId: string,
  seasonId?: number
): Promise<PythagoreanStats[]> {
  try {
    const supabase = await createClient();

    // Fetch team seasons
    const query = supabase
      .from("team_seasons")
      .select(
        `
        school_id, season_id, wins, losses, ties, points_for, points_against,
        schools(id, name, slug)
      `
      )
      .eq("sport_id", sportId);

    if (seasonId) {
      query.eq("season_id", seasonId);
    }

    const { data: teamSeasons, error } = await query;

    if (error || !teamSeasons) {
      console.error("[computePythagoreanWins] Error:", error);
      return [];
    }

    const exponent = getExponent(sportId);

    const results: PythagoreanStats[] = teamSeasons
      .filter((ts: any) => ts.points_for && ts.points_against && ts.points_for > 0 && ts.points_against > 0)
      .map((ts: any) => {
        const games = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);
        const expectedWins = calculateExpectedWins(ts.points_for, ts.points_against, games, exponent);
        const actualWins = ts.wins ?? 0;

        return {
          schoolId: ts.school_id,
          schoolName: ts.schools.name,
          schoolSlug: ts.schools.slug,
          expectedWins: Math.round(expectedWins * 100) / 100,
          actualWins,
          luck: Math.round((actualWins - expectedWins) * 100) / 100,
          gamesPlayed: games,
        };
      });

    return results.sort((a, b) => Math.abs(b.luck) - Math.abs(a.luck));
  } catch (error) {
    console.error("[computePythagoreanWins] Error:", error);
    return [];
  }
}

// ============================================================================
// 4. DECADE LEADERS
// ============================================================================

export async function getDecadeLeaders(sportId: string, decade: string): Promise<DecadeLeader[]> {
  try {
    const range = getDecadeRange(decade);
    if (!range) return [];

    const supabase = await createClient();

    // Different tables for different sports
    const playerStatTable: Record<string, string> = {
      football: "football_player_seasons",
      basketball: "basketball_player_seasons",
      baseball: "baseball_player_seasons",
    };

    const table = playerStatTable[sportId];
    if (!table) return [];

    // Fetch all player seasons in this decade
    const { data: playerSeasons, error } = await supabase
      .from(table)
      .select(
        `
        player_id, school_id, season_id,
        rush_yards, pass_yards, total_td,
        points, rebounds, assists,
        players(id, name, slug),
        schools(id, name, slug),
        seasons(year_start)
      `
      )
      .gte("seasons.year_start", range.start)
      .lte("seasons.year_start", range.end);

    if (error || !playerSeasons) {
      console.error("[getDecadeLeaders] Error:", error);
      return [];
    }

    // Aggregate by player
    const playerTotals: Record<
      number,
      {
        name: string;
        slug: string;
        schoolName: string;
        schoolSlug: string;
        schoolId: number;
        rushYards: number;
        passYards: number;
        totalTd: number;
        points: number;
        rebounds: number;
        assists: number;
      }
    > = {};

    playerSeasons.forEach((ps: any) => {
      if (!ps.player_id) return;
      if (!playerTotals[ps.player_id]) {
        playerTotals[ps.player_id] = {
          name: ps.players.name,
          slug: ps.players.slug,
          schoolName: ps.schools.name,
          schoolSlug: ps.schools.slug,
          schoolId: ps.school_id,
          rushYards: 0,
          passYards: 0,
          totalTd: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
        };
      }

      const totals = playerTotals[ps.player_id];
      if (ps.rush_yards) totals.rushYards += ps.rush_yards;
      if (ps.pass_yards) totals.passYards += ps.pass_yards;
      if (ps.total_td) totals.totalTd += ps.total_td;
      if (ps.points) totals.points += ps.points;
      if (ps.rebounds) totals.rebounds += ps.rebounds;
      if (ps.assists) totals.assists += ps.assists;
    });

    // Convert to array
    const playerArray = Object.values(playerTotals);

    // Get top 25 for each relevant stat
    const statGetters: Record<string, (p: (typeof playerArray)[0]) => number> = {
      "Rushing Yards": (p) => p.rushYards,
      "Passing Yards": (p) => p.passYards,
      "Total Touchdowns": (p) => p.totalTd,
      "Points Scored": (p) => p.points,
      Rebounds: (p) => p.rebounds,
      Assists: (p) => p.assists,
    };

    const results: DecadeLeader[] = [];

    for (const [statName, getter] of Object.entries(statGetters)) {
      const sorted = playerArray
        .filter((p) => getter(p) > 0)
        .sort((a, b) => getter(b) - getter(a))
        .slice(0, 25)
        .map((p) => ({
          name: p.name,
          schoolName: p.schoolName,
          schoolSlug: p.schoolSlug,
          schoolId: p.schoolId,
          value: getter(p),
        }));

      results.push(...sorted);
    }

    return results;
  } catch (error) {
    console.error("[getDecadeLeaders] Error:", error);
    return [];
  }
}

// ============================================================================
// 5. HEAD-TO-HEAD RECORDS
// ============================================================================

export async function getSchoolHeadToHead(
  schoolA: string,
  schoolB: string,
  sportId?: string
): Promise<HeadToHeadRecord | null> {
  try {
    const supabase = await createClient();

    // Get school IDs from slugs
    const { data: schools, error: schoolError } = await supabase
      .from("schools")
      .select("id, name, slug")
      .in("slug", [schoolA, schoolB])
      .limit(2);

    if (schoolError || !schools || schools.length < 2) {
      console.error("[getSchoolHeadToHead] Schools error:", schoolError);
      return null;
    }

    const schoolIds = schools.map((s: any) => s.id);
    const schoolNames: Record<number, string> = {};
    schools.forEach((s: any) => {
      schoolNames[s.id] = s.name;
    });

    // Fetch all games between these schools
    const query = supabase
      .from("games")
      .select(
        `
        id, game_date, home_school_id, away_school_id, home_score, away_score
      `
      )
      .or(
        `and(home_school_id.eq.${schoolIds[0]},away_school_id.eq.${schoolIds[1]}),and(home_school_id.eq.${schoolIds[1]},away_school_id.eq.${schoolIds[0]})`
      );

    if (sportId) {
      query.eq("sport_id", sportId);
    }

    const { data: games, error: gamesError } = await query;

    if (gamesError) {
      console.error("[getSchoolHeadToHead] Games error:", gamesError);
      return null;
    }

    let schoolAWins = 0;
    let schoolBWins = 0;
    let ties = 0;
    const recentGames: HeadToHeadRecord["recentGames"] = [];

    games?.forEach((game: any) => {
      const isSchoolAHome = game.home_school_id === schoolIds[0];
      const homeScore = game.home_score ?? 0;
      const awayScore = game.away_score ?? 0;

      if (homeScore > awayScore) {
        if (isSchoolAHome) schoolAWins++;
        else schoolBWins++;
      } else if (awayScore > homeScore) {
        if (isSchoolAHome) schoolBWins++;
        else schoolAWins++;
      } else {
        ties++;
      }

      recentGames.push({
        date: game.game_date || "Unknown",
        homeTeam: schoolNames[game.home_school_id] || "Unknown",
        awayTeam: schoolNames[game.away_school_id] || "Unknown",
        homeScore,
        awayScore,
      });
    });

    // Most recent 10 games
    recentGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recent10 = recentGames.slice(0, 10);

    return {
      schoolA: { name: schoolNames[schoolIds[0]], wins: schoolAWins },
      schoolB: { name: schoolNames[schoolIds[1]], wins: schoolBWins },
      ties,
      totalGames: schoolAWins + schoolBWins + ties,
      recentGames: recent10,
    };
  } catch (error) {
    console.error("[getSchoolHeadToHead] Error:", error);
    return null;
  }
}

// ============================================================================
// 6. STRENGTH OF SCHEDULE
// ============================================================================

export async function computeStrengthOfSchedule(
  schoolId: number,
  sportId: string,
  seasonId?: number
): Promise<ScheduleStrength | null> {
  try {
    const supabase = await createClient();

    // Get school info
    const { data: schoolData } = await supabase.from("schools").select("id, name, slug").eq("id", schoolId).single();

    if (!schoolData) return null;

    // Get all games for this school
    const query = supabase
      .from("games")
      .select(
        `
        id, home_school_id, away_school_id, home_score, away_score,
        season_id
      `
      )
      .eq("sport_id", sportId)
      .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`);

    if (seasonId) {
      query.eq("season_id", seasonId);
    }

    const { data: games, error: gamesError } = await query;

    if (gamesError || !games || games.length === 0) {
      return null;
    }

    // Collect opponent IDs
    const opponentIds = new Set<number>();
    games.forEach((g: any) => {
      if (g.home_school_id === schoolId && g.away_school_id) {
        opponentIds.add(g.away_school_id);
      } else if (g.away_school_id === schoolId && g.home_school_id) {
        opponentIds.add(g.home_school_id);
      }
    });

    if (opponentIds.size === 0) {
      return null;
    }

    // Get win-loss records for all opponents
    const { data: teamSeasons } = await supabase
      .from("team_seasons")
      .select("school_id, wins, losses, ties, sport_id, schools(name, slug)")
      .eq("sport_id", sportId)
      .in("school_id", Array.from(opponentIds));

    // Build opponent win pct map
    const oppWinPct: Record<number, number> = {};
    teamSeasons?.forEach((ts: any) => {
      const games = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);
      oppWinPct[ts.school_id] = games > 0 ? ts.wins / games : 0;
    });

    // Calculate SOS
    let totalWinPct = 0;
    const opponents: ScheduleStrength["opponents"] = [];

    games.forEach((g: any) => {
      let opponentId: number | null = null;
      if (g.home_school_id === schoolId) opponentId = g.away_school_id;
      else if (g.away_school_id === schoolId) opponentId = g.home_school_id;

      if (opponentId && oppWinPct[opponentId] !== undefined) {
        totalWinPct += oppWinPct[opponentId];
      }
    });

    const sos = games.length > 0 ? totalWinPct / games.length : 0;

    // Get rank among all schools
    const { data: allTeamSeasons } = await supabase
      .from("team_seasons")
      .select("school_id, wins, losses, ties")
      .eq("sport_id", sportId);

    let rank = 1;
    if (allTeamSeasons) {
      const allSOS: Record<number, number> = {};
      // Simple estimation: use all-time win pct as proxy for SOS calculation
      allTeamSeasons.forEach((ts: any) => {
        const games = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);
        allSOS[ts.school_id] = games > 0 ? ts.wins / games : 0;
      });

      for (const [sid, winPct] of Object.entries(allSOS)) {
        if (parseInt(sid, 10) !== schoolId && (winPct as number) > sos) {
          rank++;
        }
      }
    }

    return {
      schoolId,
      schoolName: schoolData.name,
      schoolSlug: schoolData.slug,
      sos: Math.round(sos * 10000) / 10000,
      opponents: Array.from(opponentIds)
        .map((id) => ({
          name: "", // would need to fetch school names
          winPct: oppWinPct[id] ?? 0,
        }))
        .sort((a, b) => b.winPct - a.winPct),
      rank,
    };
  } catch (error) {
    console.error("[computeStrengthOfSchedule] Error:", error);
    return null;
  }
}
