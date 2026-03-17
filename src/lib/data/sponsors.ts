/**
 * Sponsor management data layer
 */

import { createClient } from "./common";

// ============================================================================
// Types
// ============================================================================

export interface Sponsor {
  id: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  website_url?: string;
  tier: "basic" | "premium" | "platinum";
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface SponsorPlacement {
  id: number;
  sponsor_id: number;
  placement_type: "school_page" | "sport_hub" | "homepage" | "sidebar" | "pickem";
  target_entity_type?: "school" | "sport" | "league";
  target_entity_id?: number;
  creative_html?: string;
  impression_count: number;
  click_count: number;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  sponsors?: Sponsor;
}

export interface SponsorStats {
  sponsor_id: number;
  sponsor_name: string;
  total_impressions: number;
  total_clicks: number;
  ctr: number; // click-through rate
  placements: Array<{
    id: number;
    placement_type: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
}

// ============================================================================
// Functions
// ============================================================================

/**
 * Get active sponsor for a specific placement slot
 */
export async function getActiveSponsor(
  placementType: string,
  entityType?: string,
  entityId?: number
): Promise<SponsorPlacement | null> {
  const supabase = await createClient();

  let query = supabase
    .from("sponsor_placements")
    .select(
      `
      *,
      sponsors (
        id,
        name,
        logo_url,
        website_url
      )
    `
    )
    .eq("placement_type", placementType)
    .eq("is_active", true)
    .gte("start_date", new Date().toISOString().split("T")[0]);

  // Filter by entity if specified
  if (entityType && entityId) {
    query = query
      .eq("target_entity_type", entityType)
      .eq("target_entity_id", entityId);
  } else {
    // Get site-wide placement (no entity specified)
    query = query.is("target_entity_type", null).is("target_entity_id", null);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found, which is fine
    throw new Error(`Failed to fetch sponsor placement: ${error.message}`);
  }

  return (data as SponsorPlacement) || null;
}

/**
 * Get all sponsors (admin only)
 */
export async function getAllSponsors(): Promise<Sponsor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch sponsors: ${error.message}`);
  }

  return (data || []) as Sponsor[];
}

/**
 * Get sponsor by ID
 */
export async function getSponsorById(sponsorId: number): Promise<Sponsor | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("id", sponsorId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Failed to fetch sponsor: ${error.message}`);
  }

  return (data as Sponsor) || null;
}

/**
 * Get all placements for a sponsor
 */
export async function getSponsorPlacements(sponsorId: number): Promise<SponsorPlacement[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsor_placements")
    .select("*")
    .eq("sponsor_id", sponsorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch sponsor placements: ${error.message}`);
  }

  return (data || []) as SponsorPlacement[];
}

/**
 * Get stats for a sponsor (impressions, clicks, CTR)
 */
export async function getSponsorStats(sponsorId: number): Promise<SponsorStats> {
  const supabase = await createClient();

  const [sponsorData, placementsData] = await Promise.all([
    supabase.from("sponsors").select("*").eq("id", sponsorId).single(),
    supabase
      .from("sponsor_placements")
      .select("*")
      .eq("sponsor_id", sponsorId),
  ]);

  if (sponsorData.error) {
    throw new Error(`Failed to fetch sponsor: ${sponsorData.error.message}`);
  }

  const sponsor = sponsorData.data as Sponsor;
  const placements = (placementsData.data || []) as SponsorPlacement[];

  const totalImpressions = placements.reduce(
    (sum, p) => sum + (p.impression_count || 0),
    0
  );
  const totalClicks = placements.reduce(
    (sum, p) => sum + (p.click_count || 0),
    0
  );

  return {
    sponsor_id: sponsorId,
    sponsor_name: sponsor.name,
    total_impressions: totalImpressions,
    total_clicks: totalClicks,
    ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    placements: placements.map((p) => {
      const impressions = p.impression_count || 0;
      const clicks = p.click_count || 0;
      return {
        id: p.id,
        placement_type: p.placement_type,
        impressions,
        clicks,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      };
    }),
  };
}

/**
 * Create a new sponsor
 */
export async function createSponsor(
  sponsor: Omit<Sponsor, "id" | "created_at" | "updated_at">
): Promise<Sponsor> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .insert(sponsor)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create sponsor: ${error.message}`);
  }

  return data as Sponsor;
}

/**
 * Update a sponsor
 */
export async function updateSponsor(
  sponsorId: number,
  updates: Partial<Sponsor>
): Promise<Sponsor> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sponsorId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update sponsor: ${error.message}`);
  }

  return data as Sponsor;
}

/**
 * Create a sponsor placement
 */
export async function createPlacement(
  placement: Omit<SponsorPlacement, "id" | "created_at" | "updated_at">
): Promise<SponsorPlacement> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsor_placements")
    .insert(placement)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create placement: ${error.message}`);
  }

  return data as SponsorPlacement;
}

/**
 * Update a placement
 */
export async function updatePlacement(
  placementId: number,
  updates: Partial<SponsorPlacement>
): Promise<SponsorPlacement> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsor_placements")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", placementId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update placement: ${error.message}`);
  }

  return data as SponsorPlacement;
}

/**
 * Record an impression for a placement
 */
export async function recordImpression(placementId: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_placement_impressions", {
    placement_id: placementId,
  });

  if (error) {
    // If RPC doesn't exist, fall back to manual update
    const { data: placement } = await supabase
      .from("sponsor_placements")
      .select("impression_count")
      .eq("id", placementId)
      .single();

    if (placement) {
      await supabase
        .from("sponsor_placements")
        .update({
          impression_count: (placement.impression_count || 0) + 1,
        })
        .eq("id", placementId);
    }
  }
}

/**
 * Record a click for a placement
 */
export async function recordClick(placementId: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_placement_clicks", {
    placement_id: placementId,
  });

  if (error) {
    // If RPC doesn't exist, fall back to manual update
    const { data: placement } = await supabase
      .from("sponsor_placements")
      .select("click_count")
      .eq("id", placementId)
      .single();

    if (placement) {
      await supabase
        .from("sponsor_placements")
        .update({
          click_count: (placement.click_count || 0) + 1,
        })
        .eq("id", placementId);
    }
  }
}
