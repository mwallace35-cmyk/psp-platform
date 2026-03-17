'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ApiKey {
  id: number;
  api_key: string;
  partner_name: string;
  email?: string;
  tier: 'basic' | 'standard' | 'premium';
  daily_limit: number;
  requests_today: number;
  is_active: boolean;
  created_at: string;
  last_used_at?: string;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    partner_name: string;
    email: string;
    tier: 'basic' | 'standard' | 'premium';
  }>({
    partner_name: '',
    email: '',
    tier: 'basic',
  });
  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);

  const supabase = createClient();

  // Load API keys
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = (): string => {
    return `psp_${crypto.randomUUID().replace(/-/g, '').substring(0, 32)}`;
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.partner_name.trim()) {
      alert('Partner name is required');
      return;
    }

    try {
      const newKey = generateApiKey();

      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            api_key: newKey,
            partner_name: formData.partner_name,
            email: formData.email || null,
            tier: formData.tier,
            daily_limit:
              formData.tier === 'basic' ? 100 : formData.tier === 'standard' ? 1000 : 10000,
            requests_today: 0,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setApiKeys([data, ...apiKeys]);
      setFormData({ partner_name: '', email: '', tier: 'basic' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating API key:', error);
      alert('Failed to create API key');
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, is_active: !key.is_active } : key
        )
      );
    } catch (error) {
      console.error('Error updating API key:', error);
      alert('Failed to update API key');
    }
  };

  const handleResetCounter = async (id: number) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ requests_today: 0 })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, requests_today: 0 } : key
        )
      );
    } catch (error) {
      console.error('Error resetting counter:', error);
      alert('Failed to reset counter');
    }
  };

  const handleCopyKey = (key: string, id: number) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-yellow-100 text-yellow-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancel' : 'Create New Key'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Create New API Key</h2>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Partner Name *
              </label>
              <input
                type="text"
                required
                value={formData.partner_name}
                onChange={(e) =>
                  setFormData({ ...formData, partner_name: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="e.g., External Stats Provider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tier
              </label>
              <select
                value={formData.tier}
                onChange={(e) => {
                  const tier = e.target.value;
                  setFormData({
                    ...formData,
                    tier: tier as 'basic' | 'standard' | 'premium',
                  });
                }}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="basic">Basic (100 req/day)</option>
                <option value="standard">Standard (1,000 req/day)</option>
                <option value="premium">Premium (10,000 req/day)</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Create API Key
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <p className="py-12 text-center text-gray-500">Loading API keys...</p>
        ) : apiKeys.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No API keys created yet
          </p>
        ) : (
          apiKeys.map((key) => (
            <Card key={key.id} className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {key.partner_name}
                    </h3>
                    {key.email && (
                      <p className="text-sm text-gray-600">{key.email}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="info">{key.tier.toUpperCase()}</Badge>
                    <Badge variant={key.is_active ? 'success' : 'error'}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-600">
                      Created: {new Date(key.created_at).toLocaleDateString()}
                    </p>
                    {key.last_used_at && (
                      <p className="text-gray-600">
                        Last used: {new Date(key.last_used_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* API Key display */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500">API Key</p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                        {key.api_key}
                      </code>
                      <button
                        onClick={() => handleCopyKey(key.api_key, key.id)}
                        className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        {copiedKeyId === key.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Usage stats */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Daily Usage
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {key.requests_today} / {key.daily_limit}
                        </span>
                        <span className="text-gray-500">
                          {Math.round((key.requests_today / key.daily_limit) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{
                            width: `${Math.min(100, (key.requests_today / key.daily_limit) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t pt-4">
                <button
                  onClick={() => handleToggleActive(key.id, key.is_active)}
                  className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {key.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleResetCounter(key.id)}
                  className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset Counter
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
