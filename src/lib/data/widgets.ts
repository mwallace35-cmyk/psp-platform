/**
 * Widget system data layer
 */

import { createClient } from "./common";
import { randomBytes } from "crypto";

// ============================================================================
// Types
// ============================================================================

export interface WidgetConfig {
  id: number;
  school_id: number;
  widget_type: "schedule" | "roster" | "record" | "scores" | "stats";
  sport_id?: string;
  season_id?: number;
  config: Record<string, unknown>;
  embed_key: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface WidgetData {
  type: string;
  content: Record<string, unknown>;
}

// ============================================================================
// Functions
// ============================================================================

/**
 * Generate a unique embed key for a widget
 */
function generateEmbedKey(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Get widget config by embed key
 */
export async function getWidgetConfig(embedKey: string): Promise<WidgetConfig | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("widget_configs")
    .select("*")
    .eq("embed_key", embedKey)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    throw new Error(`Failed to fetch widget config: ${error.message}`);
  }

  return data as WidgetConfig | null;
}

/**
 * Get all widgets for a school
 */
export async function getWidgetsBySchool(schoolId: number): Promise<WidgetConfig[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("widget_configs")
    .select("*")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch widgets: ${error.message}`);
  }

  return (data || []) as WidgetConfig[];
}

/**
 * Get all widgets (admin only)
 */
export async function getAllWidgets(): Promise<WidgetConfig[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("widget_configs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all widgets: ${error.message}`);
  }

  return (data || []) as WidgetConfig[];
}

/**
 * Create a new widget config
 */
export async function createWidget(
  schoolId: number,
  widgetType: "schedule" | "roster" | "record" | "scores" | "stats",
  options: {
    sport_id?: string;
    season_id?: number;
    config?: Record<string, unknown>;
  } = {}
): Promise<WidgetConfig> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("widget_configs")
    .insert({
      school_id: schoolId,
      widget_type: widgetType,
      sport_id: options.sport_id,
      season_id: options.season_id,
      config: options.config || {},
      embed_key: generateEmbedKey(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create widget: ${error.message}`);
  }

  return data as WidgetConfig;
}

/**
 * Update widget config
 */
export async function updateWidget(
  widgetId: number,
  updates: Partial<WidgetConfig>
): Promise<WidgetConfig> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("widget_configs")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", widgetId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update widget: ${error.message}`);
  }

  return data as WidgetConfig;
}

/**
 * Delete a widget
 */
export async function deleteWidget(widgetId: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("widget_configs")
    .delete()
    .eq("id", widgetId);

  if (error) {
    throw new Error(`Failed to delete widget: ${error.message}`);
  }
}

/**
 * Increment view count for a widget
 */
export async function incrementWidgetViews(widgetId: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_widget_views", {
    widget_id: widgetId,
  });

  if (error) {
    // If RPC doesn't exist, fall back to manual update
    const { data: widget } = await supabase
      .from("widget_configs")
      .select("views")
      .eq("id", widgetId)
      .single();

    if (widget) {
      await supabase
        .from("widget_configs")
        .update({ views: (widget.views || 0) + 1 })
        .eq("id", widgetId);
    }
  }
}

/**
 * Get widget data based on type and config
 * This would fetch actual data from the database
 */
export async function getWidgetData(
  config: WidgetConfig
): Promise<WidgetData> {
  const supabase = await createClient();

  const schoolId = config.school_id;
  const sportId = config.sport_id;
  const seasonId = config.season_id;

  switch (config.widget_type) {
    case "schedule": {
      // Get upcoming games
      const { data: games } = await supabase
        .from("games")
        .select(
          `
          id,
          game_date,
          home_school_id,
          away_school_id,
          home_score,
          away_score,
          home_school:schools!games_home_school_id_fkey(id, name, slug),
          away_school:schools!games_away_school_id_fkey(id, name, slug)
        `
        )
        .eq("sport_id", sportId || "football")
        .eq("season_id", seasonId || 0)
        .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
        .order("game_date", { ascending: true })
        .limit(10);

      return {
        type: "schedule",
        content: { games: games || [] },
      };
    }

    case "roster": {
      // Get team roster
      const { data: roster } = await supabase
        .from("rosters")
        .select(
          `
          id,
          jersey_number,
          position,
          players(id, name, slug)
        `
        )
        .eq("school_id", schoolId)
        .eq("sport_id", sportId || "football")
        .eq("season_id", seasonId || 0)
        .limit(100);

      return {
        type: "roster",
        content: { roster: roster || [] },
      };
    }

    case "record": {
      // Get current season record
      const { data: teamSeason } = await supabase
        .from("team_seasons")
        .select("wins, losses, ties")
        .eq("school_id", schoolId)
        .eq("sport_id", sportId || "football")
        .eq("season_id", seasonId || 0)
        .single();

      return {
        type: "record",
        content: {
          wins: teamSeason?.wins || 0,
          losses: teamSeason?.losses || 0,
          ties: teamSeason?.ties || 0,
        },
      };
    }

    case "scores": {
      // Get recent game scores
      const { data: games } = await supabase
        .from("games")
        .select(
          `
          id,
          game_date,
          home_school_id,
          away_school_id,
          home_score,
          away_score,
          home_school:schools!games_home_school_id_fkey(id, name, slug),
          away_school:schools!games_away_school_id_fkey(id, name, slug)
        `
        )
        .eq("sport_id", sportId || "football")
        .eq("season_id", seasonId || 0)
        .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
        .not("home_score", "is", null)
        .order("game_date", { ascending: false })
        .limit(10);

      return {
        type: "scores",
        content: { games: games || [] },
      };
    }

    case "stats":
    default: {
      // Get school stats
      const { data: stats } = await supabase
        .from("team_seasons")
        .select("wins, losses, ties, points_for, points_against")
        .eq("school_id", schoolId)
        .eq("sport_id", sportId || "football");

      return {
        type: "stats",
        content: { seasons: stats || [] },
      };
    }
  }
}
