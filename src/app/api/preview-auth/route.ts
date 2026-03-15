import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD || process.env.PSP_PREVIEW_KEY || "";

export async function POST(request: NextRequest) {
  if (!SITE_PASSWORD) {
    return NextResponse.json({ error: "No site password configured" }, { status: 500 });
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    // Constant-time comparison
    if (password.length !== SITE_PASSWORD.length) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    let result = 0;
    for (let i = 0; i < password.length; i++) {
      result |= password.charCodeAt(i) ^ SITE_PASSWORD.charCodeAt(i);
    }

    if (result !== 0) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Password correct — set bypass cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("psp_preview", "1", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
