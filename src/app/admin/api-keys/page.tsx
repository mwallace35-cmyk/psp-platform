import { createStaticClient } from '@/lib/supabase/static';
import ApiKeysClient, { type ApiKey } from './ApiKeysClient';

export default async function ApiKeysPage() {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin/api-keys] Failed to load api_keys:', error);
  }

  const initialKeys: ApiKey[] = (data || []) as ApiKey[];

  return <ApiKeysClient initialKeys={initialKeys} />;
}
