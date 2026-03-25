/**
 * Sanitize HTML content to prevent XSS attacks.
 * Lightweight server-safe sanitizer — no JSDOM dependency.
 * Only allows known-safe tags and attributes for article content.
 */

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "strong", "em", "b", "i", "u",
  "a", "img",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "div", "span",
]);

const ALLOWED_ATTR = new Set([
  "href", "src", "alt", "title", "class", "id",
  "target", "rel", "width", "height",
]);

export function sanitizeHtml(dirty: string): string {
  // Strip script/style/iframe tags and their content entirely
  let clean = dirty
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "");

  // Strip on* event handlers from all tags
  clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  clean = clean.replace(/\s+on\w+\s*=\s*\S+/gi, "");

  // Remove javascript: URLs
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');

  // Strip disallowed tags (keep their text content)
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    const tagLower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(tagLower)) return "";

    // For allowed tags, strip disallowed attributes
    if (match.startsWith("</")) return match; // closing tags are fine
    return match.replace(/\s+([a-zA-Z-]+)\s*=\s*(?:"[^"]*"|'[^']*'|\S+)/g, (attrMatch, attrName) => {
      return ALLOWED_ATTR.has(attrName.toLowerCase()) ? attrMatch : "";
    });
  });

  return clean;
}

/**
 * Sanitize text content for use in JSON-LD schemas.
 * Strips ALL HTML tags, keeping only text.
 */
export function sanitizeText(dirty: string): string {
  return dirty.replace(/<[^>]*>/g, "").trim();
}
