import Link from "next/link";
import type { TimelineNode } from "@/lib/data/player-timeline";

interface PlayerTimelineProps {
  nodes: TimelineNode[];
}

const NODE_STYLE: Record<
  TimelineNode["kind"],
  { accent: string; label: string }
> = {
  hs: { accent: "var(--psp-gold, #f0a500)", label: "High School" },
  college: { accent: "#3b82f6", label: "College" },
  draft: { accent: "#a855f7", label: "Drafted" },
  pro: { accent: "#16a34a", label: "Pro" },
  milestone: { accent: "#ef4444", label: "Milestone" },
};

function NodeBody({ node }: { node: TimelineNode }) {
  switch (node.kind) {
    case "hs":
      return (
        <>
          {node.schoolSlug ? (
            <Link
              href={`/schools/${node.schoolSlug}`}
              className="font-semibold text-sm hover:underline"
              style={{ color: "var(--psp-gold, #f0a500)" }}
            >
              {node.school}
            </Link>
          ) : (
            <span className="font-semibold text-sm" style={{ color: "var(--psp-gold, #f0a500)" }}>
              {node.school}
            </span>
          )}
          {node.graduationYear && (
            <div className="text-xs text-gray-300 mt-0.5">Class of {node.graduationYear}</div>
          )}
        </>
      );
    case "college":
      return (
        <>
          <div className="font-semibold text-sm text-white">{node.college}</div>
          {node.collegeSport && (
            <div className="text-xs text-gray-300 mt-0.5 capitalize">{node.collegeSport}</div>
          )}
        </>
      );
    case "draft":
      return (
        <>
          <div className="font-semibold text-sm text-white">
            {node.year ? `${node.year} · ` : ""}
            {node.league}
          </div>
          {node.team && <div className="text-xs text-gray-300 mt-0.5">{node.team}</div>}
          {node.round && <div className="text-xs text-gray-400">{node.round}</div>}
        </>
      );
    case "pro":
      return (
        <>
          <div className="font-semibold text-sm text-white">{node.team}</div>
          {node.league && <div className="text-xs text-gray-300 mt-0.5">{node.league}</div>}
          {node.role && <div className="text-xs text-gray-400">{node.role}</div>}
        </>
      );
    case "milestone":
      return (
        <>
          <div className="font-semibold text-sm text-white">{node.title}</div>
          {node.subtitle && <div className="text-xs text-gray-300 mt-0.5">{node.subtitle}</div>}
          {node.year && <div className="text-xs text-gray-400">{node.year}</div>}
        </>
      );
  }
}

/**
 * PlayerTimeline — horizontal career narrative.
 *
 * Renders HS → College → Draft → Pro → Milestones as connected nodes.
 * Mobile: horizontal scroll with snap. Desktop: equal-width grid.
 * If only the HS node exists, renders a compact one-liner instead of a full timeline.
 */
export default function PlayerTimeline({ nodes }: PlayerTimelineProps) {
  if (nodes.length === 0) return null;

  // Compact empty-state for HS-only (common for pre-2000 or non-pro players)
  if (nodes.length === 1 && nodes[0].kind === "hs") {
    const hs = nodes[0];
    return (
      <section id="timeline" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-6 border-b border-gray-200">
        <h2 className="psp-h3 mb-2" style={{ color: "var(--psp-navy)" }}>
          Career Path
        </h2>
        <p className="text-sm text-gray-600">
          Began at{" "}
          {hs.schoolSlug ? (
            <Link
              href={`/schools/${hs.schoolSlug}`}
              className="font-semibold hover:underline"
              style={{ color: "var(--psp-gold-text, #b97c00)" }}
            >
              {hs.school}
            </Link>
          ) : (
            <span className="font-semibold">{hs.school}</span>
          )}
          {hs.graduationYear ? ` · Graduated ${hs.graduationYear}` : ""}.
        </p>
      </section>
    );
  }

  return (
    <section id="timeline" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
      <h2 className="psp-h2 mb-1" style={{ color: "var(--psp-navy)" }}>
        Career Path
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        HS to the next level — {nodes.length} stop{nodes.length === 1 ? "" : "s"}.
      </p>

      <div
        className="relative rounded-xl p-5 overflow-x-auto"
        style={{ background: "var(--psp-navy, #0a1628)" }}
      >
        {/* Connecting line */}
        <div
          aria-hidden="true"
          className="absolute left-5 right-5 top-[42px] h-[2px] rounded"
          style={{ background: "rgba(245, 235, 214, 0.15)" }}
        />

        <ol
          className="relative flex items-stretch gap-4 min-w-max"
          style={{ listStyle: "none" }}
        >
          {nodes.map((node, i) => {
            const style = NODE_STYLE[node.kind];
            return (
              <li
                key={`${node.kind}-${i}`}
                className="flex flex-col items-start flex-1 min-w-[160px] max-w-[220px]"
              >
                {/* Dot + label row */}
                <div className="flex items-center gap-2 mb-2 w-full">
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 rounded-full flex-shrink-0 border-2"
                    style={{
                      background: style.accent,
                      borderColor: "var(--psp-navy, #0a1628)",
                      boxShadow: `0 0 0 2px ${style.accent}40`,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: style.accent, letterSpacing: 0.8 }}
                  >
                    {style.label}
                  </span>
                </div>

                {/* Card */}
                <div
                  className="rounded-lg p-3 w-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${style.accent}30`,
                  }}
                >
                  <NodeBody node={node} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
