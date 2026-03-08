"use client";

import { useState } from "react";
import LayoutToggle from "./LayoutToggle";
import type { LayoutType } from "./LayoutToggle";
import SportLayoutA from "./SportLayoutA";
import SportLayoutB from "./SportLayoutB";
import SportLayoutC from "./SportLayoutC";
import type { Championship, School } from "@/lib/data/types";

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

interface SportLayoutSwitcherProps {
  sport: string;
  sportColor: string;
  meta: { name: string; emoji: string; color: string; statCategories: string[] };
  overview: { players: number; schools: number; seasons: number; championships: number };
  champions: Championship[];
  schools: Array<{ name: string; slug: string; city?: string; state?: string; id?: number }>;
  featured: FeaturedArticle[];
  freshness: DataFreshness | null;
}

const DEFAULT_LAYOUTS: Record<string, LayoutType> = {
  football: "editorial",
  basketball: "editorial",
  baseball: "dashboard",
  "track-field": "dashboard",
  lacrosse: "league",
  wrestling: "dashboard",
  soccer: "league",
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
      {layout === "league" && <SportLayoutC {...props} />}
    </>
  );
}
