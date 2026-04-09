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
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Atomic increment via SECURITY DEFINER RPC (no public UPDATE policy)
    const { error } = await supabase.rpc('increment_player_reaction', {
      p_slug: slug,
      p_reaction: reaction,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // swallow errors — count is best-effort
  }
}
