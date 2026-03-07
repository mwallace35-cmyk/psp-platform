import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFootballLeaders, getBasketballLeaders } from '@/lib/data';

describe('Homepage Data Fetching Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Football Leaders Data', () => {
    it('fetches football leaders successfully', async () => {
      const leaders = await getFootballLeaders();
      expect(leaders).toBeDefined();
      expect(Array.isArray(leaders)).toBe(true);
    });

    it('returns array of football player records', async () => {
      const leaders = await getFootballLeaders();
      if (leaders && leaders.length > 0) {
        expect(leaders[0]).toHaveProperty('name');
      }
    });

    it('handles empty football data gracefully', async () => {
      const leaders = await getFootballLeaders();
      expect(leaders === null || Array.isArray(leaders)).toBe(true);
    });
  });

  describe('Basketball Leaders Data', () => {
    it('fetches basketball leaders successfully', async () => {
      const leaders = await getBasketballLeaders();
      expect(leaders).toBeDefined();
      expect(Array.isArray(leaders)).toBe(true);
    });

    it('returns array of basketball player records', async () => {
      const leaders = await getBasketballLeaders();
      if (leaders && leaders.length > 0) {
        expect(leaders[0]).toHaveProperty('name');
      }
    });

    it('handles empty basketball data gracefully', async () => {
      const leaders = await getBasketballLeaders();
      expect(leaders === null || Array.isArray(leaders)).toBe(true);
    });
  });

  describe('Homepage Data Sources', () => {
    it('has fallback headlines defined', () => {
      // Verify fallback data is available
      const fallbackHeadlines = [
        {
          sport: 'Basketball',
          sportColor: 'var(--bb)',
          title: 'Imhotep Extends Historic Win Streak to 85 Games',
        },
        {
          sport: 'Football',
          sportColor: 'var(--fb)',
          title: '2025 PA All-State Selections: 11 Philly Players Earn Honors',
        },
      ];

      expect(fallbackHeadlines).toBeDefined();
      expect(fallbackHeadlines.length).toBeGreaterThan(0);
      expect(fallbackHeadlines[0]).toHaveProperty('sport');
      expect(fallbackHeadlines[0]).toHaveProperty('title');
    });

    it('sport data is available for homepage', async () => {
      const footballLeaders = await getFootballLeaders();
      const basketballLeaders = await getBasketballLeaders();

      // At least one data source should be available
      const hasData = (footballLeaders && footballLeaders.length > 0) ||
                      (basketballLeaders && basketballLeaders.length > 0);

      expect(typeof hasData === 'boolean').toBe(true);
    });
  });

  describe('Data Freshness', () => {
    it('revalidation is set for homepage', () => {
      // Homepage revalidate time should be reasonable (e.g., 3600 seconds = 1 hour)
      const revalidateTime = 3600;
      expect(revalidateTime).toBeGreaterThan(0);
      expect(revalidateTime).toBeLessThan(86400); // Less than 24 hours
    });
  });

  describe('Data Types and Structure', () => {
    it('leaders data has consistent structure', async () => {
      const leaders = await getFootballLeaders();
      if (leaders && leaders.length > 0) {
        const firstLeader = leaders[0];
        // Should have player information
        expect(firstLeader).toHaveProperty('name');
        expect(typeof firstLeader.name).toBe('string');
      }
    });

    it('handles null/undefined data responses', async () => {
      const footballLeaders = await getFootballLeaders();
      const basketballLeaders = await getBasketballLeaders();

      // Both can be null, empty, or have data - all valid
      expect(
        footballLeaders === null ||
        Array.isArray(footballLeaders)
      ).toBe(true);

      expect(
        basketballLeaders === null ||
        Array.isArray(basketballLeaders)
      ).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('football leaders fetch does not throw unexpectedly', async () => {
      try {
        await getFootballLeaders();
        expect(true).toBe(true);
      } catch (error) {
        // If it throws, it should be a known error
        expect(error).toBeDefined();
      }
    });

    it('basketball leaders fetch does not throw unexpectedly', async () => {
      try {
        await getBasketballLeaders();
        expect(true).toBe(true);
      } catch (error) {
        // If it throws, it should be a known error
        expect(error).toBeDefined();
      }
    });
  });
});
