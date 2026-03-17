import { cache } from 'react';
import { createClient, withErrorHandling, withRetry } from './common';

export interface PlayerClaim {
  id: number;
  player_id: number;
  claimant_name: string;
  claimant_email: string;
  claimant_phone?: string;
  relationship: string;
  parent_name?: string;
  parent_email?: string;
  measurables?: Record<string, any>;
  social_links?: Record<string, any>;
  recruiting_status?: string;
  recruiting_prefs?: Record<string, any>;
  consent_film: boolean;
  consent_contact: boolean;
  consent_academic: boolean;
  consent_email: boolean;
  consent_date?: string;
  status: string;
  verified_at?: string;
  verified_by?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all claims for a specific player
 * OPTIMIZED: Explicit column selection
 */
export const getPlayerClaims = cache(
  async (playerId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('player_claims')
              .select(
                'id, player_id, claimant_name, claimant_email, claimant_phone, relationship, parent_name, parent_email, measurables, social_links, recruiting_status, recruiting_prefs, consent_film, consent_contact, consent_academic, consent_email, consent_date, status, verified_at, verified_by, created_at, updated_at'
              )
              .eq('player_id', playerId)
              .order('created_at', { ascending: false });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_PLAYER_CLAIMS',
      { playerId }
    );
  }
);

/**
 * Get all pending claims (for admin review)
 * OPTIMIZED: Explicit column selection
 */
export const getPendingClaims = cache(
  async () => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('player_claims')
              .select(
                'id, player_id, claimant_name, claimant_email, claimant_phone, relationship, parent_name, parent_email, measurables, social_links, recruiting_status, recruiting_prefs, consent_film, consent_contact, consent_academic, consent_email, consent_date, status, verified_at, verified_by, created_at, updated_at'
              )
              .eq('status', 'pending')
              .order('created_at', { ascending: true });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_PENDING_CLAIMS',
      {}
    );
  }
);

/**
 * Get a specific claim by ID
 * OPTIMIZED: Explicit column selection
 */
export const getClaimById = cache(
  async (claimId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('player_claims')
              .select(
                'id, player_id, claimant_name, claimant_email, claimant_phone, relationship, parent_name, parent_email, measurables, social_links, recruiting_status, recruiting_prefs, consent_film, consent_contact, consent_academic, consent_email, consent_date, status, verified_at, verified_by, created_at, updated_at'
              )
              .eq('id', claimId)
              .single();
            return data ?? null;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      'DATA_CLAIM_BY_ID',
      { claimId }
    );
  }
);
