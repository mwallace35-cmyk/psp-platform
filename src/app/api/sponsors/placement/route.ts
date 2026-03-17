import { getActiveSponsor, recordImpression } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/sponsors/placement
 * Query params: placementType, entityType?, entityId?
 * Returns: active sponsor placement HTML or 204 No Content
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placementType = searchParams.get("placementType");
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!placementType) {
      return NextResponse.json(
        { error: "placementType is required" },
        { status: 400 }
      );
    }

    const entityIdNum = entityId ? parseInt(entityId) : undefined;

    const placement = await getActiveSponsor(
      placementType,
      entityType || undefined,
      entityIdNum
    );

    if (!placement) {
      return new NextResponse(null, { status: 204 });
    }

    // Record impression asynchronously (don't wait for it)
    recordImpression(placement.id).catch(console.error);

    // Return sponsor HTML with CORS headers
    const html = placement.creative_html || `
      <div style="text-align: center; padding: 16px; background: #f0f0f0; border-radius: 8px;">
        ${
          placement.sponsors?.logo_url
            ? `<img src="${placement.sponsors.logo_url}" alt="${placement.sponsors?.name}" style="max-width: 100%; height: auto;" />`
            : `<p style="font-weight: bold;">${placement.sponsors?.name}</p>`
        }
      </div>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sponsor placement API error:", error);
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
