'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface LinkedEntity {
  id: number;
  entity_type: string;
  entity_id: number;
  entity_name?: string;
}

interface EntityLinkerProps {
  articleId: number;
}

export default function EntityLinker({ articleId }: EntityLinkerProps) {
  const [linkedEntities, setLinkedEntities] = useState<LinkedEntity[]>([]);
  const [searchType, setSearchType] = useState<'school' | 'player'>('school');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string; context?: string }>>([]);
  const [searching, setSearching] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchLinkedEntities();
  }, [articleId]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => doSearch(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchType]);

  async function fetchLinkedEntities() {
    const { data: mentions } = await supabase
      .from('article_mentions')
      .select('*')
      .eq('article_id', articleId);

    if (!mentions) return;

    // Enrich with names
    const enriched: LinkedEntity[] = [];
    for (const m of mentions) {
      let name = `${m.entity_type} #${m.entity_id}`;
      if (m.entity_type === 'school') {
        const { data } = await supabase.from('schools').select('name').eq('id', m.entity_id).single();
        if (data) name = data.name;
      } else if (m.entity_type === 'player') {
        const { data } = await supabase.from('players').select('name').eq('id', m.entity_id).single();
        if (data) name = data.name;
      }
      enriched.push({ ...m, entity_name: name });
    }
    setLinkedEntities(enriched);
  }

  async function doSearch() {
    setSearching(true);
    try {
      const table = searchType === 'school' ? 'schools' : 'players';
      const { data } = await supabase
        .from(table)
        .select('id, name')
        .ilike('name', `%${searchQuery}%`)
        .is('deleted_at', null)
        .limit(10);

      setSearchResults(
        (data || []).map((r) => ({
          id: r.id,
          name: r.name,
          context: searchType,
        }))
      );
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  }

  async function handleLink(entityId: number, entityName: string) {
    // Check if already linked
    if (linkedEntities.some((e) => e.entity_type === searchType && e.entity_id === entityId)) {
      return;
    }

    try {
      const { error } = await supabase.from('article_mentions').insert({
        article_id: articleId,
        entity_type: searchType,
        entity_id: entityId,
      });

      if (error) throw error;

      setLinkedEntities((prev) => [
        ...prev,
        { id: 0, entity_type: searchType, entity_id: entityId, entity_name: entityName },
      ]);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Error linking entity:', err);
    }
  }

  async function handleUnlink(entityType: string, entityId: number) {
    try {
      const { error } = await supabase
        .from('article_mentions')
        .delete()
        .eq('article_id', articleId)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);

      if (error) throw error;
      setLinkedEntities((prev) =>
        prev.filter((e) => !(e.entity_type === entityType && e.entity_id === entityId))
      );
    } catch (err) {
      console.error('Error unlinking entity:', err);
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm">Link Schools & Players</h3>

      {/* Current links */}
      {linkedEntities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {linkedEntities.map((e) => (
            <span
              key={`${e.entity_type}-${e.entity_id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-white border border-gray-200"
            >
              <span>{e.entity_type === 'school' ? '\u{1F3EB}' : '\u{1F3C3}'}</span>
              <span className="font-medium">{e.entity_name}</span>
              <button
                onClick={() => handleUnlink(e.entity_type, e.entity_id)}
                className="ml-1 text-gray-400 hover:text-red-500 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value as 'school' | 'player');
            setSearchQuery('');
            setSearchResults([]);
          }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="school">School</option>
          <option value="player">Player</option>
        </select>
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${searchType}s to link...`}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleLink(r.id, r.name)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gold/10 transition flex items-center gap-2"
                >
                  <span>{searchType === 'school' ? '\u{1F3EB}' : '\u{1F3C3}'}</span>
                  <span>{r.name}</span>
                  {linkedEntities.some(
                    (e) => e.entity_type === searchType && e.entity_id === r.id
                  ) && (
                    <span className="text-xs text-green-600 ml-auto">linked</span>
                  )}
                </button>
              ))}
            </div>
          )}
          {searching && (
            <div className="absolute right-3 top-2.5 text-xs text-gray-400">Searching...</div>
          )}
        </div>
      </div>
    </div>
  );
}
