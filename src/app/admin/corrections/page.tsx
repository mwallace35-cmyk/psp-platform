'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Button, Badge, ToastContainer } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

interface Correction {
  id: number;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  field_name: string;
  current_value: string | null;
  proposed_value: string;
  reason: string | null;
  source_url: string | null;
  submitter_email: string | null;
  submitter_name: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function CorrectionsAdmin() {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});

  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    fetchCorrections();
  }, [statusFilter]);

  async function fetchCorrections() {
    setLoading(true);
    try {
      let query = supabase
        .from('corrections')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      setCorrections(data || []);
    } catch (err) {
      console.error('Error fetching corrections:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(id: number, newStatus: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('corrections')
        .update({
          status: newStatus,
          admin_notes: adminNotes[id] || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      toastSuccess(`Correction ${newStatus} successfully!`);
      fetchCorrections();
    } catch (err) {
      console.error('Error resolving correction:', err);
      toastError('Error updating correction. Please try again.');
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const entityEmoji: Record<string, string> = {
    player: '\u{1F3C3}',
    school: '\u{1F3EB}',
    team_season: '\u{1F4C5}',
    championship: '\u{1F3C6}',
  };

  return (
    <>
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Community Corrections</h1>
        <p className="text-gray-600">Review data corrections submitted by the community</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['pending', 'approved', 'rejected', 'all'].map((s) => (
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
            {corrections.filter((c) => c.status === 'pending').length}
          </p>
          <p className="text-xs text-yellow-600">Pending Review</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">
            {statusFilter === 'all'
              ? corrections.filter((c) => c.status === 'approved').length
              : statusFilter === 'approved'
              ? corrections.length
              : '—'}
          </p>
          <p className="text-xs text-green-600">Approved</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-700">
            {statusFilter === 'all'
              ? corrections.filter((c) => c.status === 'rejected').length
              : statusFilter === 'rejected'
              ? corrections.length
              : '—'}
          </p>
          <p className="text-xs text-red-600">Rejected</p>
        </div>
      </div>

      {/* Corrections list */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading corrections...</div>
      ) : corrections.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-1">No {statusFilter !== 'all' ? statusFilter : ''} corrections</p>
          <p className="text-sm">Community corrections will appear here when submitted.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {corrections.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header row */}
              <button
                className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition focus:outline-2 focus:outline-offset-[-2px] focus:outline-blue-400 text-left bg-white border-none"
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                aria-expanded={expandedId === c.id}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg">{entityEmoji[c.entity_type] || '📝'}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {c.entity_name || `${c.entity_type} #${c.entity_id}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{c.field_name}</span>
                      {' — '}
                      <span className="text-red-600 line-through">{c.current_value || '(empty)'}</span>
                      {' → '}
                      <span className="text-green-700 font-medium">{c.proposed_value}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[c.status] || 'bg-gray-100'}`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-gray-400 transition-transform ${expandedId === c.id ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded detail */}
              {expandedId === c.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                  {/* Side-by-side comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-xs font-medium text-red-600 mb-1">Current Value</p>
                      <p className="text-sm text-gray-900">{c.current_value || '(empty)'}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-xs font-medium text-green-600 mb-1">Proposed Value</p>
                      <p className="text-sm text-gray-900">{c.proposed_value}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {c.reason && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Reason</p>
                        <p className="text-gray-700">{c.reason}</p>
                      </div>
                    )}
                    {c.source_url && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Source</p>
                        <a
                          href={c.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {c.source_url}
                        </a>
                      </div>
                    )}
                    {c.submitter_name && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Submitted by</p>
                        <p className="text-gray-700">
                          {c.submitter_name}
                          {c.submitter_email && ` (${c.submitter_email})`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Entity</p>
                      <p className="text-gray-700">
                        {c.entity_type} #{c.entity_id}
                      </p>
                    </div>
                  </div>

                  {/* Admin actions */}
                  {c.status === 'pending' && (
                    <div className="space-y-3 pt-2 border-t border-gray-200">
                      <div>
                        <label htmlFor={`admin-notes-${c.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                          Admin Notes <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                          id={`admin-notes-${c.id}`}
                          value={adminNotes[c.id] || ''}
                          onChange={(e) =>
                            setAdminNotes((prev) => ({ ...prev, [c.id]: e.target.value }))
                          }
                          placeholder="Optional notes about this correction..."
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
                          aria-describedby={`admin-notes-hint-${c.id}`}
                        />
                        <div id={`admin-notes-hint-${c.id}`} className="text-xs text-gray-400 mt-1">
                          Provide context for your decision on this correction request.
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleResolve(c.id, 'approved')}
                          aria-label={`Approve correction for ${c.entity_name}`}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleResolve(c.id, 'rejected')}
                          aria-label={`Reject correction for ${c.entity_name}`}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {c.admin_notes && c.status !== 'pending' && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Admin Notes</p>
                      <p className="text-sm text-gray-700">{c.admin_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
