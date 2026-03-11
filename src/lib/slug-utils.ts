/**
 * Generate URL-friendly slug from a name string
 * Example: "John Doe" -> "john-doe"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Create a slug for a pro athlete: name-id
 * Example: "Marvin Harrison Jr." (ID: 1234) -> "marvin-harrison-jr-1234"
 */
export function createProAthleteSlug(name: string, id: number): string {
  const nameSlug = generateSlug(name);
  return `${nameSlug}-${id}`;
}

/**
 * Parse a pro athlete slug to get ID
 * Example: "marvin-harrison-jr-1234" -> 1234
 */
export function parseProAthleteSlug(slug: string): number | null {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  return isNaN(id) ? null : id;
}
