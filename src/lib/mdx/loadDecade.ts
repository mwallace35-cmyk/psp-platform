import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type { DecadeSlug } from "@/lib/data/decades";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "decades");

export interface DecadeMDX {
  slug: DecadeSlug;
  label: string;
  years: string;
  headline?: string;
  pullQuote?: string;
  /** Raw markdown body (prose only — no JSX tokens). */
  body: string;
}

export const loadDecadeMDX = cache(
  (slug: DecadeSlug): DecadeMDX | null => {
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

    return {
      slug,
      label: (data.label as string) ?? slug,
      years: (data.years as string) ?? "",
      headline: data.headline as string | undefined,
      pullQuote: data.pullQuote as string | undefined,
      body: content ?? "",
    };
  },
);
