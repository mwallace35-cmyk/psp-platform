"use client";

import { useState } from "react";
import LayoutToggle from "./LayoutToggle";
import type { LayoutType } from "./LayoutToggle";
import SportLayoutA from "./SportLayoutA";
import SportLayoutB from "./SportLayoutB";
import type { Championship, School } from "@/lib/data/types";
import type { HubGame } from "./HubScoresStrip";

interface FeaturedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
}

interface DataFreshness {
  lastUpdated?: string;
  source?: string;
  lastVerified?: string;
}

interface TeamWithRecords {
  id: number;
  wins: number;
  losses: number;
  ties?: number;
  schools?: { name: string; slug: string } | null;
  seasons?: { label: string } | null;
}

interface TrackedAlumni {
  id: number;
  person_name: string;
  current_level: string;
  current_org: string;
  current_role?: string;
  college?: string;
  pro_team?: string;
  pro_league?: string;
  sport_id: string;
  bio_note?: string;
  schools?: { name: string; slug: string } | null;
}

interface SportLayoutSwitcherProps {
  sport: string;
  sportColor: string;
  meta: { name: string; emoji: string; color: string; statCategories: string[] };
  overview: { players: number; schools: number; seasons: number; championships: number };
  champions: Championship[];
  schools: Array<{ name: string; slug: string; city?: string; state?: string; id?: number }>;
  featured: FeaturedArticle[];
  freshness: DataFreshness | null;
  recentGames: HubGame[];
  standings: TeamWithRecords[];
  trackedAlumni: TrackedAlumni[];
}

const DEFAULT_LAYOUTS: Record<string, LayoutType> = {
  football: "editorial",
  basketball: "editorial",
  baseball: "editorial",
  "track-field": "editorial",
  lacrosse: "editorial",
  wrestling: "editorial",
  soccer: "editorial",
};

export default function SportLayoutSwitcher(props: SportLayoutSwitcherProps) {
  const [layout, setLayout] = useState<LayoutType>(DEFAULT_LAYOUTS[props.sport] || "editorial");

  return (
    <>
      <LayoutToggle
        sport={props.sport}
        sportColor={props.sportColor}
        onLayoutChange={setLayout}
        defaultLayout={DEFAULT_LAYOUTS[props.sport] || "editorial"}
      />
      {layout === "editorial" && <SportLayoutA {...props} />}
      {layout === "dashboard" && <SportLayoutB {...props} />}
    </>
  );
}
