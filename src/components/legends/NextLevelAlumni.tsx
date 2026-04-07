import type { NextLevelAlum } from "@/content/legends-schema";

interface Props {
  alumni: NextLevelAlum[];
}

const LEVEL_STYLES: Record<
  NextLevelAlum["level"],
  { bg: string; text: string; label: string }
> = {
  NFL: { bg: "#013369", text: "#ffffff", label: "NFL" },
  NBA: { bg: "#1d428a", text: "#c8102e", label: "NBA" },
  MLB: { bg: "#041e42", text: "#bf0d3e", label: "MLB" },
  NHL: { bg: "#000000", text: "#ffffff", label: "NHL" },
  MLS: { bg: "#001e62", text: "#ffffff", label: "MLS" },
  WNBA: { bg: "#fc4c02", text: "#ffffff", label: "WNBA" },
  D1: { bg: "var(--psp-navy)", text: "var(--psp-gold)", label: "D1" },
  D2: { bg: "var(--psp-navy)", text: "#ffffff", label: "D2" },
  D3: { bg: "var(--psp-gray-700)", text: "#ffffff", label: "D3" },
};

/**
 * Pro / college alumni grid. Replaces inline `- **Name** — team` markdown
 * lists. Renders nothing if no alumni are provided so a stray
 * `{{NextLevelAlumni}}` token in a file with no `nextLevelAlumni` array
 * is harmless.
 */
export default function NextLevelAlumni({ alumni }: Props) {
  if (!alumni || alumni.length === 0) return null;

  return (
    <div className="my-8 not-prose">
      <div className="grid gap-3 sm:grid-cols-2">
        {alumni.map((a, i) => {
          const style = LEVEL_STYLES[a.level];
          return (
            <div
              key={`${a.name}-${i}`}
              className="bg-white border border-[var(--psp-gray-200)] rounded-lg p-4 shadow-sm flex items-start gap-3"
            >
              <span
                className="inline-flex items-center justify-center text-[11px] font-bold tracking-wider px-2 py-1 rounded shrink-0"
                style={{
                  backgroundColor: style.bg,
                  color: style.text,
                  fontFamily: "var(--font-heading, 'Bebas Neue'), sans-serif",
                }}
              >
                {style.label}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[var(--psp-navy)] leading-tight">
                  {a.name}
                </div>
                {a.team && (
                  <div className="text-sm text-[var(--psp-gray-600)] leading-tight mt-0.5">
                    {a.team}
                    {a.position ? ` · ${a.position}` : ""}
                  </div>
                )}
                {(a.draftYear || a.draftRound || a.notes) && (
                  <div className="text-xs text-[var(--psp-gray-500)] mt-1">
                    {a.draftRound && a.draftYear
                      ? `Round ${a.draftRound} · ${a.draftYear} draft`
                      : a.draftYear
                        ? `${a.draftYear}`
                        : ""}
                    {a.notes && (a.draftYear || a.draftRound) ? " · " : ""}
                    {a.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
