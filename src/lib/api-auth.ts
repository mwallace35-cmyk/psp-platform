import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface ApiKeyInfo {
  id: number;
  partnerName: string;
  tier: 'basic' | 'standard' | 'premium';
  dailyLimit: number;
  requestsToday: number;
}

/**
 * Validate API key from request headers.
 * Checks X-API-Key header against api_keys table.
 * Returns ApiKeyInfo or null if invalid.
 */
export async function validateApiKey(request: NextRequest): Promise<ApiKeyInfo | null> {
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) return null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('api_keys')
      .select('id, partner_name, tier, daily_limit, requests_today, is_active')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (!data) return null;

    // Check rate limit
    if (data.requests_today >= data.daily_limit) return null;

    // Increment usage counter
    await supabase
      .from('api_keys')
      .update({
        requests_today: data.requests_today + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', data.id);

    return {
      id: data.id,
      partnerName: data.partner_name,
      tier: data.tier,
      dailyLimit: data.daily_limit,
      requestsToday: data.requests_today + 1,
    };
  } catch (error) {
    console.error('[API Auth] Error validating API key:', error);
    return null;
  }
}

/**
 * Log API usage for analytics
 */
export async function logApiUsage(
  apiKeyId: number,
  endpoint: string,
  responseCode: number,
  responseTimeMs: number
) {
  try {
    const supabase = await createClient();
    await supabase.from('api_usage_log').insert({
      api_key_id: apiKeyId,
      endpoint,
      response_code: responseCode,
      response_time_ms: responseTimeMs,
    });
  } catch (error) {
    console.error('[API Auth] Error logging API usage:', error);
  }
}

/**
 * Middleware wrapper that requires API key authentication.
 * For premium endpoints.
 */
export function withApiAuth(
  handler: (req: NextRequest, apiKey: ApiKeyInfo) => Promise<NextResponse>,
  requiredTier: 'basic' | 'standard' | 'premium' = 'basic'
) {
  return async (request: NextRequest) => {
    const startTime = Date.now();
    const apiKey = await validateApiKey(request);

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid or missing API key. Get one at phillysportspack.com/api/keys',
        },
        {
          status: 401,
          headers: {
            'X-RateLimit-Limit': '0',
          },
        }
      );
    }

    const tierOrder = { basic: 0, standard: 1, premium: 2 };
    if (tierOrder[apiKey.tier] < tierOrder[requiredTier]) {
      return NextResponse.json(
        {
          success: false,
          error: `This endpoint requires ${requiredTier} tier or higher. Your tier: ${apiKey.tier}`,
        },
        { status: 403 }
      );
    }

    const response = await handler(request, apiKey);

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', apiKey.dailyLimit.toString());
    response.headers.set(
      'X-RateLimit-Remaining',
      (apiKey.dailyLimit - apiKey.requestsToday).toString()
    );
    response.headers.set('X-Powered-By', 'PhillySportsPack API v1');

    // Log usage
    await logApiUsage(
      apiKey.id,
      request.nextUrl.pathname,
      response.status,
      Date.now() - startTime
    );

    return response;
  };
}

/**
 * Optional API key - if provided, validate it. If not, still allow access but without premium features.
 */
export function withOptionalApiAuth(
  handler: (req: NextRequest, apiKey: ApiKeyInfo | null) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const startTime = Date.now();
    const apiKey = request.headers.get('X-API-Key')
      ? await validateApiKey(request)
      : null;

    const response = await handler(request, apiKey);

    // Add rate limit headers if API key was provided
    if (apiKey) {
      response.headers.set('X-RateLimit-Limit', apiKey.dailyLimit.toString());
      response.headers.set(
        'X-RateLimit-Remaining',
        (apiKey.dailyLimit - apiKey.requestsToday).toString()
      );
      response.headers.set('X-Powered-By', 'PhillySportsPack API v1');

      // Log usage
      await logApiUsage(
        apiKey.id,
        request.nextUrl.pathname,
        response.status,
        Date.now() - startTime
      );
    }

    return response;
  };
}
