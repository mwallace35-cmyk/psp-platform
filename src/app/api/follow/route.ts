import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      entity_type,
      entity_id,
      notify_scores,
      notify_articles,
      notify_recruiting,
      notify_milestones,
    } = body;

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if already following
    const { data: existing } = await supabase
      .from("user_follows")
      .select("id")
      .eq("user_id", user.id)
      .eq("entity_type", entity_type)
      .eq("entity_id", entity_id)
      .single();

    if (existing) {
      // Update existing follow record
      const { error } = await supabase
        .from("user_follows")
        .update({
          notify_scores: notify_scores ?? true,
          notify_articles: notify_articles ?? true,
          notify_recruiting: notify_recruiting ?? true,
          notify_milestones: notify_milestones ?? true,
        })
        .eq("id", existing.id);

      if (error) {
        console.error("Error updating follow:", error);
        return NextResponse.json(
          { error: "Failed to update follow" },
          { status: 500 }
        );
      }
    } else {
      // Create new follow record
      const { error } = await supabase
        .from("user_follows")
        .insert({
          user_id: user.id,
          entity_type,
          entity_id,
          notify_scores: notify_scores ?? true,
          notify_articles: notify_articles ?? true,
          notify_recruiting: notify_recruiting ?? true,
          notify_milestones: notify_milestones ?? true,
        });

      if (error) {
        console.error("Error creating follow:", error);
        return NextResponse.json(
          { error: "Failed to follow" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in follow endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const entity_type = searchParams.get("entity_type");
    const entity_id = searchParams.get("entity_id");

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_follows")
      .select("*")
      .eq("user_id", user.id)
      .eq("entity_type", entity_type)
      .eq("entity_id", parseInt(entity_id, 10))
      .single();

    if (error) {
      return NextResponse.json({ following: false });
    }

    return NextResponse.json({
      following: !!data,
      preferences: data || {},
    });
  } catch (error) {
    console.error("Error in follow GET endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
