import type { Metadata } from "next";
import { SPORT_META, type SportId } from "@/lib/data";

export type PageType =
  | "homepage"
  | "sport-hub"
  | "school-profile"
  | "player-career"
  | "leaderboard"
  | "career-leaders"
  | "championships"
  | "records"
  | "coach"
  | "search"
  | "compare"
  | "compare-schools"
  | "articles"
  | "article-detail"
  | "potw"
  | "events"
  | "glossary"
  | "community"
  | "scores";

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
  // Dynamic OG image via /api/og route
  let ogTitle = "PhillySportsPack";
  let ogSubtitle = "Philadelphia High School Sports Database";
  let ogSport = "";
  let ogStat = "";
  let ogType = "default";

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
        ogTitle = sportName;
        ogSubtitle = `Philadelphia High School ${sportName}`;
        ogSport = params.sport;
      }
      break;

    case "school-profile":
      if (params.schoolName && params.sport && sportName) {
        title = `${params.schoolName} ${sportName} | ${SITE_NAME}`;
        description = `${params.schoolName} ${sportName} history, records, championships, and player profiles.`;
        url = `${SITE_URL}/schools/${params.slug}`;
        ogTitle = params.schoolName;
        ogSubtitle = `${sportName} Program Profile`;
        ogSport = params.sport;
        ogType = "school";
      }
      break;

    case "player-career":
      if (params.playerName && params.sport && sportName) {
        title = `${params.playerName} | ${sportName} | ${SITE_NAME}`;
        description = `${params.playerName} career statistics and profile for Philadelphia high school ${sportName.toLowerCase()}.`;
        url = `${SITE_URL}/${params.sport}/players/${params.slug}`;
        ogTitle = params.playerName;
        ogSubtitle = `${sportName} Career Stats`;
        ogSport = params.sport;
        ogType = "player";
      }
      break;

    case "coach":
      if (params.coachName && params.sport && sportName) {
        title = `${params.coachName} | ${sportName} Coach | ${SITE_NAME}`;
        description = `${params.coachName} coaching record and timeline in Philadelphia high school ${sportName.toLowerCase()}.`;
        url = `${SITE_URL}/${params.sport}/coaches/${params.slug}`;
        ogTitle = params.coachName;
        ogSubtitle = `${sportName} Coaching Profile`;
        ogSport = params.sport;
      }
      break;

    case "leaderboard":
      if (params.sport && sportName && params.slug) {
        const statName = params.slug.replace(/-/g, " ");
        title = `${statName} Leaders | ${sportName} | ${SITE_NAME}`;
        description = `Top Philadelphia high school ${sportName.toLowerCase()} players by ${statName}.`;
        url = `${SITE_URL}/${params.sport}/leaderboards/${params.slug}`;
        ogTitle = `${statName.charAt(0).toUpperCase() + statName.slice(1)} Leaders`;
        ogSubtitle = `${sportName} Season Leaderboard`;
        ogSport = params.sport;
        ogType = "leaderboard";
      }
      break;

    case "career-leaders":
      if (params.sport && sportName && params.slug) {
        const careerStatName = params.slug.replace(/-/g, " ");
        title = `Career ${careerStatName} Leaders | ${sportName} | ${SITE_NAME}`;
        description = `All-time career ${careerStatName} leaders in Philadelphia high school ${sportName.toLowerCase()}.`;
        url = `${SITE_URL}/${params.sport}/career-leaders/${params.slug}`;
        ogTitle = `Career ${careerStatName.charAt(0).toUpperCase() + careerStatName.slice(1)} Leaders`;
        ogSubtitle = `${sportName} All-Time Career Leaders`;
        ogSport = params.sport;
        ogType = "career";
      }
      break;

    case "records":
      if (params.sport && sportName) {
        title = `Records | ${sportName} | ${SITE_NAME}`;
        description = `Philadelphia high school ${sportName.toLowerCase()} records and achievements.`;
        url = `${SITE_URL}/${params.sport}/records`;
        ogTitle = `${sportName} Records`;
        ogSubtitle = "All-Time Records & Achievements";
        ogSport = params.sport;
      }
      break;

    case "championships":
      if (params.sport && sportName) {
        title = `Championships | ${sportName} | ${SITE_NAME}`;
        description = `Philadelphia high school ${sportName.toLowerCase()} championship history and title holders.`;
        url = `${SITE_URL}/${params.sport}/championships`;
        ogTitle = `${sportName} Championships`;
        ogSubtitle = "Championship History & Title Holders";
        ogSport = params.sport;
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
        ogTitle = "Player Comparison";
        ogSubtitle = `${sportName} Side-by-Side Stats`;
        ogSport = params.sport;
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
        ogTitle = params.title;
        ogSubtitle = params.description || "Philadelphia High School Sports";
        if (params.sport) ogSport = params.sport;
      }
      break;

    case "potw":
      title = `Player of the Week | ${SITE_NAME}`;
      description =
        "Vote for Philadelphia high school Player of the Week. See current nominees and past winners.";
      url = `${SITE_URL}/potw`;
      break;

    case "events":
      title = `Events | ${SITE_NAME}`;
      description =
        "Upcoming Philadelphia high school sports events, camps, and showcases.";
      url = `${SITE_URL}/events`;
      ogTitle = "Events";
      ogSubtitle = "Camps, Showcases & Upcoming Events";
      break;

    case "compare-schools":
      title = `Compare Schools | ${SITE_NAME}`;
      description = "Compare Philadelphia high school athletic programs side-by-side — records, championships, and head-to-head matchups.";
      url = `${SITE_URL}/compare-schools`;
      ogTitle = "Compare Schools";
      ogSubtitle = "Head-to-Head Athletic Program Comparison";
      break;

    case "glossary":
      title = `Stats Glossary | ${SITE_NAME}`;
      description = "Definitions for all statistical abbreviations used across PhillySportsPack.com.";
      url = `${SITE_URL}/glossary`;
      ogTitle = "Stats Glossary";
      ogSubtitle = "Statistical Abbreviations & Definitions";
      break;

    case "community":
      title = `Community | ${SITE_NAME}`;
      description = "Join the PhillySportsPack community — vote for POTW, submit corrections, and connect with Philly HS sports fans.";
      url = `${SITE_URL}/community`;
      ogTitle = "Community";
      ogSubtitle = "Join the Philly HS Sports Community";
      break;

    case "scores":
      title = `Scores | ${SITE_NAME}`;
      description = "Latest Philadelphia high school sports scores and game results.";
      url = `${SITE_URL}/scores`;
      ogTitle = "Scores";
      ogSubtitle = "Latest Game Results";
      break;
  }

  // Build dynamic OG image URL
  const ogParams = new URLSearchParams();
  ogParams.set("title", ogTitle);
  ogParams.set("subtitle", ogSubtitle);
  if (ogSport) ogParams.set("sport", ogSport);
  if (ogStat) ogParams.set("stat", ogStat);
  if (ogType !== "default") ogParams.set("type", ogType);
  const ogImage = `${SITE_URL}/api/og?${ogParams.toString()}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
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
