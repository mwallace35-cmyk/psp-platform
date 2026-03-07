import {
  Player,
  School,
  Season,
  Game,
  TeamSeason,
  FootballPlayerSeason,
  BasketballPlayerSeason,
  BaseballPlayerSeason,
  Award,
  Championship,
  RosterPlayer,
  SchoolRecord,
} from '@/lib/data/types';

// Incrementing ID counters for realistic fake data
let playerId = 1;
let schoolId = 1;
let seasonId = 1;
let teamSeasonId = 1;
let gameId = 1;
let awardId = 1;
let rosterPlayerId = 1;
let championshipId = 1;
let schoolRecordId = 1;

/**
 * Factory functions for creating test data with sensible defaults.
 * Each factory accepts partial overrides to customize generated data.
 */
export const factory = {
  /**
   * Create a Player object with realistic defaults
   */
  createPlayer(overrides?: Partial<Player>): Player {
    const id = playerId++;
    const slug = `player-${id}`;
    return {
      id,
      slug,
      name: `Player ${id}`,
      college: 'State University',
      pro_team: undefined,
      primary_school_id: schoolId,
      graduation_year: 2024,
      positions: ['QB'],
      height: '6\'2"',
      is_multi_sport: false,
      pro_draft_info: undefined,
      schools: {
        name: 'Central High School',
        slug: 'central-high',
      },
      ...overrides,
    };
  },

  /**
   * Create a School object with realistic defaults
   */
  createSchool(overrides?: Partial<School>): School {
    const id = schoolId++;
    const slug = `school-${id}`;
    return {
      id,
      slug,
      name: `High School ${id}`,
      short_name: `HS${id}`,
      city: 'Springfield',
      state: 'IL',
      league_id: 1,
      mascot: 'Tigers',
      closed_year: undefined,
      founded_year: 1950,
      website_url: `https://example${id}.edu`,
      leagues: {
        name: 'State Athletic Conference',
        short_name: 'SAC',
      },
      ...overrides,
    };
  },

  /**
   * Create a Season object with realistic defaults
   */
  createSeason(overrides?: Partial<Season>): Season {
    const baseYear = 2024;
    return {
      year_start: baseYear,
      year_end: baseYear + 1,
      label: `${baseYear}-${baseYear + 1}`,
      ...overrides,
    };
  },

  /**
   * Create a TeamSeason object with realistic defaults
   */
  createTeamSeason(overrides?: Partial<TeamSeason>): TeamSeason {
    const id = teamSeasonId++;
    return {
      id,
      school_id: schoolId,
      sport_id: 'football',
      season_id: seasonId,
      wins: 10,
      losses: 2,
      ties: 0,
      points_for: 450,
      points_against: 250,
      playoff_result: 'State Championship',
      seasons: factory.createSeason(),
      schools: factory.createSchool(),
      coaches: {
        id: 1,
        name: 'Coach Smith',
        slug: 'coach-smith',
      },
      ...overrides,
    };
  },

  /**
   * Create a Game/Event object with realistic defaults
   */
  createGame(overrides?: Partial<Game>): Game {
    const id = gameId++;
    return {
      id,
      school_id: schoolId,
      opponent_id: schoolId + 1,
      season_id: seasonId,
      sport_id: 'football',
      date: '2024-09-15T19:00:00Z',
      home_score: 28,
      away_score: 21,
      location: 'Memorial Stadium',
      schools: {
        name: 'Central High',
        slug: 'central-high',
      },
      seasons: factory.createSeason(),
      ...overrides,
    };
  },

  /**
   * Create a FootballPlayerSeason object with realistic defaults
   */
  createFootballPlayerSeason(
    overrides?: Partial<FootballPlayerSeason>
  ): FootballPlayerSeason {
    const id = teamSeasonId++;
    return {
      id,
      player_id: playerId,
      season_id: seasonId,
      school_id: schoolId,
      rush_yards: 1200,
      rush_td: 15,
      pass_yards: undefined,
      pass_td: undefined,
      rec_yards: 250,
      rec_td: 3,
      total_td: 18,
      total_yards: 1450,
      seasons: factory.createSeason(),
      schools: {
        name: 'Central High',
        slug: 'central-high',
      },
      players: factory.createPlayer(),
      ...overrides,
    };
  },

  /**
   * Create a BasketballPlayerSeason object with realistic defaults
   */
  createBasketballPlayerSeason(
    overrides?: Partial<BasketballPlayerSeason>
  ): BasketballPlayerSeason {
    const id = teamSeasonId++;
    return {
      id,
      player_id: playerId,
      season_id: seasonId,
      school_id: schoolId,
      games_played: 28,
      points: 672,
      ppg: 24.0,
      rebounds: 168,
      assists: 140,
      steals: 56,
      blocks: 28,
      seasons: factory.createSeason(),
      schools: {
        name: 'Central High',
        slug: 'central-high',
      },
      players: factory.createPlayer(),
      ...overrides,
    };
  },

  /**
   * Create a BaseballPlayerSeason object with realistic defaults
   */
  createBaseballPlayerSeason(
    overrides?: Partial<BaseballPlayerSeason>
  ): BaseballPlayerSeason {
    const id = teamSeasonId++;
    return {
      id,
      player_id: playerId,
      season_id: seasonId,
      school_id: schoolId,
      batting_avg: 0.325,
      home_runs: 18,
      era: 2.85,
      seasons: factory.createSeason(),
      schools: {
        name: 'Central High',
        slug: 'central-high',
      },
      players: factory.createPlayer(),
      ...overrides,
    };
  },

  /**
   * Create an Award object with realistic defaults
   */
  createAward(overrides?: Partial<Award>): Award {
    const id = awardId++;
    return {
      id,
      player_id: playerId,
      award_name: 'All-State',
      award_type: 'All-State Team',
      category: 'First Team',
      seasons: factory.createSeason(),
      ...overrides,
    };
  },

  /**
   * Create a Championship object with realistic defaults
   */
  createChampionship(overrides?: Partial<Championship>): Championship {
    const id = championshipId++;
    return {
      id,
      school_id: schoolId,
      season_id: seasonId,
      sport_id: 'football',
      level: 'State',
      result: 'Champion',
      schools: factory.createSchool(),
      seasons: factory.createSeason(),
      ...overrides,
    };
  },

  /**
   * Create a RosterPlayer object with realistic defaults
   */
  createRosterPlayer(overrides?: Partial<RosterPlayer>): RosterPlayer {
    const id = rosterPlayerId++;
    return {
      id,
      player_id: playerId,
      team_season_id: teamSeasonId,
      number: String(23 + id),
      position: 'QB',
      players: factory.createPlayer(),
      ...overrides,
    };
  },

  /**
   * Create a SchoolRecord object with realistic defaults
   */
  createSchoolRecord(overrides?: Partial<SchoolRecord>): SchoolRecord {
    const id = schoolRecordId++;
    return {
      id,
      sport_id: 'football',
      category: 'Single Season Rushing Yards',
      record_number: 1,
      record_holder: `player-${playerId}`,
      holder_name: `Player ${playerId}`,
      record_value: 2400,
      holder_school: 'Central High',
      record_year: 2023,
      year_set: 2023,
      players: {
        name: `Player ${playerId}`,
        slug: `player-${playerId}`,
      },
      schools: {
        name: 'Central High',
        slug: 'central-high',
      },
      seasons: {
        label: '2023-2024',
      },
      ...overrides,
    };
  },

  /**
   * Reset all ID counters (useful for test isolation)
   */
  resetIds() {
    playerId = 1;
    schoolId = 1;
    seasonId = 1;
    teamSeasonId = 1;
    gameId = 1;
    awardId = 1;
    rosterPlayerId = 1;
    championshipId = 1;
    schoolRecordId = 1;
  },
};

export default factory;
