import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Used for any user-generated or markdown-rendered HTML.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "strong", "em", "b", "i", "u",
      "a", "img",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "class", "id",
      "target", "rel", "width", "height",
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize text content for use in JSON-LD schemas.
 * Strips ALL HTML tags, keeping only text.
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}
