import { notFound } from "next/navigation";
import { isValidSport, type SportId } from "@/lib/sports";

/**
 * Validates a sport parameter and returns the sport ID.
 * Calls notFound() if the sport is invalid.
 *
 * Uses TypeScript type guards to ensure the result is a valid SportId.
 * Supports both Promise-based params (Next.js 15+) and direct params objects.
 *
 * @example
 * const sport = await validateSportParam(params);
 * // sport is now guaranteed to be a valid SportId
 */
export async function validateSportParam(
  params: Promise<{ sport: string }> | { sport: string }
): Promise<SportId> {
  const { sport } = await Promise.resolve(params).then((p) => {
    if (p instanceof Promise) return p;
    return p;
  });

  if (!isValidSport(sport)) notFound();
  return sport;
}

/**
 * Validates a sport parameter for metadata generation.
 * Returns null if the sport is invalid (instead of calling notFound).
 *
 * Type-safe: the type guard in isValidSport ensures the return type
 * is properly narrowed to SportId | null.
 *
 * @example
 * const sport = await validateSportParamForMetadata(params);
 * if (!sport) return {};
 * const meta = SPORT_META[sport]; // sport is now typed as SportId
 */
export async function validateSportParamForMetadata(
  params: Promise<{ sport: string }> | { sport: string }
): Promise<SportId | null> {
  const { sport } = await Promise.resolve(params).then((p) => {
    if (p instanceof Promise) return p;
    return p;
  });

  if (!isValidSport(sport)) return null;
  return sport;
}
