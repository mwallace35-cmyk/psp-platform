import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ClaimSchema = z.object({
  player_id: z.number().positive(),
  claimant_name: z.string().min(2),
  claimant_email: z.string().email(),
  relationship: z.string().min(2),
  claimed_data: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 claims per hour per IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const supabase = await createClient();

    // Check recent claims from this IP
    const { data: recentClaims, error: checkError } = await supabase
      .from("player_claims")
      .select("id")
      .eq("ip_address", ip)
      .gte("created_at", new Date(Date.now() - 3600000).toISOString())
      .limit(5);

    if (checkError) throw checkError;

    if (recentClaims && recentClaims.length >= 5) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in 1 hour." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = ClaimSchema.parse(body);

    // Insert claim
    const { data: claim, error: insertError } = await supabase
      .from("player_claims")
      .insert([
        {
          player_id: validated.player_id,
          claimant_name: validated.claimant_name,
          claimant_email: validated.claimant_email,
          relationship: validated.relationship,
          claimed_data: validated.claimed_data || {},
          status: "pending",
          ip_address: ip,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(
      { id: claim.id, message: "Claim submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: (error as any).errors },
        { status: 400 }
      );
    }

    console.error("Error creating claim:", error);
    return NextResponse.json(
      { error: "Failed to submit claim" },
      { status: 500 }
    );
  }
}
