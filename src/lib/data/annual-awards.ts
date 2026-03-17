/**
 * Annual awards system data layer
 */

import { createClient } from "./common";

// ============================================================================
// Types
// ============================================================================

export interface AnnualAwardNominee {
  player_id: number;
  school_id: number;
  player_name: string;
  school_name: string;
  stats_summary?: string;
  votes?: number;
}

export interface AnnualAward {
  id: number;
  name: string;
  sport_id?: string;
  category: "player" | "team" | "coach" | "community";
  season_id?: number;
  description?: string;
  nominees: AnnualAwardNominee[];
  winner_player_id?: number;
  winner_school_id?: number;
  voting_open: boolean;
  voting_start?: string;
  voting_end?: string;
  ceremony_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AwardResult {
  award_id: number;
  award_name: string;
  category: string;
  winner_player_id?: number;
  winner_player_name?: string;
  winner_school_id?: number;
  winner_school_name?: string;
  season_id?: number;
  votes?: Array<{
    nominee_index: number;
    vote_count: number;
  }>;
}

// ============================================================================
// Functions
// ============================================================================

/**
 * Get currently active awards (open for voting)
 */
export async function getActiveAwards(seasonId?: number): Promise<AnnualAward[]> {
  const supabase = await createClient();

  let query = supabase
    .from("annual_awards")
    .select("*")
    .eq("voting_open", true)
    .order("created_at", { ascending: false });

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch active awards: ${error.message}`);
  }

  return (data || []).map((award: any) => ({
    ...award,
    nominees: award.nominees || [],
  })) as AnnualAward[];
}

/**
 * Get award by ID with vote counts
 */
export async function getAwardById(awardId: number): Promise<AnnualAward | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("annual_awards")
    .select("*")
    .eq("id", awardId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    throw new Error(`Failed to fetch award: ${error.message}`);
  }

  if (!data) return null;

  // If voting is open, fetch vote counts
  if ((data as any).voting_open) {
    const { data: votes } = await supabase
      .from("annual_award_votes")
      .select("nominee_index")
      .eq("award_id", awardId);

    const nominees = ((data as any).nominees || []) as AnnualAwardNominee[];
    const voteCounts: Record<number, number> = {};

    (votes || []).forEach((vote: any) => {
      voteCounts[vote.nominee_index] =
        (voteCounts[vote.nominee_index] || 0) + 1;
    });

    return {
      ...(data as any),
      nominees: nominees.map((nom, idx) => ({
        ...nom,
        votes: voteCounts[idx] || 0,
      })),
    } as AnnualAward;
  }

  return (data as any) as AnnualAward;
}

/**
 * Get all awards for a season with results
 */
export async function getAwardResults(seasonId: number): Promise<AwardResult[]> {
  const supabase = await createClient();

  const { data: awards, error } = await supabase
    .from("annual_awards")
    .select("*")
    .eq("season_id", seasonId);

  if (error) {
    throw new Error(`Failed to fetch awards: ${error.message}`);
  }

  // For each award, get vote counts
  const results: AwardResult[] = [];

  for (const award of awards || []) {
    const { data: votes } = await supabase
      .from("annual_award_votes")
      .select("nominee_index")
      .eq("award_id", award.id);

    const voteCounts: Record<number, number> = {};
    (votes || []).forEach((vote: any) => {
      voteCounts[vote.nominee_index] =
        (voteCounts[vote.nominee_index] || 0) + 1;
    });

    results.push({
      award_id: award.id,
      award_name: award.name,
      category: award.category,
      winner_player_id: award.winner_player_id,
      winner_school_id: award.winner_school_id,
      season_id: award.season_id,
      votes: Object.entries(voteCounts).map(([idx, count]) => ({
        nominee_index: parseInt(idx),
        vote_count: count,
      })),
    });
  }

  return results;
}

/**
 * Get historical winners for an award
 */
export async function getPastWinners(awardName: string): Promise<AwardResult[]> {
  const supabase = await createClient();

  const { data: awards, error } = await supabase
    .from("annual_awards")
    .select("*")
    .eq("name", awardName)
    .not("winner_player_id", "is", null)
    .order("season_id", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch past winners: ${error.message}`);
  }

  return (awards || []).map((award: any) => ({
    award_id: award.id,
    award_name: award.name,
    category: award.category,
    winner_player_id: award.winner_player_id,
    winner_school_id: award.winner_school_id,
    season_id: award.season_id,
  })) as AwardResult[];
}

/**
 * Create a new annual award
 */
export async function createAnnualAward(
  award: Omit<AnnualAward, "id" | "created_at" | "updated_at">
): Promise<AnnualAward> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("annual_awards")
    .insert(award)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create award: ${error.message}`);
  }

  return (data as any) as AnnualAward;
}

/**
 * Update an annual award
 */
export async function updateAnnualAward(
  awardId: number,
  updates: Partial<AnnualAward>
): Promise<AnnualAward> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("annual_awards")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", awardId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update award: ${error.message}`);
  }

  return (data as any) as AnnualAward;
}

/**
 * Cast a vote for an award nominee
 */
export async function castAwardVote(
  awardId: number,
  nomineeIndex: number,
  voterId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("annual_award_votes").insert({
    award_id: awardId,
    nominee_index: nomineeIndex,
    voter_id: voterId,
  });

  if (error && error.code !== "23505") {
    // 23505 = unique constraint violation (user already voted)
    throw new Error(`Failed to cast vote: ${error.message}`);
  }

  if (error?.code === "23505") {
    throw new Error("You have already voted for this award");
  }
}

/**
 * Check if user has already voted for an award
 */
export async function hasUserVoted(
  awardId: number,
  voterId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("annual_award_votes")
    .select("id")
    .eq("award_id", awardId)
    .eq("voter_id", voterId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    throw new Error(`Failed to check vote status: ${error.message}`);
  }

  return !!data;
}

/**
 * Get vote counts for all nominees of an award
 */
export async function getAwardVoteCounts(
  awardId: number
): Promise<Record<number, number>> {
  const supabase = await createClient();

  const { data: votes, error } = await supabase
    .from("annual_award_votes")
    .select("nominee_index")
    .eq("award_id", awardId);

  if (error) {
    throw new Error(`Failed to fetch votes: ${error.message}`);
  }

  const counts: Record<number, number> = {};
  (votes || []).forEach((vote: any) => {
    counts[vote.nominee_index] = (counts[vote.nominee_index] || 0) + 1;
  });

  return counts;
}
