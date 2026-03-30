import { createClient } from "@/lib/data/common";

export interface CronLogEntry {
  cronName: string;
  league?: string;
  runDate?: string;
  status: "success" | "partial" | "error";
  gamesFetched?: number;
  phillyGames?: number;
  playersMatched?: number;
  narrativesGenerated?: number;
  dykGenerated?: number;
  inputTokens?: number;
  outputTokens?: number;
  costCents?: number;
  errors?: Array<{ [key: string]: string }>;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export async function logCronRun(entry: CronLogEntry): Promise<void> {
  try {
    const supabase = await createClient();
    await (supabase as any).from("cron_logs").insert({
      cron_name: entry.cronName,
      league: entry.league || null,
      run_date: entry.runDate || null,
      status: entry.status,
      games_fetched: entry.gamesFetched || 0,
      philly_games: entry.phillyGames || 0,
      players_matched: entry.playersMatched || 0,
      narratives_generated: entry.narrativesGenerated || 0,
      dyk_generated: entry.dykGenerated || 0,
      input_tokens: entry.inputTokens || 0,
      output_tokens: entry.outputTokens || 0,
      cost_cents: entry.costCents || 0,
      errors: entry.errors && entry.errors.length > 0 ? entry.errors : [],
      duration_ms: entry.durationMs || null,
      metadata: entry.metadata || {},
    });
  } catch (err) {
    console.error("[cron-logger] Failed to log cron run:", err instanceof Error ? err.message : String(err));
  }
}
