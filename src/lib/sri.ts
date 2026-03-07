/**
 * Subresource Integrity (SRI) utility for secure external resource loading
 *
 * SRI protects against compromised CDNs by ensuring external resources haven't been tampered with.
 * To regenerate SRI hashes:
 * 1. When updating external resource URLs, run: `curl https://resource-url.js | openssl dgst -sha384 -binary | openssl base64`
 * 2. Update the SRI_HASHES map below with the new hash
 * 3. Always use crossorigin="anonymous" with SRI attributes
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
 */

/**
 * Map of external resources to their SRI hashes (sha384)
 * Format: { url: 'sha384-<hash>' }
 *
 * To regenerate a hash for a new version:
 * curl https://cdn.example.com/script.js | openssl dgst -sha384 -binary | openssl base64
 */
export const SRI_HASHES: Record<string, string> = {
  // Google Analytics - Example hash (update when upgrading)
  'https://www.googletagmanager.com/gtag/js': 'sha384-YOUR_HASH_HERE',
  // Add more external resources as needed
};

/**
 * Generate SRI hash for a given URL (requires server-side access to fetch URL)
 * This is a placeholder function - actual implementation would require fetching the resource
 * @param url - The external resource URL
 * @returns Promise<string> - The SRI hash with 'sha384-' prefix
 */
export async function generateSRIHash(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-384', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    return `sha384-${hashBase64}`;
  } catch (error) {
    console.error(`Failed to generate SRI hash for ${url}:`, error);
    throw error;
  }
}

/**
 * Get SRI hash for a known external resource
 * @param url - The external resource URL
 * @returns The SRI hash if available, undefined otherwise
 */
export function getSRIHash(url: string): string | undefined {
  return SRI_HASHES[url];
}

/**
 * Interface for external resource configuration
 */
export interface ExternalResource {
  url: string;
  type: 'script' | 'stylesheet';
  crossorigin?: 'anonymous' | 'use-credentials';
  defer?: boolean; // for scripts
  async?: boolean; // for scripts
}

/**
 * Validate that an external resource has SRI configured
 * @param resource - The external resource configuration
 * @returns boolean - True if SRI is available for this resource
 */
export function hasSRI(resource: ExternalResource): boolean {
  return getSRIHash(resource.url) !== undefined;
}

/**
 * Helper to build script tag attributes with SRI
 * @param url - The script URL
 * @returns Object with integrity and crossorigin attributes, or empty object if no SRI available
 */
export function getScriptSRIAttributes(url: string): {
  integrity?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
} {
  const hash = getSRIHash(url);
  if (hash) {
    return {
      integrity: hash,
      crossOrigin: 'anonymous',
    };
  }
  return {};
}

/**
 * Helper to build link tag attributes with SRI for stylesheets
 * @param url - The stylesheet URL
 * @returns Object with integrity and crossorigin attributes, or empty object if no SRI available
 */
export function getStylesheetSRIAttributes(url: string): {
  integrity?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
} {
  const hash = getSRIHash(url);
  if (hash) {
    return {
      integrity: hash,
      crossOrigin: 'anonymous',
    };
  }
  return {};
}
