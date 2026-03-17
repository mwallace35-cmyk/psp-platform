import { NextRequest, NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/static";

/**
 * POST /api/recruiting/feed
 *
 * Parse recruiting news RSS feeds and create recruiting_updates entries.
 *
 * Body:
 * {
 *   "source": "on3" | "247",
 *   "feedUrl": "https://..."
 * }
 *
 * Returns:
 * {
 *   "processed": number,
 *   "matched": number,
 *   "created": number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check - require API key
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.RECRUITER_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { source, feedUrl } = await request.json();

    if (!source || !feedUrl) {
      return NextResponse.json(
        { error: "Missing required fields: source, feedUrl" },
        { status: 400 }
      );
    }

    if (!["on3", "247"].includes(source)) {
      return NextResponse.json(
        { error: "Invalid source. Must be 'on3' or '247'" },
        { status: 400 }
      );
    }

    // Fetch RSS feed
    let feedData;
    try {
      const feedResponse = await fetch(feedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!feedResponse.ok) {
        return NextResponse.json(
          { error: `Failed to fetch feed: ${feedResponse.statusText}` },
          { status: 400 }
        );
      }

      feedData = await feedResponse.text();
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to fetch RSS feed: ${String(error)}` },
        { status: 400 }
      );
    }

    // Parse XML (simple regex-based parser for common RSS formats)
    const entries = parseRSSFeed(feedData);

    // Process each entry
    let processed = 0;
    let matched = 0;
    let created = 0;

    const supabase = await createStaticClient();

    for (const entry of entries) {
      processed++;

      // Extract player names from title and description
      const playerNames = extractPlayerNames(
        `${entry.title} ${entry.description}`
      );

      if (playerNames.length === 0) continue;

      // For each player name, try to find a match in the database
      for (const playerName of playerNames) {
        // Fuzzy match against players table
        const { data: players } = await supabase
          .from("players")
          .select("id, name")
          .ilike("name", `%${playerName}%`)
          .limit(1);

        if (players && players.length > 0) {
          matched++;
          const player = players[0];

          // Create recruiting_update record
          try {
            await supabase.from("recruiting_updates").insert({
              player_id: player.id,
              source,
              headline: entry.title,
              content: entry.description,
              link: entry.link,
              published_at: entry.pubDate || new Date().toISOString(),
              status: "pending_review",
            });
            created++;
          } catch (insertError) {
            // Log error but continue processing other players
            console.error(
              `[Recruiter Feed] Failed to insert update for ${playerName}:`,
              insertError
            );
          }
        }
      }
    }

    return NextResponse.json({
      processed,
      matched,
      created,
    });
  } catch (error) {
    console.error("[Recruiter Feed] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Simple RSS feed parser
 */
function parseRSSFeed(
  xmlContent: string
): Array<{
  title: string;
  description: string;
  link: string;
  pubDate?: string;
}> {
  const entries = [];

  // Match <item> tags
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xmlContent))) {
    const itemXml = itemMatch[1];

    // Extract title
    const titleMatch = /<title[^>]*>(.*?)<\/title>/i.exec(itemXml);
    const title = titleMatch ? stripHtml(titleMatch[1]) : "";

    // Extract description
    const descMatch = /<description[^>]*>([\s\S]*?)<\/description>/i.exec(itemXml);
    const description = descMatch ? stripHtml(descMatch[1]) : "";

    // Extract link
    const linkMatch = /<link[^>]*>(.*?)<\/link>/i.exec(itemXml);
    const link = linkMatch ? linkMatch[1].trim() : "";

    // Extract pubDate
    const pubDateMatch = /<pubDate[^>]*>(.*?)<\/pubDate>/i.exec(itemXml);
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : undefined;

    if (title || description) {
      entries.push({
        title,
        description,
        link,
        pubDate,
      });
    }
  }

  return entries;
}

/**
 * Extract player names from text using simple patterns
 * Looks for common recruiting announcement patterns
 */
function extractPlayerNames(text: string): string[] {
  const names: Set<string> = new Set();

  // Pattern 1: "Player Name commits/commits to..."
  const commitPattern = /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(commits?|commits?|signed?|signs?|decommits?)/gi;
  let match;
  while ((match = commitPattern.exec(text))) {
    const name = match[1].trim();
    if (name.length > 3 && name.split(" ").length === 2) {
      names.add(name);
    }
  }

  // Pattern 2: "4-star QB John Smith" style
  const starPattern = /\d-star\s+\w+\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g;
  while ((match = starPattern.exec(text))) {
    const name = match[1].trim();
    if (name.length > 3) {
      names.add(name);
    }
  }

  // Pattern 3: "Player Name" in quotes
  const quotePattern = /"([A-Z][a-z]+\s+[A-Z][a-z]+)"/g;
  while ((match = quotePattern.exec(text))) {
    const name = match[1].trim();
    if (name.length > 3 && name.split(" ").length === 2) {
      names.add(name);
    }
  }

  return Array.from(names);
}

/**
 * Simple HTML tag stripper
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}
