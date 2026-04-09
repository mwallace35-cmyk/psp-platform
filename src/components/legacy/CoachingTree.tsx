import Link from "next/link";
import type { CoachingTree as CoachingTreeData } from "@/lib/data/legacy";

interface Props {
  tree: CoachingTreeData;
}

const RELATION_LABEL: Record<string, string> = {
  father_of: "Father of",
  son_of: "Son of",
  brother_of: "Brother of",
  coached_by: "Coached by",
  coach_of: "Coach of",
  mentored_by: "Mentored by",
  mentor_of: "Mentor of",
  alumnus: "Alumni",
};

function PersonChip({
  name,
  slug,
  relation,
  hasLegacyPage,
  legacySlug,
}: {
  name: string;
  slug: string;
  relation: string;
  hasLegacyPage: boolean;
  legacySlug?: string;
}) {
  const label = RELATION_LABEL[relation] ?? relation;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const inner = (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-[var(--psp-gold)]/50 hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-full bg-[var(--psp-navy)] flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-[var(--psp-gold)]">{initials}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="font-semibold text-[var(--psp-navy)] text-sm truncate">{name}</p>
      </div>
      {hasLegacyPage && (
        <span className="ml-auto text-[var(--psp-gold)] text-xs font-semibold whitespace-nowrap">
          Career Arc →
        </span>
      )}
    </div>
  );

  if (hasLegacyPage && legacySlug) {
    return <Link href={`/legacy/${legacySlug}`}>{inner}</Link>;
  }
  return <div>{inner}</div>;
}

function Column({
  title,
  people,
  emptyText,
}: {
  title: string;
  people: CoachingTreeData["family"];
  emptyText: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">{title}</h3>
      {people.length === 0 ? (
        <p className="text-gray-400 text-sm italic">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {people.map((p) => (
            <PersonChip key={`${p.slug}-${p.relation}`} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoachingTree({ tree }: Props) {
  const hasAny =
    tree.mentors.length > 0 || tree.proteges.length > 0 || tree.family.length > 0;

  if (!hasAny) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-['Bebas_Neue'] text-[var(--psp-navy)] mb-6">Coaching Tree & Family</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Coached By" people={tree.mentors} emptyText="No mentors recorded." />
        <Column title="Family" people={tree.family} emptyText="No family connections recorded." />
        <Column
          title="Coached / Notable Alumni"
          people={tree.proteges.slice(0, 12)}
          emptyText="No proteges recorded."
        />
      </div>
    </section>
  );
}
