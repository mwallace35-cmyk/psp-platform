import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const { schoolSlug } = await params;

    // Check API key
    const apiKey = request.headers.get("x-api-key");
    const validApiKey = process.env.NEXT_PUBLIC_API_KEY || "public";

    if (apiKey && apiKey !== validApiKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get school by slug
    const { data: school, error: schoolError } = await supabase
      .from("schools")
      .select("id, name, slug")
      .eq("slug", schoolSlug)
      .single();

    if (schoolError || !school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    // Get coaching staff
    const { data: staff, error: staffError } = await supabase
      .from("coaching_stints")
      .select(`
        *,
        coaches:coach_id(id, name, slug, photo_url, bio),
        sports:sport_id(id, name)
      `)
      .eq("school_id", school.id)
      .order("start_year", { ascending: false });

    if (staffError) throw staffError;

    return NextResponse.json({
      school: {
        id: school.id,
        name: school.name,
        slug: school.slug,
      },
      staff: staff || [],
      total: staff?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching coaching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch coaching staff" },
      { status: 500 }
    );
  }
}
