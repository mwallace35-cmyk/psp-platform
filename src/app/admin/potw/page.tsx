import { createStaticClient } from '@/lib/supabase/static';
import PotwClient, { type PotwNominee, type PotwWinner } from './PotwClient';

export default async function PotwManagement() {
  const supabase = createStaticClient();

  const [nomineeRes, winnerRes] = await Promise.all([
    supabase
      .from('potw_nominees')
      .select('*')
      .order('vote_count', { ascending: false }),
    supabase
      .from('potw_winners')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const initialNominees = (nomineeRes.data as PotwNominee[] | null) || [];
  const initialWinners = (winnerRes.data as PotwWinner[] | null) || [];

  return <PotwClient initialNominees={initialNominees} initialWinners={initialWinners} />;
}
