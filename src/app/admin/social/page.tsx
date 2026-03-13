import { getAllSocialFeedPosts, getAllSocialHandles } from '@/lib/data';
import SocialAdminClient from './SocialAdminClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Social Feed Manager | PSP Admin',
};

export default async function AdminSocialPage() {
  const [posts, handles] = await Promise.all([
    getAllSocialFeedPosts(),
    getAllSocialHandles(),
  ]);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", margin: 0, color: 'var(--text)' }}>
            Social Feed Manager
          </h1>
          <p style={{ fontSize: 13, color: 'var(--g400)', margin: '4px 0 0' }}>
            Follow Twitter accounts to auto-pull their tweets, or add individual tweets manually.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            background: 'var(--psp-blue)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
          }}>
            {handles.filter(h => h.active).length} Accounts
          </div>
          <div style={{
            background: 'var(--psp-gold)',
            color: '#0a1628',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
          }}>
            {posts.filter(p => p.active).length} Posts
          </div>
        </div>
      </div>

      <SocialAdminClient initialPosts={posts} initialHandles={handles} />
    </div>
  );
}
