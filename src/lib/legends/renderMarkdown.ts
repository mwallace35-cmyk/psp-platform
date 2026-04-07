import { Marked } from "marked";

/**
 * Markdown → HTML renderer used by legend pages. Built on top of `marked`
 * with default rendering — all visual styling lives in the `.legend-prose`
 * CSS class in `src/app/globals.css`. We do NOT inject Tailwind utility
 * classes here because Tailwind v4's static extractor cannot see classes
 * embedded in renderer string templates, so they get tree-shaken out of
 * the production CSS bundle.
 *
 * Supports the full CommonMark surface area: headings, paragraphs,
 * bold/italic, ordered + unordered lists, blockquotes, links, inline
 * code, code blocks, and horizontal rules.
 */
const markedInstance = new Marked({ gfm: true, breaks: false });

/**
 * Convert a markdown string to HTML using the legend renderer.
 * Returns a string suitable for `dangerouslySetInnerHTML`. The wrapping
 * `<article class="legend-prose">` is added by `LegendBody.tsx`.
 */
export function renderMarkdown(content: string): string {
  if (!content) return "";
  return markedInstance.parse(content) as string;
}

/**
 * Turn a markdown h2/h3 header into an anchor-safe id. Used by the
 * sticky pill nav to jump to narrative sections.
 */
export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface ExtractedHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

/**
 * Walk a markdown body and pull out its top-level headings (h2 + h3)
 * so the sticky pill nav can render jump-links for each section.
 */
export function extractHeadings(body: string): ExtractedHeading[] {
  if (!body) return [];
  const out: ExtractedHeading[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m3 = line.match(/^###\s+(.+)$/);
    if (m3) {
      const text = m3[1].trim();
      out.push({ level: 3, text, id: slugifyHeading(text) });
      continue;
    }
    const m2 = line.match(/^##\s+(.+)$/);
    if (m2) {
      const text = m2[1].trim();
      out.push({ level: 2, text, id: slugifyHeading(text) });
    }
  }
  return out;
}
