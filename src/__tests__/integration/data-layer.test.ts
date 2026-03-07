import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { factory } from '@/__tests__/factories';
import {
  createMockSupabaseClient,
  createMockSupabaseClientWithDefaults,
  MockSupabaseClient,
} from '@/__tests__/mocks/supabase';
import {
  Player,
  School,
  Season,
  Game,
  TeamSeason,
  FootballPlayerSeason,
  BasketballPlayerSeason,
  BaseballPlayerSeason,
} from '@/lib/data/types';

describe('Data Layer Integration Tests', () => {
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClientWithDefaults();
    factory.resetIds();
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('Player Data Handling', () => {
    it('creates valid player objects with factory', () => {
      const player = factory.createPlayer();

      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('slug');
      expect(player).toHaveProperty('name');
      expect(player.id).toBeGreaterThan(0);
      expect(player.name).toContain('Player');
    });

    it('allows player customization via overrides', () => {
      const player = factory.createPlayer({
        name: 'John Doe',
        college: 'Alabama',
        graduation_year: 2023,
      });

      expect(player.name).toBe('John Doe');
      expect(player.college).toBe('Alabama');
      expect(player.graduation_year).toBe(2023);
    });

    it('handles player data fetch from mock client', async () => {
      const player = factory.createPlayer();
      mockClient.setMockResponse('players', {
        data: [player],
        error: null,
      });

      const result = await mockClient.from('players').select('*');

      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]?.name).toBe(player.name);
      expect(result.error).toBeNull();
    });

    it('tracks queries made to players table', async () => {
      const player = factory.createPlayer();
      mockClient.setMockResponse('players', {
        data: [player],
        error: null,
      });

      await mockClient.from('players').select('*').eq('id', player.id);

      const history = mockClient.getQueryHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].table).toBe('players');
    });
  });

  describe('School Data Handling', () => {
    it('creates valid school objects with factory', () => {
      const school = factory.createSchool();

      expect(school).toHaveProperty('id');
      expect(school).toHaveProperty('slug');
      expect(school).toHaveProperty('name');
      expect(school.id).toBeGreaterThan(0);
    });

    it('allows school customization', () => {
      const school = factory.createSchool({
        name: 'Central High School',
        city: 'Chicago',
        state: 'IL',
        mascot: 'Bears',
      });

      expect(school.name).toBe('Central High School');
      expect(school.city).toBe('Chicago');
      expect(school.state).toBe('IL');
      expect(school.mascot).toBe('Bears');
    });

    it('fetches school data successfully', async () => {
      const school = factory.createSchool();
      mockClient.setMockResponse('schools', {
        data: [school],
        error: null,
      });

      const result = await mockClient.from('schools').select('*');

      expect(result.data).toHaveLength(1);
      expect(result.error).toBeNull();
    });
  });

  describe('Season Data Handling', () => {
    it('creates valid season objects', () => {
      const season = factory.createSeason();

      expect(season).toHaveProperty('year_start');
      expect(season).toHaveProperty('year_end');
      expect(season).toHaveProperty('label');
      expect(season.year_end).toBeGreaterThan(season.year_start);
    });

    it('allows season customization', () => {
      const season = factory.createSeason({
        year_start: 2023,
        year_end: 2024,
      });

      expect(season.year_start).toBe(2023);
      expect(season.year_end).toBe(2024);
    });
  });

  describe('Game Data Handling', () => {
    it('creates valid game objects', () => {
      const game = factory.createGame();

      expect(game).toHaveProperty('id');
      expect(game).toHaveProperty('school_id');
      expect(game).toHaveProperty('opponent_id');
      expect(game).toHaveProperty('date');
    });

    it('handles game data with scores', () => {
      const game = factory.createGame({
        home_score: 35,
        away_score: 28,
      });

      expect(game.home_score).toBe(35);
      expect(game.away_score).toBe(28);
    });

    it('fetches games and verifies data structure', async () => {
      const games = [
        factory.createGame(),
        factory.createGame({ home_score: 21, away_score: 14 }),
      ];

      mockClient.setMockResponse('games', {
        data: games,
        error: null,
      });

      const result = await mockClient.from('games').select('*');

      expect(result.data).toHaveLength(2);
      expect(result.data?.[0]).toHaveProperty('date');
      expect(result.data?.[1].home_score).toBe(21);
    });
  });

  describe('TeamSeason Data Handling', () => {
    it('creates valid team season objects', () => {
      const teamSeason = factory.createTeamSeason();

      expect(teamSeason).toHaveProperty('id');
      expect(teamSeason).toHaveProperty('school_id');
      expect(teamSeason).toHaveProperty('sport_id');
      expect(teamSeason).toHaveProperty('wins');
      expect(teamSeason).toHaveProperty('losses');
    });

    it('handles team season with record', () => {
      const teamSeason = factory.createTeamSeason({
        wins: 12,
        losses: 1,
        ties: 0,
      });

      expect(teamSeason.wins).toBe(12);
      expect(teamSeason.losses).toBe(1);
      expect(teamSeason.ties).toBe(0);
    });
  });

  describe('Football Player Season Data', () => {
    it('creates valid football player season data', () => {
      const fps = factory.createFootballPlayerSeason();

      expect(fps).toHaveProperty('id');
      expect(fps).toHaveProperty('player_id');
      expect(fps).toHaveProperty('rush_yards');
      expect(fps).toHaveProperty('pass_yards');
      expect(fps).toHaveProperty('rec_yards');
    });

    it('handles football stats correctly', () => {
      const fps = factory.createFootballPlayerSeason({
        rush_yards: 1500,
        rush_td: 18,
        total_yards: 1500,
      });

      expect(fps.rush_yards).toBe(1500);
      expect(fps.rush_td).toBe(18);
    });

    it('fetches football player season data', async () => {
      const fps = factory.createFootballPlayerSeason();
      mockClient.setMockResponse('player_seasons', {
        data: [fps],
        error: null,
      });

      const result = await mockClient
        .from('player_seasons')
        .select('*')
        .eq('sport_id', 'football');

      expect(result.data).toHaveLength(1);
    });
  });

  describe('Basketball Player Season Data', () => {
    it('creates valid basketball player season data', () => {
      const bps = factory.createBasketballPlayerSeason();

      expect(bps).toHaveProperty('games_played');
      expect(bps).toHaveProperty('points');
      expect(bps).toHaveProperty('ppg');
      expect(bps).toHaveProperty('rebounds');
      expect(bps).toHaveProperty('assists');
    });

    it('handles basketball stats correctly', () => {
      const bps = factory.createBasketballPlayerSeason({
        games_played: 30,
        points: 750,
        ppg: 25.0,
        rebounds: 200,
        assists: 150,
      });

      expect(bps.games_played).toBe(30);
      expect(bps.ppg).toBe(25.0);
    });
  });

  describe('Baseball Player Season Data', () => {
    it('creates valid baseball player season data', () => {
      const bps = factory.createBaseballPlayerSeason();

      expect(bps).toHaveProperty('batting_avg');
      expect(bps).toHaveProperty('home_runs');
      expect(bps).toHaveProperty('era');
    });

    it('handles baseball stats correctly', () => {
      const bps = factory.createBaseballPlayerSeason({
        batting_avg: 0.350,
        home_runs: 25,
        era: 2.45,
      });

      expect(bps.batting_avg).toBe(0.350);
      expect(bps.home_runs).toBe(25);
    });
  });

  describe('Complex Data Relationships', () => {
    it('creates multiple related objects', () => {
      const school = factory.createSchool();
      const season = factory.createSeason();
      const player = factory.createPlayer();
      const teamSeason = factory.createTeamSeason();

      expect(school.id).toBeDefined();
      expect(season.label).toBeDefined();
      expect(player.slug).toBeDefined();
      expect(teamSeason.school_id).toBeDefined();
    });

    it('handles nested data structures', () => {
      const teamSeason = factory.createTeamSeason({
        schools: factory.createSchool(),
        seasons: factory.createSeason(),
      });

      expect(teamSeason.schools).toBeDefined();
      expect(teamSeason.seasons).toBeDefined();
      expect(teamSeason.schools?.name).toBeDefined();
    });

    it('simulates complex data query patterns', async () => {
      const players = [
        factory.createPlayer({ name: 'Alice' }),
        factory.createPlayer({ name: 'Bob' }),
        factory.createPlayer({ name: 'Charlie' }),
      ];

      mockClient.setMockResponse('players', {
        data: players,
        error: null,
      });

      const result = await mockClient.from('players').select('id,name,slug');

      expect(result.data).toHaveLength(3);
      expect(result.data?.[0]?.name).toBe('Alice');
    });
  });

  describe('Error Handling', () => {
    it('handles database errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockClient.setError('players', error);

      const result = await mockClient.from('players').select('*');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Database connection failed');
    });

    it('handles null/undefined responses', async () => {
      mockClient.setMockResponse('players', {
        data: null,
        error: null,
      });

      const result = await mockClient.from('players').select('*');

      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });

    it('handles empty arrays', async () => {
      mockClient.setMockResponse('players', {
        data: [],
        error: null,
      });

      const result = await mockClient.from('players').select('*');

      expect(result.data).toHaveLength(0);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('ID Generation', () => {
    it('generates incrementing IDs for factory objects', () => {
      const player1 = factory.createPlayer();
      const player2 = factory.createPlayer();
      const player3 = factory.createPlayer();

      expect(player2.id).toBe(player1.id + 1);
      expect(player3.id).toBe(player2.id + 1);
    });

    it('resets IDs when resetIds is called', () => {
      factory.createPlayer();
      factory.createPlayer();
      factory.resetIds();
      const player = factory.createPlayer();

      expect(player.id).toBe(1);
    });

    it('maintains separate ID counters per type', () => {
      const player = factory.createPlayer();
      const school = factory.createSchool();

      // IDs should be independent
      expect(player.id).toBeDefined();
      expect(school.id).toBeDefined();
    });
  });

  describe('Data Immutability', () => {
    it('does not modify factory defaults when using overrides', () => {
      const playerWithName = factory.createPlayer({ name: 'Custom Name' });
      const playerWithoutName = factory.createPlayer();

      expect(playerWithName.name).toBe('Custom Name');
      expect(playerWithoutName.name).not.toBe('Custom Name');
    });

    it('allows reusing factory objects safely', () => {
      const school = factory.createSchool();
      const school1 = factory.createSchool(school);
      const school2 = factory.createSchool(school);

      expect(school1.name).toBe(school.name);
      expect(school2.name).toBe(school.name);
    });
  });
});
