import { recordClick } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/sponsors/click
 * Body: { placementId: number, redirectUrl: string }
 * Records a click and redirects to sponsor website
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { placementId, redirectUrl } = body;

    if (!placementId || !redirectUrl) {
      return NextResponse.json(
        { error: "placementId and redirectUrl are required" },
        { status: 400 }
      );
    }

    // Record click asynchronously
    recordClick(placementId).catch(console.error);

    // Return redirect
    return NextResponse.json(
      { redirectUrl },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Sponsor click API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
