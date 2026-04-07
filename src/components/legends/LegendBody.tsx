import { renderMarkdown, slugifyHeading } from "@/lib/legends/renderMarkdown";
import type { LegendFrontmatter } from "@/content/legends-schema";
import ChampionshipRecap from "./ChampionshipRecap";
import PhotoInline from "./PhotoInline";
import PullQuote from "./PullQuote";
import AllStarTable, { type AllStarMatch } from "./AllStarTable";
import NextLevelAlumni from "./NextLevelAlumni";
import CareerLedger from "./CareerLedger";
import ArchivalQuote from "./ArchivalQuote";

interface Props {
  frontmatter: LegendFrontmatter;
  body: string;
  allStarMatches?: AllStarMatch[];
}

/**
 * Renders a legend's MDX body: raw markdown prose with inline component
 * tokens like {{PhotoInline id="hero-sideline"}} that get swapped in for
 * the React components below, pulling data from the matching frontmatter
 * array. The body stays readable as markdown; the structured data stays
 * structured; the rendering stays deterministic and safe.
 *
 * Supported tokens:
 *   {{ChampionshipRecap id="..."}}   matches frontmatter.championships[].recapId
 *   {{PhotoInline id="..."}}         matches frontmatter.photos[].id
 *   {{PullQuote id="..."}}           matches frontmatter.pullQuotes[].id
 *   {{AllStarTable}}                 renders frontmatter.allStars in place
 *
 * Also injects id="..." anchors on h2/h3 headings so the sticky pill nav
 * can jump to each narrative section.
 */
const TOKEN_REGEX =
  /\{\{\s*(ChampionshipRecap|PhotoInline|PullQuote|AllStarTable|NextLevelAlumni|CareerLedger|ArchivalQuote)(\s+id=["']([^"']+)["'])?\s*\}\}/g;

interface MarkdownChunk {
  type: "md";
  content: string;
}
interface ComponentChunk {
  type: "component";
  name: string;
  id?: string;
}
type Chunk = MarkdownChunk | ComponentChunk;

function splitBody(body: string): Chunk[] {
  const chunks: Chunk[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(body)) !== null) {
    if (match.index > lastIndex) {
      chunks.push({ type: "md", content: body.slice(lastIndex, match.index) });
    }
    chunks.push({ type: "component", name: match[1], id: match[3] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) {
    chunks.push({ type: "md", content: body.slice(lastIndex) });
  }
  return chunks;
}

function anchorizeHeadings(html: string): string {
  // After renderMarkdown has already converted markdown to HTML, add
  // id="..." to h2 and h3 elements so the sticky pill nav can scroll to them.
  return html
    .replace(
      /<h2([^>]*)>([\s\S]*?)<\/h2>/g,
      (_m, attrs: string, inner: string) => {
        const text = inner.replace(/<[^>]+>/g, "").trim();
        return `<h2 id="${slugifyHeading(text)}"${attrs}>${inner}</h2>`;
      },
    )
    .replace(
      /<h3([^>]*)>([\s\S]*?)<\/h3>/g,
      (_m, attrs: string, inner: string) => {
        const text = inner.replace(/<[^>]+>/g, "").trim();
        return `<h3 id="${slugifyHeading(text)}"${attrs}>${inner}</h3>`;
      },
    );
}

export default function LegendBody({
  frontmatter,
  body,
  allStarMatches = [],
}: Props) {
  const chunks = splitBody(body);

  return (
    <article className="legend-prose text-[15px]">
      {chunks.map((chunk, i) => {
        if (chunk.type === "md") {
          const html = anchorizeHeadings(renderMarkdown(chunk.content));
          if (!html.trim()) return null;
          return (
            <div
              key={`md-${i}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // Component tokens
        if (chunk.name === "ChampionshipRecap" && chunk.id) {
          const champ = frontmatter.championships?.find(
            (c) => c.recapId === chunk.id,
          );
          if (!champ) return null;
          return (
            <div key={`champ-${i}`} id={`championship-${chunk.id}`}>
              <ChampionshipRecap championship={champ} />
            </div>
          );
        }

        if (chunk.name === "PhotoInline" && chunk.id) {
          const photo = frontmatter.photos?.find((p) => p.id === chunk.id);
          if (!photo) return null;
          return (
            <PhotoInline
              key={`photo-${i}`}
              photo={photo}
              slug={frontmatter.slug}
            />
          );
        }

        if (chunk.name === "PullQuote" && chunk.id) {
          const quote = frontmatter.pullQuotes?.find((q) => q.id === chunk.id);
          if (!quote) return null;
          return <PullQuote key={`quote-${i}`} quote={quote} />;
        }

        if (chunk.name === "AllStarTable") {
          if (!frontmatter.allStars || frontmatter.allStars.length === 0) {
            return null;
          }
          return (
            <div key={`all-star-${i}`} id="all-stars" className="my-10">
              <AllStarTable
                allStars={frontmatter.allStars}
                matches={allStarMatches}
              />
            </div>
          );
        }

        if (chunk.name === "NextLevelAlumni") {
          if (
            !frontmatter.nextLevelAlumni ||
            frontmatter.nextLevelAlumni.length === 0
          ) {
            return null;
          }
          return (
            <NextLevelAlumni
              key={`alumni-${i}`}
              alumni={frontmatter.nextLevelAlumni}
            />
          );
        }

        if (chunk.name === "CareerLedger") {
          if (!frontmatter.stints || frontmatter.stints.length === 0) {
            return null;
          }
          return <CareerLedger key={`ledger-${i}`} stints={frontmatter.stints} />;
        }

        if (chunk.name === "ArchivalQuote" && chunk.id) {
          const aq = frontmatter.archivalQuotes?.find((q) => q.id === chunk.id);
          if (!aq) return null;
          return <ArchivalQuote key={`aq-${i}`} quote={aq} />;
        }

        return null;
      })}
    </article>
  );
}
