import { NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/static";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "MISSING";

  const envInfo = {
    url: url === "MISSING" ? "MISSING" : url.substring(0, 40) + "...",
    key: key === "MISSING" ? "MISSING" : key.substring(0, 20) + "...",
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    const supabase = createStaticClient();
    const { data, error, count } = await supabase
      .from("schools")
      .select("id, name", { count: "exact" })
      .is("deleted_at", null)
      .limit(3);

    return NextResponse.json({
      status: "ok",
      env: envInfo,
      query: {
        rowCount: data?.length ?? 0,
        totalCount: count,
        error: error ? { message: error.message, code: error.code, details: error.details } : null,
        sample: data?.map((s: { id: number; name: string }) => s.name) ?? [],
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: "error",
      env: envInfo,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
