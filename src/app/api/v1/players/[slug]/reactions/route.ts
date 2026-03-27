import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const revalidate = 0; // always fresh for counts
const VALID = ['fire', 'star', 'beast', 'champ'];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await supabase
      .from('player_reactions')
      .select('reaction, count')
      .eq('player_slug', slug);

    const counts: Record<string, number> = { fire: 0, star: 0, beast: 0, champ: 0 };
    (data ?? []).forEach((row: { reaction: string; count: number }) => {
      if (VALID.includes(row.reaction)) counts[row.reaction] = row.count;
    });

    return NextResponse.json({ counts });
  } catch {
    return NextResponse.json({ counts: { fire: 0, star: 0, beast: 0, champ: 0 } });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { reaction } = await req.json();
    if (!VALID.includes(reaction)) {
      return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Upsert with increment — using RPC if available, else manual
    const { data: existing } = await supabase
      .from('player_reactions')
      .select('count')
      .eq('player_slug', slug)
      .eq('reaction', reaction)
      .single();

    if (existing) {
      await supabase
        .from('player_reactions')
        .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
        .eq('player_slug', slug)
        .eq('reaction', reaction);
    } else {
      await supabase
        .from('player_reactions')
        .insert({ player_slug: slug, reaction, count: 1, updated_at: new Date().toISOString() });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // swallow errors — count is best-effort
  }
}
