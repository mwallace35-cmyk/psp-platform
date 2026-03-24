'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalComments: number;
  pendingComments: number;
  approvedComments: number;
  totalCorrections: number;
  pendingCorrections: number;
  emailSubscribers: number;
  confirmedSubscribers: number;
  potwVotes: number;
  potwNominees: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [
        articlesRes,
        publishedRes,
        draftRes,
        commentsRes,
        pendingCommentsRes,
        approvedCommentsRes,
        correctionsRes,
        pendingCorrectionsRes,
        subscribersRes,
        confirmedSubsRes,
        votesRes,
        nomineesRes,
      ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('corrections').select('*', { count: 'exact', head: true }),
        supabase.from('corrections').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('email_subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('email_subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true),
        supabase.from('potw_votes').select('*', { count: 'exact', head: true }),
        supabase.from('potw_nominees').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalArticles: articlesRes.count || 0,
        publishedArticles: publishedRes.count || 0,
        draftArticles: draftRes.count || 0,
        totalComments: commentsRes.count || 0,
        pendingComments: pendingCommentsRes.count || 0,
        approvedComments: approvedCommentsRes.count || 0,
        totalCorrections: correctionsRes.count || 0,
        pendingCorrections: pendingCorrectionsRes.count || 0,
        emailSubscribers: subscribersRes.count || 0,
        confirmedSubscribers: confirmedSubsRes.count || 0,
        potwVotes: votesRes.count || 0,
        potwNominees: nomineesRes.count || 0,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading analytics...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Could not load analytics data.</div>;
  }

  const sections = [
    {
      title: 'Content',
      icon: '📰',
      metrics: [
        { label: 'Total Articles', value: stats.totalArticles, color: '#0a1628' },
        { label: 'Published', value: stats.publishedArticles, color: '#16a34a' },
        { label: 'Drafts', value: stats.draftArticles, color: '#f59e0b' },
      ],
    },
    {
      title: 'Engagement',
      icon: '💬',
      metrics: [
        { label: 'Total Comments', value: stats.totalComments, color: '#0a1628' },
        { label: 'Approved', value: stats.approvedComments, color: '#16a34a' },
        { label: 'Pending Review', value: stats.pendingComments, color: '#f59e0b' },
      ],
    },
    {
      title: 'Community',
      icon: '✏️',
      metrics: [
        { label: 'Corrections Submitted', value: stats.totalCorrections, color: '#0a1628' },
        { label: 'Pending Review', value: stats.pendingCorrections, color: '#f59e0b' },
        { label: 'POTW Votes Cast', value: stats.potwVotes, color: '#3b82f6' },
      ],
    },
    {
      title: 'Email',
      icon: '📧',
      metrics: [
        { label: 'Total Subscribers', value: stats.emailSubscribers, color: '#0a1628' },
        { label: 'Confirmed', value: stats.confirmedSubscribers, color: '#16a34a' },
        { label: 'Unconfirmed', value: stats.emailSubscribers - stats.confirmedSubscribers, color: '#9ca3af' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Analytics</h1>
        <p className="text-gray-600">Platform metrics and community engagement overview</p>
      </div>

      {/* Action items */}
      {(stats.pendingComments > 0 || stats.pendingCorrections > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-4">
          <span className="text-2xl">⚡</span>
          <div className="text-sm text-yellow-800">
            <strong>Action needed:</strong>
            {stats.pendingComments > 0 && (
              <span> {stats.pendingComments} comments awaiting review.</span>
            )}
            {stats.pendingCorrections > 0 && (
              <span> {stats.pendingCorrections} corrections awaiting review.</span>
            )}
          </div>
        </div>
      )}

      {/* Metric sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{section.icon}</span>
              <h2 className="font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.metrics.map((m) => (
                <div key={m.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{m.label}</span>
                  <span className="text-2xl font-bold" style={{ color: m.color }}>
                    {m.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/comments" className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:shadow-sm transition">
            Review Comments ({stats.pendingComments})
          </a>
          <a href="/admin/corrections" className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:shadow-sm transition">
            Review Corrections ({stats.pendingCorrections})
          </a>
          <a href="/admin/articles/new" className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:shadow-sm transition">
            Write Article
          </a>
          <a href="/admin/potw" className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:shadow-sm transition">
            Manage POTW
          </a>
        </div>
      </div>
    </div>
  );
}
