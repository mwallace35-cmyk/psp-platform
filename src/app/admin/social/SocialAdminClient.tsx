'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { SocialPost, SocialHandle } from '@/lib/data/social';
import { extractTweetId } from '@/lib/data/social';

interface Props {
  initialPosts: SocialPost[];
  initialHandles: SocialHandle[];
}

type Tab = 'handles' | 'posts';

export default function SocialAdminClient({ initialPosts, initialHandles }: Props) {
  const [tab, setTab] = useState<Tab>('handles');
  const [posts, setPosts] = useState(initialPosts);
  const [handles, setHandles] = useState(initialHandles);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: 2,
        marginBottom: 20,
        borderBottom: '2px solid var(--g100)',
      }}>
        <TabButton active={tab === 'handles'} onClick={() => setTab('handles')} label="Followed Accounts" count={handles.filter(h => h.active).length} />
        <TabButton active={tab === 'posts'} onClick={() => setTab('posts')} label="Individual Tweets" count={posts.filter(p => p.active).length} />
      </div>

      {tab === 'handles' && (
        <HandlesTab handles={handles} setHandles={setHandles} supabase={supabase} router={router} />
      )}

      {tab === 'posts' && (
        <PostsTab posts={posts} setPosts={setPosts} supabase={supabase} router={router} />
      )}

      {/* Fetch button */}
      <div style={{ marginTop: 24, padding: 16, background: 'var(--g50)', borderRadius: 8, border: '1px solid var(--g100)' }}>
        <FetchButton />
      </div>
    </div>
  );
}

/* ────── Tab Button ────── */

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        borderBottom: active ? '2px solid var(--psp-gold)' : '2px solid transparent',
        color: active ? 'var(--text)' : 'var(--g400)',
        marginBottom: -2,
        transition: 'all 0.15s',
      }}
    >
      {label}
      <span style={{
        marginLeft: 8,
        background: active ? 'var(--psp-gold)' : 'var(--g200)',
        color: active ? '#0a1628' : 'var(--g500)',
        padding: '2px 8px',
        borderRadius: 10,
        fontSize: 11,
      }}>
        {count}
      </span>
    </button>
  );
}

/* ────── Handles Tab ────── */

function HandlesTab({
  handles,
  setHandles,
  supabase,
  router,
}: {
  handles: SocialHandle[];
  setHandles: (h: SocialHandle[]) => void;
  supabase: ReturnType<typeof createBrowserClient>;
  router: ReturnType<typeof useRouter>;
}) {
  const [newHandle, setNewHandle] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [sportId, setSportId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd() {
    const clean = newHandle.trim().replace(/^@/, '');
    if (!clean) return;

    setSaving(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('social_handles')
      .insert({
        platform: 'twitter',
        handle: clean,
        player_name: playerName.trim() || null,
        school_name: schoolName.trim() || null,
        sport_id: sportId || null,
        active: true,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      if (insertError.message.includes('duplicate')) {
        setError(`@${clean} is already being followed`);
      } else {
        setError(`Failed to add: ${insertError.message}`);
      }
      return;
    }

    setHandles([data as SocialHandle, ...handles]);
    setNewHandle('');
    setPlayerName('');
    setSchoolName('');
    setSportId('');
    router.refresh();
  }

  async function handleToggle(id: number, active: boolean) {
    const { error } = await supabase
      .from('social_handles')
      .update({ active: !active, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) setHandles(handles.map(h => h.id === id ? { ...h, active: !active } : h));
  }

  async function handleDelete(id: number) {
    if (!confirm('Remove this account from the feed?')) return;
    const { error } = await supabase.from('social_handles').delete().eq('id', id);
    if (!error) setHandles(handles.filter(h => h.id !== id));
  }

  return (
    <div>
      {/* Add Handle Form */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--g100)',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>
          Follow a Twitter Account
        </h2>
        <p style={{ fontSize: 12, color: 'var(--g400)', margin: '0 0 16px' }}>
          New tweets from followed accounts are auto-pulled every 30 minutes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Twitter Handle *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--g400)', fontSize: 13 }}>@</span>
              <input
                type="text"
                value={newHandle}
                onChange={e => setNewHandle(e.target.value)}
                placeholder="jalenduren"
                style={{ ...inputStyle, paddingLeft: 28 }}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="e.g. Jalen Duren"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>School</label>
            <input
              type="text"
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              placeholder="e.g. Roman Catholic"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Sport</label>
            <select value={sportId} onChange={e => setSportId(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="baseball">Baseball</option>
              <option value="lacrosse">Lacrosse</option>
              <option value="soccer">Soccer</option>
              <option value="track-field">Track & Field</option>
              <option value="wrestling">Wrestling</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, fontWeight: 600 }}>{error}</div>
        )}

        <button
          onClick={handleAdd}
          disabled={saving || !newHandle.trim()}
          style={{
            background: saving ? 'var(--g300)' : 'var(--psp-blue)',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Adding...' : 'Follow Account'}
        </button>
      </div>

      {/* Handles List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {handles.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--g400)' }}>
            No accounts followed yet. Add a Twitter handle above to get started.
          </div>
        )}

        {handles.map(h => (
          <div
            key={h.id}
            style={{
              background: 'var(--card)',
              border: `1px solid ${h.active ? 'var(--g100)' : 'var(--g200)'}`,
              borderRadius: 8,
              padding: '12px 16px',
              opacity: h.active ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {/* Avatar placeholder */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1DA1F2, #0d8bd9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {(h.player_name || h.handle).charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                {h.player_name || `@${h.handle}`}
              </div>
              <div style={{ fontSize: 11, color: 'var(--psp-blue)' }}>
                @{h.handle}
                {h.school_name && (
                  <span style={{ color: 'var(--g400)' }}> � {h.school_name}</span>
                )}
              </div>
              {h.last_fetched_at && (
                <div style={{ fontSize: 10, color: 'var(--g300)', marginTop: 2 }}>
                  Last fetched: {new Date(h.last_fetched_at).toLocaleString()}
                </div>
              )}
            </div>

            {/* Sport badge */}
            {h.sport_id && (
              <span style={{
                background: 'var(--psp-gold)',
                color: '#0a1628',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                {h.sport_id}
              </span>
            )}

            {/* Status */}
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: h.twitter_user_id ? '#22c55e' : 'var(--g300)',
            }}>
              {h.twitter_user_id ? 'LINKED' : 'PENDING'}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => handleToggle(h.id, h.active)}
                title={h.active ? 'Pause' : 'Resume'}
                style={actionBtnStyle}
              >
                {h.active ? '⏸' : '▶️'}
              </button>
              <button
                onClick={() => handleDelete(h.id)}
                title="Remove"
                style={{ ...actionBtnStyle, color: '#ef4444' }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────── Posts Tab (manual tweet add — same as before) ────── */

function PostsTab({
  posts,
  setPosts,
  supabase,
  router,
}: {
  posts: SocialPost[];
  setPosts: (p: SocialPost[]) => void;
  supabase: ReturnType<typeof createBrowserClient>;
  router: ReturnType<typeof useRouter>;
}) {
  const [newUrl, setNewUrl] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [sportId, setSportId] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd() {
    if (!newUrl.trim()) return;

    const tweetId = extractTweetId(newUrl.trim());
    if (!tweetId) {
      setError('Invalid Twitter/X URL. Must be like: https://x.com/user/status/123456');
      return;
    }

    const handleMatch = newUrl.match(/(?:twitter\.com|x\.com)\/(\w+)\//);
    const handle = handleMatch ? `@${handleMatch[1]}` : null;

    setSaving(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('social_posts')
      .insert({
        platform: 'twitter',
        post_url: newUrl.trim(),
        tweet_id: tweetId,
        source_handle: handle,
        player_name: playerName.trim() || null,
        school_name: schoolName.trim() || null,
        sport_id: sportId || null,
        caption: caption.trim() || null,
        active: true,
        display_order: 0,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError(`Failed to add: ${insertError.message}`);
      return;
    }

    setPosts([data as SocialPost, ...posts]);
    setNewUrl('');
    setPlayerName('');
    setSchoolName('');
    setSportId('');
    setCaption('');
    router.refresh();
  }

  async function handleToggleActive(id: number, currentActive: boolean) {
    const { error } = await supabase
      .from('social_posts')
      .update({ active: !currentActive, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) setPosts(posts.map(p => p.id === id ? { ...p, active: !currentActive } : p));
  }

  async function handleTogglePin(id: number, currentPinned: boolean) {
    const { error } = await supabase
      .from('social_posts')
      .update({ pinned: !currentPinned, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) setPosts(posts.map(p => p.id === id ? { ...p, pinned: !currentPinned } : p));
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this post permanently?')) return;
    const { error } = await supabase.from('social_posts').delete().eq('id', id);
    if (!error) setPosts(posts.filter(p => p.id !== id));
  }

  return (
    <div>
      {/* Add Post Form */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--g100)',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>
          Add Individual Tweet
        </h2>
        <p style={{ fontSize: 12, color: 'var(--g400)', margin: '0 0 16px' }}>
          Pin specific tweets you want to highlight. These appear alongside auto-fetched tweets.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Tweet URL *</label>
            <input
              type="url"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="https://x.com/username/status/1234567890"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Player Name</label>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="e.g. Jalen Duren" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>School Name</label>
            <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Roman Catholic" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Sport</label>
            <select value={sportId} onChange={e => setSportId(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="baseball">Baseball</option>
              <option value="lacrosse">Lacrosse</option>
              <option value="soccer">Soccer</option>
              <option value="track-field">Track & Field</option>
              <option value="wrestling">Wrestling</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Caption / Note</label>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Big game tonight" style={inputStyle} />
          </div>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, fontWeight: 600 }}>{error}</div>
        )}

        <button
          onClick={handleAdd}
          disabled={saving || !newUrl.trim()}
          style={{
            background: saving ? 'var(--g300)' : 'var(--psp-gold)',
            color: '#0a1628',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Adding...' : 'Add to Feed'}
        </button>
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--g400)' }}>
            No manual tweets added yet. Auto-fetched tweets from followed accounts appear automatically.
          </div>
        )}

        {posts.map(post => (
          <div
            key={post.id}
            style={{
              background: 'var(--card)',
              border: `1px solid ${post.active ? 'var(--g100)' : 'var(--g200)'}`,
              borderRadius: 8,
              padding: '12px 16px',
              opacity: post.active ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ fontSize: 18, width: 24, textAlign: 'center' }}>
              {post.pinned ? '📌' : '𝕏'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                {post.player_name || post.source_handle || 'Tweet'}
                {post.school_name && (
                  <span style={{ color: 'var(--g400)', fontWeight: 400 }}> � {post.school_name}</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--psp-blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.post_url}
              </div>
              {post.caption && (
                <div style={{ fontSize: 11, color: 'var(--g400)', marginTop: 2, fontStyle: 'italic' }}>{post.caption}</div>
              )}
            </div>

            {post.sport_id && (
              <span style={{
                background: 'var(--psp-gold)',
                color: '#0a1628',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                {post.sport_id}
              </span>
            )}

            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => handleTogglePin(post.id, post.pinned)} title={post.pinned ? 'Unpin' : 'Pin'} style={actionBtnStyle}>
                {post.pinned ? '📌' : '📍'}
              </button>
              <button onClick={() => handleToggleActive(post.id, post.active)} title={post.active ? 'Hide' : 'Show'} style={actionBtnStyle}>
                {post.active ? '👁' : '👁‍🗨'}
              </button>
              <button onClick={() => handleDelete(post.id)} title="Delete" style={{ ...actionBtnStyle, color: '#ef4444' }}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────── Fetch Button ────── */

function FetchButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleFetch() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/cron/fetch-tweets', {
        headers: { 'Authorization': `Bearer ${window.location.hostname === 'localhost' ? 'dev' : ''}` },
      });
      const data = await res.json();

      if (res.ok) {
        setResult(`Fetched ${data.fetched} tweets from ${data.handles} accounts, ${data.inserted} new`);
      } else {
        setResult(`Error: ${data.error || data.message || 'Unknown error'}`);
      }
    } catch (err) {
      setResult(`Network error: ${String(err)}`);
    }

    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
          Manual Fetch
        </div>
        <div style={{ fontSize: 11, color: 'var(--g400)' }}>
          Tweets are fetched automatically every 30 minutes. Click to fetch now.
        </div>
        {result && (
          <div style={{ fontSize: 12, marginTop: 6, color: result.startsWith('Error') ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
            {result}
          </div>
        )}
      </div>
      <button
        onClick={handleFetch}
        disabled={loading}
        style={{
          background: loading ? 'var(--g300)' : 'var(--card)',
          color: 'var(--text)',
          border: '1px solid var(--g200)',
          padding: '10px 20px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'Fetching...' : 'Fetch Now'}
      </button>
    </div>
  );
}

/* ────── Shared Styles ────── */

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--g400)',
  marginBottom: 4,
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid var(--g200)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontSize: 13,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const actionBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--g200)',
  borderRadius: 4,
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: 14,
};
