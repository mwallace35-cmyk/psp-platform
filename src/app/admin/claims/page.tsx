'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Badge } from '@/components/ui';

interface PlayerClaim {
  id: number;
  player_id: number | null;
  claimant_name: string;
  claimant_email: string;
  claimant_phone: string | null;
  relationship: string;
  parent_name: string | null;
  parent_email: string | null;
  measurables: Record<string, any>;
  social_links: Record<string, any>;
  recruiting_status: string | null;
  recruiting_prefs: Record<string, any>;
  consent_film: boolean;
  consent_contact: boolean;
  consent_academic: boolean;
  consent_email: boolean;
  consent_date: string | null;
  status: string;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
  players?: { name: string; slug: string };
}

export default function PlayerClaimsAdmin() {
  const [claims, setClaims] = useState<PlayerClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [processing, setProcessing] = useState<Record<number, boolean>>({});

  const supabase = createClient();

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  async function fetchClaims() {
    setLoading(true);
    try {
      let query = supabase
        .from('player_claims')
        .select(`
          *,
          players(name, slug)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;

      setClaims(
        (data || []).map((c) => ({
          ...c,
          players: Array.isArray(c.players) ? c.players[0] : c.players,
        })) as PlayerClaim[]
      );
    } catch (err) {
      console.error('Error fetching claims:', err);
      window.alert('Failed to load claims');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(id: number, claim: PlayerClaim) {
    setProcessing((prev) => ({ ...prev, [id]: true }));
    try {
      // Update claim status
      const { error: claimError } = await supabase
        .from('player_claims')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (claimError) throw claimError;

      // Update player with social data if available
      if (claim.player_id && claim.social_links) {
        const updateData: Record<string, any> = {
          is_verified: true,
          contact_email: claim.claimant_email,
        };

        if (claim.social_links.twitter) {
          updateData.twitter_handle = claim.social_links.twitter;
        }
        if (claim.social_links.instagram) {
          updateData.instagram_handle = claim.social_links.instagram;
        }
        if (claim.social_links.hudl) {
          updateData.hudl_profile_url = claim.social_links.hudl;
        }

        if (claim.recruiting_status) {
          updateData.recruiting_status = claim.recruiting_status;
        }

        const { error: playerError } = await supabase
          .from('players')
          .update(updateData)
          .eq('id', claim.player_id);

        if (playerError) throw playerError;
      }

      window.alert('Claim verified successfully!');
      fetchClaims();
    } catch (err) {
      console.error('Error verifying claim:', err);
      window.alert('Failed to verify claim. Please try again.');
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleReject(id: number) {
    setProcessing((prev) => ({ ...prev, [id]: true }));
    try {
      const { error } = await supabase
        .from('player_claims')
        .update({
          status: 'rejected',
          verified_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      window.alert('Claim rejected.');
      fetchClaims();
    } catch (err) {
      console.error('Error rejecting claim:', err);
      window.alert('Failed to reject claim. Please try again.');
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false }));
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Player Claims</h1>
        <p className="text-gray-600">Review and verify player profile claims</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['pending', 'verified', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            aria-pressed={statusFilter === s}
            className={`px-4 py-2 rounded-md text-sm font-medium transition min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 ${
              statusFilter === s
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">
            {claims.filter((c) => c.status === 'pending').length}
          </p>
          <p className="text-xs text-yellow-600">Pending Review</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">
            {statusFilter === 'all'
              ? claims.filter((c) => c.status === 'verified').length
              : statusFilter === 'verified'
              ? claims.length
              : '—'}
          </p>
          <p className="text-xs text-green-600">Verified</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-700">
            {statusFilter === 'all'
              ? claims.filter((c) => c.status === 'rejected').length
              : statusFilter === 'rejected'
              ? claims.length
              : '—'}
          </p>
          <p className="text-xs text-red-600">Rejected</p>
        </div>
      </div>

      {/* Claims list */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading claims...</div>
      ) : claims.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-1">No {statusFilter !== 'all' ? statusFilter : ''} claims</p>
          <p className="text-sm">Player claims will appear here when submitted.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header row */}
              <button
                className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition focus:outline-2 focus:outline-offset-[-2px] focus:outline-blue-400 text-left bg-white border-none"
                onClick={() => setExpandedId(expandedId === claim.id ? null : claim.id)}
                aria-expanded={expandedId === claim.id}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg">👤</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {claim.players?.name || `Player #${claim.player_id || 'N/A'}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {claim.claimant_name}
                      {claim.relationship !== 'self' && ` (${claim.relationship})`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[claim.status] || 'bg-gray-100'}`}>
                    {claim.status}
                  </span>
                  <span className="text-xs text-gray-300">
                    {new Date(claim.created_at).toLocaleDateString()}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-gray-300 transition-transform ${expandedId === claim.id ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded detail */}
              {expandedId === claim.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                  {/* Claimant info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Claimant Name</p>
                      <p className="text-sm text-gray-900">{claim.claimant_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-gray-900 break-all">{claim.claimant_email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Relationship</p>
                      <p className="text-sm text-gray-900">{claim.relationship}</p>
                    </div>
                    {claim.claimant_phone && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                        <p className="text-sm text-gray-900">{claim.claimant_phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Parent info if parent claim */}
                  {claim.relationship !== 'self' && (claim.parent_name || claim.parent_email) && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Parent/Guardian Info</p>
                      <div className="grid grid-cols-2 gap-4">
                        {claim.parent_name && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                            <p className="text-sm text-gray-900">{claim.parent_name}</p>
                          </div>
                        )}
                        {claim.parent_email && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                            <p className="text-sm text-gray-900 break-all">{claim.parent_email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Measurables */}
                  {Object.keys(claim.measurables || {}).length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Measurables</p>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(claim.measurables).map(([key, value]) => (
                          <div key={key} className="bg-white border border-gray-200 rounded p-2">
                            <p className="text-xs font-medium text-gray-500 capitalize">{key}</p>
                            <p className="text-sm text-gray-900">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social links */}
                  {Object.keys(claim.social_links || {}).length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Social Links</p>
                      <div className="space-y-2">
                        {Object.entries(claim.social_links).map(([platform, url]) => (
                          <div key={platform} className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 w-16 capitalize">{platform}:</span>
                            <a
                              href={String(url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm truncate"
                            >
                              {String(url)}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recruiting info */}
                  {claim.recruiting_status && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Recruiting Status</p>
                      <p className="text-sm text-gray-900">{claim.recruiting_status}</p>
                    </div>
                  )}

                  {Object.keys(claim.recruiting_prefs || {}).length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Recruiting Preferences</p>
                      <div className="space-y-1">
                        {Object.entries(claim.recruiting_prefs).map(([key, value]) => (
                          <p key={key} className="text-sm text-gray-700">
                            <span className="font-medium capitalize">{key}:</span> {String(value)}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consents */}
                  {(claim.consent_film || claim.consent_contact || claim.consent_academic || claim.consent_email) && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Consents</p>
                      <div className="flex flex-wrap gap-2">
                        {claim.consent_film && <Badge>Film</Badge>}
                        {claim.consent_contact && <Badge>Contact</Badge>}
                        {claim.consent_academic && <Badge>Academic</Badge>}
                        {claim.consent_email && <Badge>Email</Badge>}
                      </div>
                    </div>
                  )}

                  {/* Admin actions */}
                  {claim.status === 'pending' && (
                    <div className="border-t border-gray-200 pt-4 flex gap-2 flex-wrap">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleVerify(claim.id, claim)}
                        disabled={processing[claim.id]}
                        aria-label={`Verify claim for ${claim.claimant_name}`}
                      >
                        {processing[claim.id] ? 'Verifying...' : 'Verify'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReject(claim.id)}
                        disabled={processing[claim.id]}
                        aria-label={`Reject claim from ${claim.claimant_name}`}
                      >
                        {processing[claim.id] ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
