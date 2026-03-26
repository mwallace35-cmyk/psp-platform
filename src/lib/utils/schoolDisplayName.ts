/**
 * Returns a display name for a school, adding city disambiguation when needed.
 *
 * Two layers of disambiguation:
 * 1. Ambiguous local names (Central, Northeast, Lincoln, Edison, etc.) → always show city
 * 2. Out-of-area schools (not in a local league or local city) → show city
 */

const LOCAL_LEAGUE_IDS = new Set([1, 2, 3, 4, 5, 6, 7]);
const LOCAL_CITIES = new Set([
  'philadelphia', 'philly', 'wyndmoor', 'warminster', 'radnor', 'springfield',
  'bala cynwyd', 'bryn mawr', 'merion', 'ardmore', 'haverford', 'newtown square',
  'drexel hill', 'lansdale', 'glenside', 'cheltenham', 'jenkintown', 'elkins park',
  'wyncote', 'abington', 'ambler', 'chester', 'aston', 'media', 'malvern',
  'devon', 'villanova', 'wayne', 'narberth', 'wynnewood',
]);

/**
 * School names that are ambiguous and need city qualifier even for local schools.
 * These names exist in multiple cities/regions across Pennsylvania.
 */
const AMBIGUOUS_NAMES = new Set([
  'Central',
  'Northeast',
  'Lincoln',
  'Edison',
  'Washington',
  'Kennedy',
  'Franklin',
  'Jefferson',
  'Hamilton',
  'Academy',
  'Prep',
  'Catholic',
  'Christian',
  'Charter',
]);

/** Check if a school name is ambiguous (exact match or starts with an ambiguous word) */
function isAmbiguousName(name: string): boolean {
  if (AMBIGUOUS_NAMES.has(name)) return true;
  // Also check if the full name is just the ambiguous word alone
  // (e.g. "Central" but not "Central Bucks East")
  const firstWord = name.split(/\s+/)[0];
  if (AMBIGUOUS_NAMES.has(firstWord) && name === firstWord) return true;
  return false;
}

export function getSchoolDisplayName(school: {
  name: string;
  city?: string | null;
  league_id?: number | null;
}): string {
  // Always disambiguate ambiguous names if city is available
  if (isAmbiguousName(school.name) && school.city) {
    return `${school.name} (${school.city})`;
  }
  // Local league schools don't need city
  if (school.league_id && LOCAL_LEAGUE_IDS.has(school.league_id)) {
    return school.name;
  }
  // Local-area schools don't need city
  if (school.city && LOCAL_CITIES.has(school.city.toLowerCase())) {
    return school.name;
  }
  // Out-of-area: append city
  if (school.city) {
    return `${school.name} (${school.city})`;
  }
  return school.name;
}

export function getSchoolShortDisplayName(school: {
  name: string;
  short_name?: string | null;
  city?: string | null;
  league_id?: number | null;
}): string {
  const baseName = school.short_name || school.name;
  // Always disambiguate ambiguous names if city is available
  if (isAmbiguousName(baseName) && school.city) {
    return `${baseName} (${school.city})`;
  }
  if (school.league_id && LOCAL_LEAGUE_IDS.has(school.league_id)) {
    return baseName;
  }
  if (school.city && LOCAL_CITIES.has(school.city.toLowerCase())) {
    return baseName;
  }
  if (school.city) {
    return `${baseName} (${school.city})`;
  }
  return baseName;
}
