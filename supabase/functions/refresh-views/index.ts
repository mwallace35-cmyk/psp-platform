import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RefreshRequest {
  views?: string[]
  all?: boolean
}

// Valid materialized views that can be refreshed
const ALLOWED_VIEWS = [
  'football_career_leaders',
  'basketball_career_leaders',
  'season_leaderboards',
]

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authorization
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const body: RefreshRequest = await req.json().catch(() => ({}))
    const views = body.views || (body.all ? ALLOWED_VIEWS : [])

    if (!views.length) {
      return new Response(
        JSON.stringify({
          error: 'No views specified. Provide "views" array or set "all": true',
          allowed: ALLOWED_VIEWS,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate views
    const invalidViews = views.filter((v) => !ALLOWED_VIEWS.includes(v))
    if (invalidViews.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Invalid views: ${invalidViews.join(', ')}`,
          allowed: ALLOWED_VIEWS,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Refresh views
    const results: Record<string, { success: boolean; duration?: number; error?: string }> = {}

    for (const view of views) {
      const startTime = Date.now()

      try {
        await supabase.rpc('refresh_materialized_view', { view_name: view })

        results[view] = {
          success: true,
          duration: Date.now() - startTime,
        }
      } catch (error) {
        results[view] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    }

    const allSuccess = Object.values(results).every((r) => r.success)

    return new Response(JSON.stringify({ results, success: allSuccess }), {
      status: allSuccess ? 200 : 207,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
