/**
 * Returns a display name for a school, adding city disambiguation for out-of-area schools.
 *
 * Local schools (PCL, Public League, Inter-Ac, or Philadelphia area) → just the name
 * Out-of-area schools with a city → "Name (City)"
 * Out-of-area schools without a city → just the name
 */

const LOCAL_LEAGUE_IDS = new Set([1, 2, 3, 4, 5, 6, 7]);
const LOCAL_CITIES = new Set([
  'philadelphia', 'philly', 'wyndmoor', 'warminster', 'radnor', 'springfield',
  'bala cynwyd', 'bryn mawr', 'merion', 'ardmore', 'haverford', 'newtown square',
  'drexel hill', 'lansdale', 'glenside', 'cheltenham', 'jenkintown', 'elkins park',
  'wyncote', 'abington', 'ambler', 'chester', 'aston', 'media', 'malvern',
  'devon', 'villanova', 'wayne', 'narberth', 'wynnewood',
]);

export function getSchoolDisplayName(school: {
  name: string;
  city?: string | null;
  league_id?: number | null;
}): string {
  if (school.league_id && LOCAL_LEAGUE_IDS.has(school.league_id)) {
    return school.name;
  }
  if (school.city && LOCAL_CITIES.has(school.city.toLowerCase())) {
    return school.name;
  }
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
