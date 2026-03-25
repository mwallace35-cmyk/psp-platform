import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HofBadge from "./HofBadge";

interface PlayerHofBadgesProps {
  playerId: number;
}

interface HofBadgeRow {
  hof_inductee_id: number;
  organization_id: number;
  display_on_profile: boolean;
  hof_inductees: {
    id: number;
    name: string;
    induction_year: number;
    induction_class: string | null;
    sport: string | null;
    achievements: string | null;
  };
  hof_organizations: {
    id: number;
    slug: string;
    badge_label: string | null;
    badge_color_primary: string | null;
    badge_color_secondary: string | null;
    badge_icon: string | null;
    subpage_url: string | null;
  };
}

/**
 * Async server component that renders HOF badges on a player profile sidebar.
 * Queries player_hof_badges joined with hof_inductees and hof_organizations.
 * Only renders if the player has HOF badges with display_on_profile = true.
 */
export default async function PlayerHofBadges({ playerId }: PlayerHofBadgesProps) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("player_hof_badges")
    .select(`
      hof_inductee_id,
      organization_id,
      display_on_profile,
      hof_inductees!inner (
        id,
        name,
        induction_year,
        induction_class,
        sport,
        achievements
      ),
      hof_organizations!inner (
        id,
        slug,
        badge_label,
        badge_color_primary,
        badge_color_secondary,
        badge_icon,
        subpage_url
      )
    `)
    .eq("player_id", playerId)
    .eq("display_on_profile", true);

  if (error || !data || data.length === 0) {
    return null;
  }

  const badges = data as unknown as HofBadgeRow[];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2
        className="font-bold text-xs uppercase tracking-wider mb-4"
        style={{ color: "var(--psp-gray-400)" }}
      >
        Hall of Fame
      </h2>
      <div className="space-y-4">
        {badges.map((badge) => {
          const org = badge.hof_organizations;
          const inductee = badge.hof_inductees;

          // Link to the HOF page filtered by induction year, or fallback to the org subpage
          const hofHref = org.subpage_url
            ? `${org.subpage_url}?year=${inductee.induction_year}`
            : `/hof`;

          return (
            <Link
              key={`${badge.organization_id}-${badge.hof_inductee_id}`}
              href={hofHref}
              className="block group"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50">
                <HofBadge
                  label={org.badge_label || "HOF"}
                  colorPrimary={org.badge_color_primary || "#f0a500"}
                  colorSecondary={org.badge_color_secondary || "#0a1628"}
                  icon={org.badge_icon || "star"}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mt-0.5">
                    Class of {inductee.induction_year}
                  </p>
                  {inductee.sport && (
                    <p className="text-xs text-gray-400 capitalize">{inductee.sport}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
