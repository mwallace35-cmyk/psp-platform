/**
 * Content Cleaner — Strips HTML artifacts from archive articles
 * and generates proper excerpts for display and SEO.
 */

// Common HTML/FrontPage artifacts to strip
const HTML_ARTIFACT_PATTERNS = [
  // FrontPage meta tags and HTML fragments
  /<meta[^>]*>/gi,
  /<\/?font[^>]*>/gi,
  /<\/?span[^>]*>/gi,
  /<\/?div[^>]*>/gi,
  /<\/?center[^>]*>/gi,
  /<\/?marquee[^>]*>/gi,
  /<style[^>]*>[\s\S]*?<\/style>/gi,
  /<script[^>]*>[\s\S]*?<\/script>/gi,
  // FrontPage comments
  /<!--[\s\S]*?-->/g,
  // Non-breaking spaces and encoding artifacts
  /&nbsp;/gi,
  /\u00A0/g,
  // Repeated whitespace
  /\s{3,}/g,
  // Leading pipes from bad table conversion
  /^\|+\s*/gm,
  /\s*\|+$/gm,
  // FrontPage bot tags
  /<!--webbot[^>]*>/gi,
  // Orphaned HTML entities
  /&lt;br\s*\/?&gt;/gi,
  /&lt;\/?p&gt;/gi,
];

// Patterns that indicate raw archive content (for detection)
const ARCHIVE_INDICATORS = [
  /\| Kruz News/i,
  /\| Ted Silary/i,
  /<font/i,
  /<!--webbot/i,
  /FrontPage/i,
  /&nbsp;&nbsp;/i,
];

/**
 * Clean article body content by stripping HTML artifacts
 */
export function cleanArticleContent(content: string): string {
  if (!content) return "";

  let cleaned = content;

  // Apply all artifact patterns
  for (const pattern of HTML_ARTIFACT_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ");
  }

  // Normalize line breaks
  cleaned = cleaned
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Remove leading "| " prefix from archive content lines
  cleaned = cleaned
    .split("\n")
    .map(line => line.replace(/^\|\s*/, "").trim())
    .filter(line => line.length > 0 || line === "")
    .join("\n");

  return cleaned;
}

/**
 * Generate a clean excerpt from article content
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  if (!content) return "";

  // Clean the content first
  const cleaned = cleanArticleContent(content);

  // Strip any remaining HTML-like tags
  const plainText = cleaned
    .replace(/<[^>]+>/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Take first N characters at a word boundary
  if (plainText.length <= maxLength) return plainText;

  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 80 ? truncated.substring(0, lastSpace) : truncated) + "...";
}

/**
 * Detect if content is raw archive content that needs cleaning
 */
export function isArchiveContent(content: string): boolean {
  if (!content) return false;
  return ARCHIVE_INDICATORS.some(pattern => pattern.test(content));
}

/**
 * Clean and enhance article for display
 */
export function processArticleForDisplay(article: {
  body?: string | null;
  content?: string | null;
  excerpt?: string | null;
  source_file?: string | null;
}) {
  const rawContent = article.body || article.content || "";
  const isArchive = !!article.source_file || isArchiveContent(rawContent);

  return {
    cleanedBody: isArchive ? cleanArticleContent(rawContent) : rawContent,
    excerpt: article.excerpt || generateExcerpt(rawContent),
    isArchive,
  };
}
