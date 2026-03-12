import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  Season,
} from "./common";

/**
 * Roster entry with player details
 */
export interface RosterEntry {
  id: number;
  player_id: number;
  school_id: number;
  sport_id: string;
  season_id: number;
  jersey_number?: string;
  position?: string;
  height?: string;
  weight?: string;
  class?: string;
  players?: {
    id: number;
    name: string;
    slug: string;
  };
}

/**
 * Season with roster availability
 */
export interface RosterSeason {
  id: number;
  season_id: number;
  label: string;
  year_start: number;
  year_end: number;
  hasRoster: boolean;
}

/**
 * Get team roster for a specific season
 */
export const getTeamRoster = cache(
  async (schoolId: number, sportId: string, seasonId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data } = await supabase
              .from("rosters")
              .select(
                `
                id,
                player_id,
                school_id,
                sport_id,
                season_id,
                jersey_number,
                position,
                height,
                weight,
                class,
                players(id, name, slug)
              `
              )
              .eq("school_id", schoolId)
              .eq("sport_id", sportId)
              .eq("season_id", seasonId)
              .order("position")
              .order("jersey_number")
              .limit(500);

            return (data || []) as unknown as RosterEntry[];
          },
          { maxRetries: 2 }
        );
      },
      [],
      "getTeamRoster",
      { schoolId, sportId, seasonId }
    );
  }
);

/**
 * Get available roster seasons for a school and sport
 */
export const getRosterSeasons = cache(
  async (schoolId: number, sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // First, get all team seasons for this school/sport
            const { data: teamSeasons } = await supabase
              .from("team_seasons")
              .select(
                `
                id,
                season_id,
                seasons(id, label, year_start, year_end)
              `
              )
              .eq("school_id", schoolId)
              .eq("sport_id", sportId)
              .is("deleted_at", null)
              .order("seasons.year_start", { ascending: false })
              .limit(200);

            interface TeamSeasonRecord {
              season_id: number;
              seasons?: { id: number; label: string; year_start: number; year_end: number };
            }

            const seasons = (teamSeasons || []) as unknown as TeamSeasonRecord[];

            // Now check which seasons have rosters
            const seasonsWithRosterInfo: RosterSeason[] = [];
            for (const season of seasons) {
              if (season.seasons) {
                const { data: roster } = await supabase
                  .from("rosters")
                  .select("id")
                  .eq("school_id", schoolId)
                  .eq("sport_id", sportId)
                  .eq("season_id", season.season_id)
                  .limit(1);

                seasonsWithRosterInfo.push({
                  id: season.seasons.id,
                  season_id: season.season_id,
                  label: season.seasons.label,
                  year_start: season.seasons.year_start,
                  year_end: season.seasons.year_end,
                  hasRoster: (roster?.length ?? 0) > 0,
                });
              }
            }

            return seasonsWithRosterInfo;
          },
          { maxRetries: 2 }
        );
      },
      [],
      "getRosterSeasons",
      { schoolId, sportId }
    );
  }
);

/**
 * Get roster count by school and season
 */
export const getRosterCount = cache(
  async (schoolId: number, sportId: string, seasonId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { count } = await supabase
              .from("rosters")
              .select("id", { count: "exact" })
              .eq("school_id", schoolId)
              .eq("sport_id", sportId)
              .eq("season_id", seasonId);

            return count || 0;
          },
          { maxRetries: 2 }
        );
      },
      0,
      "getRosterCount",
      { schoolId, sportId, seasonId }
    );
  }
);

/**
 * Group roster by position
 */
export function groupRosterByPosition(roster: RosterEntry[]): Record<string, RosterEntry[]> {
  const grouped: Record<string, RosterEntry[]> = {};

  for (const entry of roster) {
    const position = entry.position || "No Position";
    if (!grouped[position]) {
      grouped[position] = [];
    }
    grouped[position].push(entry);
  }

  // Sort players within each position by jersey number
  for (const position in grouped) {
    grouped[position].sort((a, b) => {
      const aNum = parseInt(a.jersey_number || "0");
      const bNum = parseInt(b.jersey_number || "0");
      return aNum - bNum;
    });
  }

  return grouped;
}
