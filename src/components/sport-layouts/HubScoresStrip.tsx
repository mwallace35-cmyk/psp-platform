"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { getSchoolShortDisplayName } from "@/lib/utils/schoolDisplayName";
import SchoolLogo from "@/components/ui/SchoolLogo";

export interface HubGame {
  id: number;
  home_score: number | null;
  away_score: number | null;
  game_date: string | null;
  game_type: string | null;
  playoff_round: string | null;
  notes?: string | null;
  home_school: { id: number; name: string; slug: string; league?: string; city?: string | null; league_id?: number | null; logo_url?: string | null; piaa_class?: string | null } | null;
  away_school: { id: number; name: string; slug: string; league?: string; city?: string | null; league_id?: number | null; logo_url?: string | null; piaa_class?: string | null } | null;
  seasons: { label: string } | null;
}

/**
 * Build the most descriptive game label possible from available fields.
 * Priority: notes (most specific) > constructed from game_type + playoff_round + classification.
 * Returns null for regular-season games (unless notes contain playoff context).
 * Labels are UPPERCASE, max ~15 chars (truncated with ellipsis).
 */
function getGameLabel(game: Pick<HubGame, 'game_type' | 'playoff_round' | 'notes' | 'home_school' | 'away_school'>): string | null {
  const gt = (game.game_type ?? '').toLowerCase();
  const pr = (game.playoff_round ?? '').toLowerCase();
  const notes = (game.notes ?? '').trim();

  // Derive classification from either team (home first)
  const cls = game.home_school?.piaa_class ?? game.away_school?.piaa_class ?? '';

  // For regular-season games, only surface notes that look like playoff context
  if (gt === 'regular' || gt === '') {
    if (notes && notes.length <= 40 && /final|semi|quarter|playoff|champ|title|round|state|district|piaa|pcl/i.test(notes)) {
      return truncLabel(notes.toUpperCase());
    }
    return null;
  }

  // 1) If notes already contain rich context (e.g. "PIAA 6A Final"), prefer that
  if (notes && notes.length <= 30 && /final|semi|quarter|playoff|champ|round|state|district|piaa|pcl/i.test(notes)) {
    return truncLabel(notes.toUpperCase());
  }

  // 2) Construct label from parts: [classification] [round or game_type]
  // Map common playoff_round values to short display forms
  const roundMap: Record<string, string> = {
    final: 'FINAL',
    finals: 'FINAL',
    championship: 'FINAL',
    semifinal: 'SEMIFINAL',
    'semi-final': 'SEMIFINAL',
    semis: 'SEMIFINAL',
    quarterfinal: 'QUARTERFINAL',
    'quarter-final': 'QUARTERFINAL',
    quarters: 'QUARTERFINAL',
    round1: 'R1',
    'round 1': 'R1',
    round2: 'R2',
    'round 2': 'R2',
    round3: 'R3',
    'round 3': 'R3',
  };

  const typeMap: Record<string, string> = {
    playoff: 'PLAYOFF',
    playoffs: 'PLAYOFF',
    championship: 'FINAL',
    district: 'DISTRICT',
    state: 'STATE',
  };

  let roundLabel = roundMap[pr] ?? (pr ? pr.toUpperCase() : '');
  const typeLabel = typeMap[gt] ?? gt.toUpperCase();

  // If we have a round, check if game_type adds "PIAA" or "DISTRICT" prefix
  let prefix = '';
  if (gt === 'state' || gt === 'piaa') prefix = 'PIAA';
  else if (gt === 'district') prefix = 'DISTRICT';
  else if (gt === 'league' || gt === 'pcl') prefix = 'PCL';

  // Build the label
  const parts: string[] = [];
  if (prefix) parts.push(prefix);
  if (cls) parts.push(cls.toUpperCase());
  if (roundLabel) {
    parts.push(roundLabel);
  } else {
    parts.push(typeLabel);
  }

  // If no prefix and no classification, just use the round/type alone
  // e.g. "6A FINAL", "PIAA 4A R1", "PCL QUARTERFINAL", "PLAYOFF"
  const label = parts.join(' ');
  return truncLabel(label || gt.toUpperCase());
}

/** Truncate label to ~15 chars with ellipsis */
function truncLabel(s: string): string {
  if (s.length <= 15) return s;
  return s.slice(0, 14) + '\u2026';
}

/** Extract opponent name from notes field when school is null */
function getOpponentFromNotes(notes: string | null | undefined): string | null {
  if (!notes) return null;
  const oppMatch = notes.match(/^Opponent:\s*(.+?)(?:\s*\(.*\))?\s*$/i);
  if (oppMatch) return oppMatch[1].trim();
  if (notes.length < 60 && !notes.includes('.')) return notes.trim();
  return null;
}

interface HubScoresStripProps {
  games: HubGame[];
  sportColor: string;
  sport: string;
}

/**
 * Horizontal scrolling score banner for sport hub pages.
 * Shows recent game results with team names and scores.
 * Handles null school names gracefully (shows "TBD" instead of "Home"/"Away").
 * Detects rivalry games, upsets, and marks first game as "Game of the Week".
 */
export default function HubScoresStrip({ games, sportColor, sport }: HubScoresStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  }, [checkScroll]);

  const isRivalryGame = (game: HubGame): boolean => {
    if (game.game_type === "rivalry") return true;

    // Check if teams are from different leagues (Catholic vs Public)
    const homeLeague = game.home_school?.league;
    const awayLeague = game.away_school?.league;

    if (homeLeague && awayLeague && homeLeague !== awayLeague) {
      return true;
    }

    return false;
  };

  const isUpset = (game: HubGame): boolean => {
    if (game.home_score === null || game.away_score === null) return false;
    // Upset when away team wins
    return game.away_score > game.home_score;
  };

  if (!games || games.length === 0) return null;

  return (
    <div className="hub-scores-strip">
      {canScrollLeft && (
        <button
          className="hub-scores-nav hub-scores-nav-left"
          onClick={() => scroll("left")}
          aria-label="Scroll scores left"
        >
          ‹
        </button>
      )}

      <div
        className="hub-scores-inner"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {games.map((game, index) => {
          const homeName = game.home_school ? getSchoolShortDisplayName(game.home_school) : (getOpponentFromNotes(game.notes) || "Opponent");
          const awayName = game.away_school ? getSchoolShortDisplayName(game.away_school) : (getOpponentFromNotes(game.notes) || "Opponent");
          const homeScore = game.home_score ?? 0;
          const awayScore = game.away_score ?? 0;
          const homeWon = homeScore > awayScore;
          const awayWon = awayScore > homeScore;
          const isRivalry = isRivalryGame(game);
          const isUpsettingWin = isUpset(game);
          const isFirstGame = index === 0;
          const contextLabel = getGameLabel(game);
          const borderColor = contextLabel ? "#D4A843" : isRivalry ? "#D4A843" : sportColor;

          return (
            <Link
              key={game.id}
              href={`/${sport}/games/${game.id}`}
              className="hub-score-chip"
              style={{
                borderLeftColor: borderColor,
                borderLeftWidth: "4px",
                borderLeftStyle: "solid",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {contextLabel ? (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#D4A843",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "120px",
                  }}
                  title={contextLabel}
                >
                  {contextLabel}
                </div>
              ) : isFirstGame ? (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#D4A843",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  GAME OF THE WEEK
                </div>
              ) : null}
              <div className={`hsc-team${homeWon ? " hsc-w" : ""}`}>
                <SchoolLogo
                  logoUrl={game.home_school?.logo_url}
                  name={homeName}
                  size="sm"
                  className="hsc-logo"
                />
                <span className="hsc-name" title={homeName}>{homeName}</span>
                <span className="hsc-score" style={homeWon ? { color: sportColor } : undefined}>
                  {homeScore}
                </span>
              </div>
              <div className={`hsc-team${awayWon ? " hsc-w" : ""}`}>
                <SchoolLogo
                  logoUrl={game.away_school?.logo_url}
                  name={awayName}
                  size="sm"
                  className="hsc-logo"
                />
                <span className="hsc-name" title={awayName}>{awayName}</span>
                <span className="hsc-score" style={awayWon ? { color: sportColor } : undefined}>
                  {awayScore}
                </span>
              </div>
              {isUpsettingWin && (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    marginTop: "4px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                  }}
                >
                  UPSET
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          className="hub-scores-nav hub-scores-nav-right"
          onClick={() => scroll("right")}
          aria-label="Scroll scores right"
        >
          ›
        </button>
      )}
    </div>
  );
}
