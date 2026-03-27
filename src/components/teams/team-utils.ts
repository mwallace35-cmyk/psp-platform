// Shared types, era definitions, and helper functions for team pages

// ─── Type Definitions ───────────────────────────────────────────────

export interface TeamDetail {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  league: string;
  founded_year: number;
  coach: string;
  currentRecord: { wins: number; losses: number; ties: number };
  pointsFor: number;
  pointsAgainst: number;
  leagueRecord?: { wins: number; losses: number };
  leagueFinish?: string;
  championships: number;
  recentChampionships: string[];
}

export interface School {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  city?: string;
  state?: string;
  league_id?: number;
  mascot?: string;
  closed_year?: number;
  founded_year?: number;
  website_url?: string;
  leagues?: { name: string; short_name?: string } | null;
  primary_color?: string;
  secondary_color?: string;
}

export interface TeamSeason {
  id: number;
  school_id: number;
  sport_id: string;
  season_id: number;
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  playoff_result?: string;
  seasons?: { year_start: number; year_end: number; label: string };
  schools?: School;
  coaches?: { id: number; name: string; slug: string } | null;
}

export interface Championship {
  id: number;
  school_id: number;
  season_id: number;
  sport_id: string;
  championship_type?: string;
  level?: string;
  result?: string;
  score?: string;
  notes?: string;
  opponent_id?: number;
  schools?: School;
  seasons?: { year_start: number; year_end: number; label: string };
  leagues?: { name: string };
  opponent?: { name: string };
}

export interface Alumni {
  id: number;
  player_id: number;
  school_id: number;
  person_name?: string;
  current_org?: string;
  current_level?: string;
  pro_league?: string;
  destination_school?: string;
  destination_level?: string;
  graduation_year?: number;
}

export interface SportMeta {
  name: string;
  color: string;
  emoji: string;
}

export interface DBGame {
  id: number;
  game_date: string;
  home_school_id: number;
  away_school_id: number;
  home_score: number | null;
  away_score: number | null;
  home_school?: { name: string; slug: string } | null;
  away_school?: { name: string; slug: string } | null;
  notes?: string;
}

export interface DBRosterEntry {
  id: number;
  player_id: number;
  jersey_number?: string;
  position?: string;
  class_year?: string;
  players?: { id: number; name: string; slug: string } | null;
}

export interface DBArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string;
  published_at?: string;
  sport_id?: string;
}

export interface StatLeader {
  playerName: string;
  statValue: number;
  statLabel: string;
  gamesPlayed: number;
}

export interface StatLeadersData {
  totalRushYards: number;
  totalPassYards: number;
  totalRecYards: number;
  totalPoints: number;
  gamesWithStats: number;
  rushLeader: StatLeader | null;
  passLeader: StatLeader | null;
  recLeader: StatLeader | null;
  scoringLeader: StatLeader | null;
}

export interface TeamPageClientProps {
  team: TeamDetail;
  school: School;
  teamSeasons: TeamSeason[];
  championships: Championship[];
  alumni: Alumni[];
  sport: string;
  sportMeta: SportMeta;
  games: DBGame[];
  roster: DBRosterEntry[];
  articles: DBArticle[];
  statLeaders?: StatLeadersData | null;
}

export type TabType = "overview" | "stats" | "schedule" | "roster" | "news";

// ─── Era Definitions ────────────────────────────────────────────────

export interface Era {
  key: string;
  label: string;
  range: string;
  minYear: number;
  maxYear: number;
}

export const ERAS: Era[] = [
  { key: "modern", label: "Modern Era", range: "2016-Present", minYear: 2016, maxYear: 9999 },
  { key: "classification", label: "Classification Era", range: "2008-2015", minYear: 2008, maxYear: 2015 },
  { key: "division", label: "Division Era", range: "1999-2007", minYear: 1999, maxYear: 2007 },
  { key: "historic", label: "Historic Era", range: "Pre-1999", minYear: 0, maxYear: 1998 },
];

// ─── Helper Functions ───────────────────────────────────────────────

export function getEraForYear(year: number): Era {
  return ERAS.find((e) => year >= e.minYear && year <= e.maxYear) || ERAS[ERAS.length - 1];
}

export function getErasWithSeasons(seasons: TeamSeason[]): Era[] {
  const eraKeys = new Set<string>();
  for (const ts of seasons) {
    const year = ts.seasons?.year_start;
    if (year != null) {
      eraKeys.add(getEraForYear(year).key);
    }
  }
  return ERAS.filter((e) => eraKeys.has(e.key));
}

export function buildChampionshipMap(championships: Championship[]): Map<number, Championship[]> {
  const map = new Map<number, Championship[]>();
  for (const c of championships) {
    const list = map.get(c.season_id) || [];
    list.push(c);
    map.set(c.season_id, list);
  }
  return map;
}

export function formatChampionshipLabel(c: Championship): string {
  const ct = c.championship_type;
  const level = c.level;
  const leagueName = c.leagues?.name;

  if (level === "state" || level === "State" || ct === "PIAA State") {
    const cls = ct && !ct.includes("PIAA") && ct !== "state" ? ct : (level !== "state" && level !== "State" ? level : null);
    return cls ? `PIAA ${cls} State Champion` : "State Champion";
  }

  if (ct === "District 12" || level === "district" || level === "District") {
    return "District 12 Champion";
  }

  if (ct === "PCL Red") return "PCL Red Division Champion";
  if (ct === "PCL Blue") return "PCL Blue Division Champion";

  if (ct === "PCL" || ct === "catholic-league") {
    return "PCL Champion";
  }

  if (ct === "Public League" || ct === "public-league") {
    const cls = level && level !== "league" && level !== "public-league" ? ` ${level}` : "";
    return `Public League${cls} Champion`;
  }

  if (ct === "Inter-Ac") return "Inter-Ac Champion";

  if (level === "city" || level === "City Title") {
    return ct ? `City ${ct} Champion` : "City Champion";
  }

  if (leagueName) return `${leagueName} Champion`;
  if (ct) return `${ct} Champion`;
  if (level) return `${level.charAt(0).toUpperCase() + level.slice(1)} Champion`;
  return "Champion";
}

export function formatGameDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function gamesToSchedule(games: DBGame[], schoolId: number) {
  return games.map((g) => {
    const isHome = g.home_school_id === schoolId;
    const opponentSchool = isHome
      ? (Array.isArray(g.away_school) ? g.away_school[0] : g.away_school)
      : (Array.isArray(g.home_school) ? g.home_school[0] : g.home_school);
    const opponentName = opponentSchool?.name || "Unknown";
    const ourScore = isHome ? g.home_score : g.away_score;
    const theirScore = isHome ? g.away_score : g.home_score;
    const hasScore = ourScore !== null && theirScore !== null;
    const result = hasScore
      ? ourScore! > theirScore!
        ? "W"
        : ourScore! < theirScore!
        ? "L"
        : "T"
      : null;
    return {
      date: formatGameDate(g.game_date),
      opponent: opponentName,
      homeAway: isHome ? ("H" as const) : ("A" as const),
      result: (result || "--") as "W" | "L",
      score: hasScore ? `${ourScore}-${theirScore}` : "TBD",
      leagueGame: true,
    };
  });
}

export function rosterToDisplay(roster: DBRosterEntry[]) {
  return roster.map((r) => {
    const player = Array.isArray(r.players) ? r.players[0] : r.players;
    return {
      name: player?.name || "Unknown",
      position: r.position || "--",
      class: (r.class_year || "--") as "Sr" | "Jr" | "So" | "Fr",
      height: "--",
      weight: "--",
      slug: player?.slug || "",
    };
  });
}

export function getPositionGroups(sportId: string): Record<string, string[]> {
  if (sportId === "basketball") {
    return {
      Guards: ["PG", "SG", "G"],
      Forwards: ["SF", "PF", "F"],
      Centers: ["C"],
    };
  }
  if (sportId === "baseball") {
    return {
      Pitchers: ["P", "SP", "RP"],
      Catchers: ["C"],
      Infielders: ["1B", "2B", "3B", "SS", "INF"],
      Outfielders: ["LF", "CF", "RF", "OF"],
    };
  }
  return {
    Offense: ["QB", "RB", "WR", "OL", "TE", "FB"],
    Defense: ["DL", "DE", "DT", "LB", "DB", "CB", "S"],
    "Special Teams": ["K", "P", "LS"],
  };
}

export function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

export function getGameOpponent(g: DBGame | undefined, schoolId: number) {
  if (!g) return null;
  const isHome = g.home_school_id === schoolId;
  const opp = isHome
    ? (Array.isArray(g.away_school) ? g.away_school[0] : g.away_school)
    : (Array.isArray(g.home_school) ? g.home_school[0] : g.home_school);
  return {
    name: opp?.name || "TBA",
    homeAway: isHome ? "Home" : "Away",
    date: formatGameDate(g.game_date),
  };
}
