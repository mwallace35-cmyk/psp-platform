/**
 * My Schools Management Library
 * Provides utilities for managing bookmarked/favorite schools
 * Uses browser localStorage with fallback for SSR
 */

const MY_SCHOOLS_KEY = 'psp-my-schools';

/**
 * Check if localStorage is available (SSR-safe)
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all bookmarked school slugs from localStorage
 */
export function getMySchools(): string[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const data = localStorage.getItem(MY_SCHOOLS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Add a school slug to bookmarked schools
 */
export function addMySchool(slug: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const schools = getMySchools();
    if (!schools.includes(slug)) {
      schools.push(slug);
      localStorage.setItem(MY_SCHOOLS_KEY, JSON.stringify(schools));
    }
  } catch (error) {
    console.warn('Failed to add school to bookmarks:', error);
  }
}

/**
 * Remove a school slug from bookmarked schools
 */
export function removeMySchool(slug: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const schools = getMySchools();
    const filtered = schools.filter((s) => s !== slug);
    localStorage.setItem(MY_SCHOOLS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn('Failed to remove school from bookmarks:', error);
  }
}

/**
 * Check if a school slug is bookmarked
 */
export function isMySchool(slug: string): boolean {
  return getMySchools().includes(slug);
}

/**
 * Toggle bookmark status for a school
 */
export function toggleMySchool(slug: string): boolean {
  const isBookmarked = isMySchool(slug);
  if (isBookmarked) {
    removeMySchool(slug);
    return false;
  } else {
    addMySchool(slug);
    return true;
  }
}
