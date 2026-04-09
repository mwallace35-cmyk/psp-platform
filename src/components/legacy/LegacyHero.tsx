import Link from "next/link";
import type { LegacyProfile, LegacyRelation } from "@/lib/data/legacy";

interface Props {
  profile: LegacyProfile;
  family: { name: string; slug: string; relation: string }[];
}

const RELATION_LABEL: Record<string, string> = {
  father_of: "Father of",
  son_of: "Son of",
  brother_of: "Brother of",
  spouse_of: "Spouse of",
  coached_by: "Coached by",
  coach_of: "Coach of",
  mentored_by: "Mentored by",
  mentor_of: "Mentor of",
};

export default function LegacyHero({ profile, family }: Props) {
  const initials = profile.display_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="relative bg-[var(--psp-navy)] text-white overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(240,165,0,0.3) 10px,
            rgba(240,165,0,0.3) 11px
          )`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo or initials avatar */}
          <div className="flex-shrink-0">
            {profile.hero_photo_url ? (
              <img
                src={profile.hero_photo_url}
                alt={profile.display_name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[var(--psp-gold)]"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[var(--psp-navy-mid)] border-4 border-[var(--psp-gold)] flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-[var(--psp-gold)] font-['Bebas_Neue']">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            {/* Career Arc label */}
            <div className="inline-flex items-center gap-1.5 bg-[var(--psp-gold)]/10 border border-[var(--psp-gold)]/30 rounded-full px-3 py-1 mb-3">
              <span className="text-[var(--psp-gold)] text-xs font-semibold tracking-wide uppercase">
                Career Arc
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-6xl font-['Bebas_Neue'] text-white leading-none mb-2">
              {profile.display_name}
            </h1>

            {/* Era summary */}
            {profile.era_summary && (
              <p className="text-[var(--psp-gold)] text-lg font-semibold mb-1">
                {profile.era_summary}
              </p>
            )}

            {/* Lifespan */}
            {(profile.birth_year || profile.death_year) && (
              <p className="text-white/50 text-sm mb-3">
                {profile.birth_year ?? "?"}
                {profile.death_year ? ` – ${profile.death_year}` : ""}
              </p>
            )}

            {/* Family ribbon chips */}
            {family.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {family.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/legacy/${f.slug}`}
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-[var(--psp-gold)]/20 border border-white/20 hover:border-[var(--psp-gold)]/50 rounded-full px-3 py-1 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <span className="text-white/50 text-xs">
                      {RELATION_LABEL[f.relation] ?? f.relation}
                    </span>
                    <span className="font-semibold">{f.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
