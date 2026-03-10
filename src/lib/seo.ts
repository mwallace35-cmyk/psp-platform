import type { Metadata } from "next";
import { SPORT_META } from "@/lib/data";
import type { SportId } from "@/lib/sports";

export type PageType =
  | "homepage"
  | "sport-hub"
  | "school-profile"
  | "player-career"
  | "leaderboard"
  | "championships"
  | "records"
  | "coach"
  | "search"
  | "compare"
  | "articles"
  | "article-detail"
  | "potw"
  | "events";

interface SEOParams {
  pageType: PageType;
  sport?: SportId;
  slug?: string;
  title?: string;
  description?: string;
  schoolName?: string;
  playerName?: string;
  coachName?: string;
  query?: string;
  count?: number;
}

const SITE_NAME = "PhillySportsPack.com";
const SITE_URL = "https://phillysportspack.com";

export function generatePageMetadata(params: SEOParams): Metadata {
  let title = SITE_NAME;
  let description =
    "Philadelphia high school sports data — football, basketball, baseball, and more.";
  let url = SITE_URL;
  let ogImage = `${SITE_URL}/og-default.png`;

  const sportName = params.sport ? SPORT_META[params.sport]?.name : null;

  switch (params.pageType) {
    case "homepage":
      title = `PhillySportsPack.com`;
      description =
        "Complete Philadelphia high school sports database covering football, basketball, baseball, soccer, lacrosse, track & field, wrestling. Stats, records, championships, and player profiles.";
      url = SITE_URL;
      break;

    case "sport-hub":
      if (sportName && params.sport) {
        title = `${sportName} | ${SITE_NAME}`;
        description = `Philadelphia high school ${sportName.toLowerCase()} — stats, leaderboards, school records, and championships.`;
        url = `${SITE_URL}/${params.sport}`;
        ogImage = `${SITE_URL}/og-${params.sport}.png`;
      }
      break;

    case "school-profile":
      if (params.schoolName && params.sport && sportName) {
        title = `${params.schoolName} ${sportName} | ${SITE_NAME}`;
        description = `${params.schoolName} ${sportName} history, records, championships, and player profiles.`;
        url = `${SITE_URL}/${params.sport}/schools/${params.slug}`;
        ogImage = `${SITE_URL}/og-schools/${params.slug}.png`;
      }
      break;

    case "player-career":
      if (params.playerName && params.sport && sportName) {
        title = `${params.playerName} | ${sportName} | ${SITE_NAME}`;
        description = `${params.playerName} career statistics and profile for Philadelphia high school ${sportName.toLowerCase()}.`;
        url = `${SITE_URL}/${params.sport}/players/${params.slug}`;
        ogImage = `${SITE_URL}/og-players/${params.slug}.png`;
      }
      break;

    case "coach":
      if (params.coachName && params.sport && sportName) {
        title = `${params.coachName} | ${sportName} Coach | ${SITE_NAME}`;
        description = `${params.coachName} coaching record and timeline in Philadelphia high school ${sportName.toLowerCase()}.`;
        url = `${SITE_URL}/${params.sport}/coaches/${params.slug}`;
      }
      break;

    case "leaderboard":
      if (params.sport && sportName && params.slug) {
        const statName = params.slug.replace(/-/g, " ");
        title = `${statName} Leaders | ${sportName} | ${SITE_NAME}`;
        description = `Top Philadelphia high school ${sportName.toLowerCase()} players by ${statName}.`;
        url = `${SITE_URL}/${params.sport}/leaderboards/${params.slug}`;
      }
      break;

    case "records":
      if (params.sport && sportName) {
        title = `Records | ${sportName} | ${SITE_NAME}`;
        description = `Philadelphia high school ${sportName.toLowerCase()} records and achievements.`;
        url = `${SITE_URL}/${params.sport}/records`;
      }
      break;

    case "championships":
      if (params.sport && sportName) {
        title = `Championships | ${sportName} | ${SITE_NAME}`;
        description = `Philadelphia high school ${sportName.toLowerCase()} championship history and title holders.`;
        url = `${SITE_URL}/${params.sport}/championships`;
      }
      break;

    case "search":
      if (params.query && params.count !== undefined) {
        title = `Search: "${params.query}" | ${SITE_NAME}`;
        description = `${params.count} results for "${params.query}"`;
        url = `${SITE_URL}/search?q=${encodeURIComponent(params.query)}`;
      }
      break;

    case "compare":
      if (params.sport && sportName) {
        title = `Player Comparison | ${sportName} | ${SITE_NAME}`;
        description = `Compare Philadelphia high school ${sportName.toLowerCase()} players side-by-side.`;
        url = `${SITE_URL}/compare?sport=${params.sport}`;
      }
      break;

    case "articles":
      title = `Articles | ${SITE_NAME}`;
      description = "Read news and articles about Philadelphia high school sports.";
      url = `${SITE_URL}/articles`;
      break;

    case "article-detail":
      if (params.title) {
        title = `${params.title} | ${SITE_NAME}`;
        description = params.description || "Read the latest Philadelphia high school sports news.";
        url = `${SITE_URL}/articles/${params.slug}`;
      }
      break;

    case "potw":
      title = `Player of the Week | ${SITE_NAME}`;
      description =
        "Vote for Philadelphia high school Player of the Week. See current nominees and past winners.";
      url = `${SITE_URL}/potw`;
      break;

    case "events":
      title = `The Pulse | ${SITE_NAME}`;
      description =
        "The Pulse — upcoming Philadelphia high school sports events, camps, and showcases.";
      url = `${SITE_URL}/pulse`;
      break;
  }

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  } as const;
}

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
