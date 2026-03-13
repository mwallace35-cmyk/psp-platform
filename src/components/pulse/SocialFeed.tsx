'use client';

import { Tweet } from 'react-tweet';
import type { SocialPost } from '@/lib/data/social';

interface SocialFeedProps {
  posts: SocialPost[];
}

export default function SocialFeed({ posts }: SocialFeedProps) {
  const twitterPosts = posts.filter(p => p.platform === 'twitter' && p.tweet_id);

  if (twitterPosts.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: 'var(--g400)',
        background: 'var(--card)',
        borderRadius: 8,
        border: '1px solid var(--g100)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>𝕏</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Social Feed Coming Soon</div>
        <div style={{ fontSize: 12 }}>Follow Philly athletes making moves at the next level</div>
      </div>
    );
  }

  return (
    <div>
      {/* Pinned posts section */}
      {twitterPosts.some(p => p.pinned) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 10,
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--psp-gold)',
            textTransform: 'uppercase',
            letterSpacing: '.5px',
          }}>
            📌 Pinned
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {twitterPosts.filter(p => p.pinned).map(post => (
              <TweetCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Regular posts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}>
        {twitterPosts.filter(p => !p.pinned).map(post => (
          <TweetCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function TweetCard({ post }: { post: SocialPost }) {
  return (
    <div style={{
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid var(--g100)',
      background: 'var(--card)',
    }}>
      {/* Context bar */}
      {(post.player_name || post.school_name) && (
        <div style={{
          padding: '8px 12px',
          background: 'var(--g50)',
          borderBottom: '1px solid var(--g100)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
        }}>
          {post.player_name && (
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{post.player_name}</span>
          )}
          {post.school_name && (
            <span style={{ color: 'var(--g400)' }}>• {post.school_name}</span>
          )}
          {post.sport_id && (
            <span style={{
              background: 'var(--psp-gold)',
              color: '#0a1628',
              padding: '2px 6px',
              borderRadius: 3,
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginLeft: 'auto',
            }}>
              {post.sport_id}
            </span>
          )}
        </div>
      )}

      {/* Tweet embed */}
      <div data-theme="light" style={{ minHeight: 200 }}>
        <Tweet id={post.tweet_id!} />
      </div>

      {/* Caption */}
      {post.caption && (
        <div style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--g100)',
          fontSize: 11,
          color: 'var(--g400)',
          fontStyle: 'italic',
        }}>
          {post.caption}
        </div>
      )}
    </div>
  );
}
