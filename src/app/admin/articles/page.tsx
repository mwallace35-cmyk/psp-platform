'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import { SPORT_META, VALID_SPORTS, type SportId } from '@/lib/sports';

// Dynamic imports for heavy client components
const SortableTable = dynamic(() => import('@/components/ui/SortableTable'), {
  loading: () => <div className="text-center py-8 text-gray-500">Loading table...</div>,
});

interface Article {
  id: string;
  slug: string;
  title: string;
  author: string;
  sport_id: SportId;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

  const supabase = createClient();

  useEffect(() => {
    fetchArticles();
  }, [selectedSport, selectedStatus, searchQuery]);

  async function fetchArticles() {
    try {
      setLoading(true);
      let query = supabase.from('articles').select('*').order('created_at', { ascending: false });

      if (selectedSport !== 'all') {
        query = query.eq('sport_id', selectedSport);
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkPublish() {
    if (selectedArticles.size === 0) return;

    try {
      const ids = Array.from(selectedArticles);
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;
      setSelectedArticles(new Set());
      fetchArticles();
    } catch (error) {
      console.error('Error publishing articles:', error);
    }
  }

  async function handleBulkUnpublish() {
    if (selectedArticles.size === 0) return;

    try {
      const ids = Array.from(selectedArticles);
      const { error } = await supabase
        .from('articles')
        .update({ status: 'draft', updated_at: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;
      setSelectedArticles(new Set());
      fetchArticles();
    } catch (error) {
      console.error('Error unpublishing articles:', error);
    }
  }

  async function handleBulkDelete() {
    if (selectedArticles.size === 0 || !window.confirm('Delete selected articles?')) return;

    try {
      const ids = Array.from(selectedArticles);
      const { error } = await supabase.from('articles').delete().in('id', ids);

      if (error) throw error;
      setSelectedArticles(new Set());
      fetchArticles();
    } catch (error) {
      console.error('Error deleting articles:', error);
    }
  }

  function toggleArticleSelection(id: string) {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedArticles(newSelected);
  }

  function toggleAllSelection() {
    if (selectedArticles.size === articles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(articles.map((a) => a.id)));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Articles</h1>
          <p className="text-gray-600">Manage published and draft articles</p>
        </div>
        <Link href="/admin/articles/new">
          <Button variant="primary">New Article</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Sport Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as SportId | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Sports</option>
              {VALID_SPORTS.map((sport) => (
                <option key={sport} value={sport}>
                  {SPORT_META[sport].name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'draft' | 'published')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.size > 0 && (
        <div className="bg-gold/10 border border-gold rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm font-medium text-navy">
            {selectedArticles.size} article{selectedArticles.size !== 1 ? 's' : ''} selected
          </span>
          <div className="space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkPublish}
              className="inline-block"
            >
              Publish
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkUnpublish}
              className="inline-block"
            >
              Unpublish
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkDelete}
              className="inline-block"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedArticles.size === articles.length && articles.length > 0}
                  onChange={toggleAllSelection}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sport</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Loading articles...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No articles found
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="w-12 p-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.has(article.id)}
                      onChange={() => toggleArticleSelection(article.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{article.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant="sport">{SPORT_META[article.sport_id].emoji}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge
                      variant={article.status === 'published' ? 'success' : 'info'}
                      className="capitalize"
                    >
                      {article.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link
                      href={`/admin/articles/${article.slug}/edit`}
                      className="text-gold hover:text-gold/80 font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
