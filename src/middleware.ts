import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const BYPASS_COOKIE = "psp_preview";
const BYPASS_KEY = "psp2026";

const PASSTHROUGH_PREFIXES = [
  "/coming-soon",
  "/admin",
  "/login",
  "/api",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap",
  "/manifest",
];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Set bypass cookie via ?preview=psp2026
  if (searchParams.get("preview") === BYPASS_KEY) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    response.cookies.set(BYPASS_COOKIE, "1", {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }

  // Allow passthrough routes
  const isPassthrough = PASSTHROUGH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix + ".")
  );

  if (!isPassthrough) {
    const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "1";
    if (!hasBypass) {
      const url = request.nextUrl.clone();
      url.pathname = "/coming-soon";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Admin auth gate
  if (pathname.startsWith("/admin") || pathname === "/login") {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
