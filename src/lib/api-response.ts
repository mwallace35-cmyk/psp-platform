import { NextResponse } from "next/server";

/**
 * Standardized API response helper for successful requests.
 * Returns a 200 OK (or custom status) with structured success response.
 *
 * @param data - The data payload to return to the client
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success structure
 *
 * @example
 * export async function GET() {
 *   const data = await fetchPlayers();
 *   return apiSuccess(data);
 * }
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Standardized API response helper for error requests.
 * Returns an error response with structured error information.
 *
 * @param message - Human-readable error message
 * @param status - HTTP status code (default: 400)
 * @param code - Optional error code for client-side error handling (auto-generated from status if not provided)
 * @returns NextResponse with error structure
 *
 * @example
 * export async function GET() {
 *   if (!user) {
 *     return apiError("User not found", 404, "USER_NOT_FOUND");
 *   }
 *   return apiSuccess(user);
 * }
 */
export function apiError(message: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      success: false,
      error: { message, code: code || `ERR_${status}` },
    },
    { status }
  );
}
