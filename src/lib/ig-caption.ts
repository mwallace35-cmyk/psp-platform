/**
 * Centralized Instagram caption builders.
 *
 * Keeps tone + hashtags consistent across every page type that offers
 * Instagram sharing. The tone is direct and Philly-rooted — short sentences,
 * no corporate fluff. Hashtags are minimal but searchable.
 */

const BASE_HASHTAGS = "#PhillyHSSports #PSP #PhillySportsPack";

const SPORT_HASHTAG: Record<string, string> = {
  football: "#PhillyFootball",
  basketball: "#PhillyHoops",
  "girls-basketball": "#PhillyHoops",
  baseball: "#PhillyBaseball",
  soccer: "#PhillySoccer",
  lacrosse: "#PhillyLax",
  "track-field": "#PhillyTrack",
  wrestling: "#PhillyWrestling",
};

function sportTag(sport?: string): string {
  if (!sport) return "";
  return SPORT_HASHTAG[sport] ?? "";
}

function stitch(parts: Array<string | undefined>): string {
  return parts.filter((p) => p && p.trim().length > 0).join(" ");
}

export interface PlayerCaptionInput {
  name: string;
  school?: string;
  sport?: string;
  headline?: string; // e.g. "2,847 career rush yards"
  url: string;
}

export function buildPlayerCaption(p: PlayerCaptionInput): string {
  const lede = p.school
    ? `${p.name} — ${p.school}.`
    : `${p.name}.`;
  const stat = p.headline ? `${p.headline}.` : "";
  const tags = stitch([BASE_HASHTAGS, sportTag(p.sport)]);
  return `${lede} ${stat}\n\n${p.url}\n\n${tags}`.trim();
}

export interface GameCaptionInput {
  home: string;
  away: string;
  homeScore?: number | null;
  awayScore?: number | null;
  sport?: string;
  date?: string;
  url: string;
}

export function buildGameCaption(g: GameCaptionInput): string {
  const hasScore = g.homeScore != null && g.awayScore != null;
  const matchup = hasScore
    ? `${g.away} ${g.awayScore} — ${g.home} ${g.homeScore}`
    : `${g.away} vs ${g.home}`;
  const dateLine = g.date ? ` (${g.date})` : "";
  const lede = `${matchup}${dateLine}.`;
  const tags = stitch([BASE_HASHTAGS, sportTag(g.sport)]);
  return `${lede}\n\nFull box score: ${g.url}\n\n${tags}`.trim();
}

export interface LeaderboardCaptionInput {
  sport: string;
  statLabel: string; // e.g. "Career Rushing Yards"
  isCareer: boolean;
  url: string;
}

export function buildLeaderboardCaption(
  l: LeaderboardCaptionInput,
): string {
  const scope = l.isCareer ? "All-Time Career" : "Season";
  const lede = `${scope} ${l.statLabel} Leaders — Philly HS ${l.sport.replace("-", " ")}.`;
  const tags = stitch([BASE_HASHTAGS, sportTag(l.sport)]);
  return `${lede}\n\n${l.url}\n\n${tags}`.trim();
}

export interface LegendCaptionInput {
  name: string;
  role?: string;
  schools?: string[];
  record?: string; // e.g. "412-147"
  sport?: string;
  url: string;
}

export function buildLegendCaption(l: LegendCaptionInput): string {
  const schoolLine = l.schools && l.schools.length > 0 ? ` — ${l.schools[0]}` : "";
  const roleLine = l.role ? `${l.role}${schoolLine}.` : "";
  const recordLine = l.record ? ` Career record: ${l.record}.` : "";
  const lede = `PSP Legend: ${l.name}. ${roleLine}${recordLine}`.trim();
  const tags = stitch([BASE_HASHTAGS, "#PSPLegends", sportTag(l.sport)]);
  return `${lede}\n\n${l.url}\n\n${tags}`.trim();
}
