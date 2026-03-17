/**
 * School Admin Portal data layer
 */

import { createClient } from "./common";

// ============================================================================
// Types
// ============================================================================

export interface SchoolAdminAccess {
  id: number;
  user_id: string;
  school_id: number;
  school_name: string;
  school_slug: string;
  role: 'editor' | 'admin';
  approved: boolean;
  created_at: string;
}

export interface SchoolAnalytics {
  school_id: number;
  school_name: string;
  page_views_30d: number;
  player_profile_views: number;
  recruiter_views: number;
  top_viewed_players: Array<{
    player_id: number;
    player_name: string;
    views: number;
  }>;
}

export interface AccessRequest {
  id: number;
  user_id: string;
  school_id: number;
  school_name: string;
  role: 'editor' | 'admin';
  approved: boolean;
  created_at: string;
}

// ============================================================================
// Functions
// ============================================================================

/**
 * Get all schools an authenticated user is admin for
 */
export async function getSchoolAdminAccess(
  userId: string
): Promise<SchoolAdminAccess[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_admins")
    .select(
      `
      id,
      user_id,
      school_id,
      role,
      approved,
      created_at,
      schools (
        id,
        name,
        slug
      )
    `
    )
    .eq("user_id", userId)
    .returns<
      Array<{
        id: number;
        user_id: string;
        school_id: number;
        role: string;
        approved: boolean;
        created_at: string;
        schools: { id: number; name: string; slug: string } | null;
      }>
    >();

  if (error) {
    throw new Error(`Failed to fetch school admin access: ${error.message}`);
  }

  return (data || []).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    school_id: row.school_id,
    school_name: row.schools?.name || "Unknown",
    school_slug: row.schools?.slug || "",
    role: row.role as "editor" | "admin",
    approved: row.approved,
    created_at: row.created_at,
  }));
}

/**
 * Check if user is an approved admin for a specific school
 */
export async function isSchoolAdmin(
  userId: string,
  schoolId: number
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_admins")
    .select("id")
    .eq("user_id", userId)
    .eq("school_id", schoolId)
    .eq("approved", true)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found, which is fine
    throw new Error(`Failed to check school admin status: ${error.message}`);
  }

  return !!data;
}

/**
 * Get analytics for a school (if user is admin)
 * Note: This is a simplified version. A real implementation would
 * track page views in a separate analytics table.
 */
export async function getSchoolAnalytics(
  schoolId: number
): Promise<SchoolAnalytics> {
  const supabase = await createClient();

  const { data: schoolData, error: schoolError } = await supabase
    .from("schools")
    .select("id, name")
    .eq("id", schoolId)
    .single();

  if (schoolError) {
    throw new Error(
      `Failed to fetch school for analytics: ${schoolError.message}`
    );
  }

  // Get top players from this school
  const { data: playerData, error: playerError } = await supabase
    .from("players")
    .select("id, name")
    .eq("primary_school_id", schoolId)
    .limit(10);

  if (playerError) {
    throw new Error(`Failed to fetch school players: ${playerError.message}`);
  }

  // TODO: Track actual page views in analytics table
  // For now, return placeholder metrics
  return {
    school_id: schoolId,
    school_name: schoolData?.name || "Unknown",
    page_views_30d: 0,
    player_profile_views: 0,
    recruiter_views: 0,
    top_viewed_players: (playerData || []).map((p) => ({
      player_id: p.id,
      player_name: p.name,
      views: 0,
    })),
  };
}

/**
 * Request admin access for a school
 * Creates a pending record that admins must approve
 */
export async function requestSchoolAccess(
  userId: string,
  schoolId: number,
  role: "editor" | "admin" = "editor"
): Promise<AccessRequest> {
  const supabase = await createClient();

  // Check if request already exists
  const { data: existing } = await supabase
    .from("school_admins")
    .select("id")
    .eq("user_id", userId)
    .eq("school_id", schoolId)
    .single();

  if (existing) {
    throw new Error(
      "You have already requested access to this school. Please wait for admin approval."
    );
  }

  const { data, error } = await supabase
    .from("school_admins")
    .insert({
      user_id: userId,
      school_id: schoolId,
      role,
      approved: false,
    })
    .select(
      `
      id,
      user_id,
      school_id,
      role,
      approved,
      created_at,
      schools (
        id,
        name
      )
    `
    )
    .single()
    .returns<{
      id: number;
      user_id: string;
      school_id: number;
      role: string;
      approved: boolean;
      created_at: string;
      schools: { id: number; name: string } | null;
    }>();

  if (error) {
    throw new Error(`Failed to request school access: ${error.message}`);
  }

  return {
    id: data!.id,
    user_id: data!.user_id,
    school_id: data!.school_id,
    school_name: data!.schools?.name || "Unknown",
    role: data!.role as "editor" | "admin",
    approved: data!.approved,
    created_at: data!.created_at,
  };
}

/**
 * Get all pending access requests (admin only)
 */
export async function getPendingAccessRequests(): Promise<AccessRequest[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_admins")
    .select(
      `
      id,
      user_id,
      school_id,
      role,
      approved,
      created_at,
      schools (
        id,
        name
      )
    `
    )
    .eq("approved", false)
    .returns<
      Array<{
        id: number;
        user_id: string;
        school_id: number;
        role: string;
        approved: boolean;
        created_at: string;
        schools: { id: number; name: string } | null;
      }>
    >();

  if (error) {
    throw new Error(`Failed to fetch access requests: ${error.message}`);
  }

  return (data || []).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    school_id: row.school_id,
    school_name: row.schools?.name || "Unknown",
    role: row.role as "editor" | "admin",
    approved: row.approved,
    created_at: row.created_at,
  }));
}

/**
 * Approve or reject a school admin request
 */
export async function respondToAccessRequest(
  requestId: number,
  approved: boolean,
  approvedBy: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("school_admins")
    .update({
      approved,
      approved_by: approved ? approvedBy : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    throw new Error(`Failed to respond to access request: ${error.message}`);
  }
}
