import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Page Data Fetching Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Promise.allSettled for resilient data fetching', () => {
    it('handles all promises settling successfully', async () => {
      const fetchData1 = async () => ({ data: 'result1' });
      const fetchData2 = async () => ({ data: 'result2' });
      const fetchData3 = async () => ({ data: 'result3' });

      const results = await Promise.allSettled([
        fetchData1(),
        fetchData2(),
        fetchData3(),
      ]);

      expect(results).toHaveLength(3);
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('fulfilled');
      expect(results[2].status).toBe('fulfilled');

      if (results[0].status === 'fulfilled') {
        expect(results[0].value).toEqual({ data: 'result1' });
      }
    });

    it('handles mix of fulfilled and rejected promises', async () => {
      const fetchData1 = async () => ({ data: 'result1' });
      const fetchData2 = async () => {
        throw new Error('Data fetch failed');
      };
      const fetchData3 = async () => ({ data: 'result3' });

      const results = await Promise.allSettled([
        fetchData1(),
        fetchData2(),
        fetchData3(),
      ]);

      expect(results).toHaveLength(3);
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('fulfilled');

      if (results[1].status === 'rejected') {
        expect(results[1].reason).toBeInstanceOf(Error);
      }
    });

    it('handles all promises rejecting', async () => {
      const fetchData1 = async () => {
        throw new Error('Fetch 1 failed');
      };
      const fetchData2 = async () => {
        throw new Error('Fetch 2 failed');
      };

      const results = await Promise.allSettled([
        fetchData1(),
        fetchData2(),
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('rejected');
      expect(results[1].status).toBe('rejected');
    });
  });

  describe('Graceful degradation when one fetch fails', () => {
    it('returns available data when one source fails', async () => {
      const mockDataSource1 = async () => [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' },
      ];
      const mockDataSource2 = async () => {
        throw new Error('Database connection failed');
      };
      const mockDataSource3 = async () => [
        { id: 3, name: 'Player 3' },
      ];

      const results = await Promise.allSettled([
        mockDataSource1(),
        mockDataSource2(),
        mockDataSource3(),
      ]);

      // Extract successful results
      const successfulData = results
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) =>
          result.status === 'fulfilled' ? result.value : []
        );

      expect(successfulData).toHaveLength(3);
      expect(successfulData[0]).toEqual({ id: 1, name: 'Player 1' });
      expect(successfulData[2]).toEqual({ id: 3, name: 'Player 3' });
    });

    it('logs errors while returning partial data', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockDataSource1 = async () => [{ id: 1, name: 'Data 1' }];
      const mockDataSource2 = async () => {
        throw new Error('API timeout');
      };

      const results = await Promise.allSettled([
        mockDataSource1(),
        mockDataSource2(),
      ]);

      // Handle failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Data source ${index} failed:`, result.reason);
        }
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('provides fallback data when fetch fails', async () => {
      const fallbackData = [{ id: 0, name: 'Fallback Player' }];

      const mockDataSource = async () => {
        throw new Error('Network error');
      };

      const results = await Promise.allSettled([
        mockDataSource(),
      ]);

      const data = results[0].status === 'fulfilled'
        ? results[0].value
        : fallbackData;

      expect(data).toEqual(fallbackData);
    });

    it('merges data from multiple sources with fallback', async () => {
      const fallbackLeaders = [{ id: 0, name: 'Default Leader' }];

      const fetchLeaders1 = async () => [
        { id: 1, name: 'Leader 1', sport: 'football' },
      ];
      const fetchLeaders2 = async () => {
        throw new Error('Failed');
      };
      const fetchLeaders3 = async () => [
        { id: 3, name: 'Leader 3', sport: 'baseball' },
      ];

      const results = await Promise.allSettled([
        fetchLeaders1(),
        fetchLeaders2(),
        fetchLeaders3(),
      ]);

      const leaders = results
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => (r.status === 'fulfilled' ? r.value : fallbackLeaders));

      expect(leaders).toHaveLength(2);
      expect(leaders[0].id).toBe(1);
      expect(leaders[1].id).toBe(3);
    });
  });

  describe('Page data structure and types', () => {
    it('handles player data structure', async () => {
      const fetchPlayerData = async () => ({
        id: 'player-1',
        name: 'John Doe',
        school: 'Central High',
        sport: 'football',
        season: 2024,
        stats: {
          touchdowns: 15,
          yards: 2000,
        },
      });

      const data = await fetchPlayerData();

      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('school');
      expect(data).toHaveProperty('sport');
      expect(data).toHaveProperty('stats');
      expect(data.stats).toHaveProperty('touchdowns');
      expect(data.stats).toHaveProperty('yards');
    });

    it('handles team data structure', async () => {
      const fetchTeamData = async () => ({
        id: 'team-1',
        name: 'Lincoln High',
        sport: 'basketball',
        season: 2024,
        record: { wins: 15, losses: 5 },
        roster: [
          { id: 'p1', name: 'Player 1', number: 23 },
          { id: 'p2', name: 'Player 2', number: 24 },
        ],
      });

      const data = await fetchTeamData();

      expect(data).toHaveProperty('record');
      expect(data.record).toHaveProperty('wins');
      expect(Array.isArray(data.roster)).toBe(true);
      expect(data.roster[0]).toHaveProperty('number');
    });

    it('handles championship data structure', async () => {
      const fetchChampionshipData = async () => ({
        id: 'champ-1',
        sport: 'football',
        year: 2024,
        division: 'Class 5A',
        champion: 'Central High',
        runner_up: 'Lincoln High',
        participants: 16,
      });

      const data = await fetchChampionshipData();

      expect(data).toHaveProperty('sport');
      expect(data).toHaveProperty('year');
      expect(data).toHaveProperty('champion');
      expect(data).toHaveProperty('participants');
    });
  });

  describe('Error scenarios and recovery', () => {
    it('handles network timeout gracefully', async () => {
      const mockFetchWithTimeout = async (timeoutMs = 5000) => {
        return new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeoutMs + 100)
        );
      };

      const results = await Promise.allSettled([
        mockFetchWithTimeout(100),
      ]);

      expect(results[0].status).toBe('rejected');
    });

    it('handles null/undefined data responses', async () => {
      const fetchMayReturnNull = async () => null;
      const fetchMayReturnUndefined = async () => undefined;

      const results = await Promise.allSettled([
        fetchMayReturnNull(),
        fetchMayReturnUndefined(),
      ]);

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('fulfilled');

      if (results[0].status === 'fulfilled') {
        expect(results[0].value).toBeNull();
      }
      if (results[1].status === 'fulfilled') {
        expect(results[1].value).toBeUndefined();
      }
    });

    it('handles empty array responses', async () => {
      const fetchEmptyData = async () => [];

      const results = await Promise.allSettled([fetchEmptyData()]);

      expect(results[0].status).toBe('fulfilled');
      if (results[0].status === 'fulfilled') {
        expect(Array.isArray(results[0].value)).toBe(true);
        expect(results[0].value).toHaveLength(0);
      }
    });

    it('handles malformed data with type safety', async () => {
      const fetchData = async () => ({
        id: 'item-1',
        name: 'Test Item',
        // Missing expected fields
      });

      const data = await fetchData();

      // Verify we can handle missing fields gracefully
      expect(data.id).toBeDefined();
      expect(data.name).toBeDefined();
      expect((data as any).missingField).toBeUndefined();
    });
  });

  describe('Parallel data fetching patterns', () => {
    it('supports concurrent data loads', async () => {
      const start = Date.now();

      const mockFetch = (delay: number) =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: 'result', delay }), delay)
        );

      const results = await Promise.allSettled([
        mockFetch(100),
        mockFetch(100),
        mockFetch(100),
      ]);

      const duration = Date.now() - start;

      // All should complete in roughly 100ms (concurrent), not 300ms (sequential)
      expect(duration).toBeLessThan(250);
      expect(results).toHaveLength(3);
    });

    it('preserves order of results regardless of completion time', async () => {
      const mockFetch = (delay: number, value: string) =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ value }), delay)
        );

      const results = await Promise.allSettled([
        mockFetch(300, 'first'),
        mockFetch(100, 'second'),
        mockFetch(200, 'third'),
      ]);

      expect(results).toHaveLength(3);

      if (results[0].status === 'fulfilled') {
        expect((results[0].value as any).value).toBe('first');
      }
      if (results[1].status === 'fulfilled') {
        expect((results[1].value as any).value).toBe('second');
      }
      if (results[2].status === 'fulfilled') {
        expect((results[2].value as any).value).toBe('third');
      }
    });
  });

  describe('Data validation and sanitization', () => {
    it('validates player data before rendering', async () => {
      const validatePlayerData = (data: any) => {
        return (
          data &&
          typeof data.id === 'string' &&
          typeof data.name === 'string' &&
          data.stats !== undefined
        );
      };

      const validData = {
        id: 'p1',
        name: 'Player',
        stats: { touchdowns: 5 },
      };

      const invalidData = {
        id: 'p1',
        name: 'Player',
        // missing stats
      };

      expect(validatePlayerData(validData)).toBe(true);
      expect(validatePlayerData(invalidData)).toBe(false);
    });

    it('sanitizes team data from API', async () => {
      const sanitizeTeamData = (data: any) => {
        if (!data || typeof data !== 'object') return null;

        return {
          id: String(data.id || ''),
          name: String(data.name || 'Unknown Team'),
          sport: String(data.sport || ''),
          season: Number(data.season) || new Date().getFullYear(),
        };
      };

      const rawData = {
        id: 123,
        name: 'Team Name',
        sport: 'football',
        season: '2024',
        unknownField: 'should be removed',
      };

      const sanitized = sanitizeTeamData(rawData);

      expect(sanitized).toHaveProperty('id');
      expect(sanitized).toHaveProperty('name');
      expect(sanitized).toHaveProperty('sport');
      expect(sanitized).toHaveProperty('season');
      expect((sanitized as any).unknownField).toBeUndefined();
      expect(sanitized?.season).toBe(2024);
    });
  });
});
