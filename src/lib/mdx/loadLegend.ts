import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import {
  LegendFrontmatterSchema,
  type LegendFrontmatter,
  type LoadedLegend,
} from "@/content/legends-schema";

/**
 * Loads per-legend MDX files from src/content/legends/<slug>.mdx, parses
 * YAML frontmatter via gray-matter, validates it against the Zod schema,
 * and returns the frontmatter + raw markdown body.
 *
 * The body is markdown with inline tokens like {{PhotoInline id="hero"}}
 * that the page renders into React components from the structured
 * frontmatter fields. We deliberately don't use full MDX — content files
 * shouldn't be able to execute arbitrary JSX, and a fixed component set
 * gives us a stable, auditable rendering surface.
 *
 * All helpers are wrapped in React's `cache` so the filesystem work runs
 * once per request even when called from multiple Server Components.
 */

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "legends");

export const getLegendSlugs = cache((): string[] => {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .filter((f) => !f.startsWith("_")) // underscore-prefixed files are drafts/fixtures
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
});

export const loadLegendBySlug = cache(
  (slug: string): LoadedLegend | null => {
    const safeSlug = slug.replace(/[^a-z0-9_-]/gi, "");
    if (safeSlug !== slug) return null;

    const candidates = [
      path.join(CONTENT_DIR, `${slug}.mdx`),
      path.join(CONTENT_DIR, `${slug}.md`),
    ];
    const filepath = candidates.find((p) => fs.existsSync(p));
    if (!filepath) return null;

    const raw = fs.readFileSync(filepath, "utf8");
    const { data, content } = matter(raw);

    const result = LegendFrontmatterSchema.safeParse(data);
    if (!result.success) {
      throw new Error(
        `[loadLegend] Frontmatter validation failed for ${slug}:\n${result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n")}`,
      );
    }

    return {
      frontmatter: result.data as LegendFrontmatter,
      body: content ?? "",
    };
  },
);

export const loadAllLegends = cache((): LoadedLegend[] => {
  return getLegendSlugs()
    .map((slug) => loadLegendBySlug(slug))
    .filter((x): x is LoadedLegend => x !== null);
});

export const loadLegendsByCategory = cache(
  (category: LegendFrontmatter["category"]): LoadedLegend[] => {
    return loadAllLegends().filter((l) => l.frontmatter.category === category);
  },
);
