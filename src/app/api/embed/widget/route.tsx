import { NextRequest, NextResponse } from "next/server";

const NAVY = "#0a1628";
const GOLD = "#f0a500";
const LIGHT_BG = "#f5f5f5";
const DARK_TEXT = "#1f2937";
const LIGHT_TEXT = "#f3f4f6";

interface LeaderboardRow {
  rank: number;
  value: number | null;
  player: { name: string; slug: string } | null;
  school: { name: string; slug: string } | null;
  season: { label: string } | null;
  stat: string;
}

interface SchoolData {
  id: number;
  name: string;
  slug: string;
  city: string;
  mascot: string | null;
  logoUrl: string | null;
  record: { wins: number; losses: number; ties: number } | null;
  championships: number;
  sport: string | null;
}

interface PlayerData {
  id: number;
  name: string;
  slug: string;
  school: { name: string; slug: string } | null;
  stats: any[] | null;
  sport: string | null;
}

interface StatCardData {
  schools: number;
  players: number;
  championships: number;
}

async function getEmbedData(url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://phillysportspack.com";
  const response = await fetch(`${baseUrl}/api/embed?${url.split("?")[1]}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Embed API error: ${response.statusText}`);
  }

  return response.json();
}

function renderLeaderboard(data: {
  type: string;
  stat: string;
  sport: string;
  data: LeaderboardRow[];
}, theme: string) {
  const isDark = theme === "dark";
  const bg = isDark ? NAVY : LIGHT_BG;
  const text = isDark ? LIGHT_TEXT : DARK_TEXT;
  const headerBg = isDark ? "#1a2332" : "white";
  const borderColor = isDark ? "#374151" : "#e5e7eb";

  const statLabel = data.stat.charAt(0).toUpperCase() + data.stat.slice(1);

  return `
    <div style="
      background: ${bg};
      color: ${text};
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      padding: 20px;
      border-radius: 8px;
      width: 100%;
      max-width: 100%;
    ">
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">
          ${statLabel} Leaders
        </h3>
        <p style="margin: 0; font-size: 12px; color: ${GOLD}; text-transform: uppercase;">
          ${data.sport}
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="border-bottom: 2px solid ${GOLD};">
            <th style="text-align: left; padding: 8px 0; font-weight: 600; color: ${GOLD};">Rank</th>
            <th style="text-align: left; padding: 8px 8px; font-weight: 600; color: ${GOLD};">Player</th>
            <th style="text-align: left; padding: 8px 8px; font-weight: 600; color: ${GOLD};">School</th>
            <th style="text-align: right; padding: 8px 0; font-weight: 600; color: ${GOLD};">${statLabel}</th>
          </tr>
        </thead>
        <tbody>
          ${data.data
            .map(
              (row) => `
            <tr style="border-bottom: 1px solid ${borderColor};">
              <td style="padding: 10px 0; font-weight: 600;">${row.rank}</td>
              <td style="padding: 10px 8px;">${row.player?.name || "N/A"}</td>
              <td style="padding: 10px 8px; font-size: 12px;">${row.school?.name || "N/A"}</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 600; color: ${GOLD};">
                ${row.value?.toFixed(1) || "—"}
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div style="
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid ${borderColor};
        text-align: center;
        font-size: 11px;
      ">
        <a href="https://phillysportspack.com" style="
          color: ${GOLD};
          text-decoration: none;
          font-weight: 600;
        ">
          Powered by PhillySportsPack.com
        </a>
      </div>
    </div>
  `;
}

function renderSchool(data: { type: string; data: SchoolData }, theme: string) {
  const isDark = theme === "dark";
  const bg = isDark ? NAVY : LIGHT_BG;
  const text = isDark ? LIGHT_TEXT : DARK_TEXT;
  const headerBg = isDark ? "#1a2332" : "white";

  const record = data.data.record
    ? `${data.data.record.wins}-${data.data.record.losses}${data.data.record.ties ? "-" + data.data.record.ties : ""}`
    : "N/A";

  return `
    <div style="
      background: ${bg};
      color: ${text};
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      padding: 20px;
      border-radius: 8px;
      width: 100%;
      max-width: 100%;
    ">
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        ${
          data.data.logoUrl
            ? `<img src="${data.data.logoUrl}" alt="${data.data.name}" style="
              width: 48px;
              height: 48px;
              border-radius: 4px;
              object-fit: cover;
            " />`
            : `<div style="
              width: 48px;
              height: 48px;
              background: ${GOLD};
              border-radius: 4px;
            "></div>`
        }
        <div style="flex: 1;">
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">
            ${data.data.name}
          </h3>
          <p style="margin: 0; font-size: 12px; color: ${GOLD};">
            ${data.data.city}${data.data.mascot ? " • " + data.data.mascot : ""}
          </p>
        </div>
      </div>

      <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="
          background: ${isDark ? "#1a2332" : "white"};
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        ">
          <p style="margin: 0; font-size: 11px; color: ${isDark ? "#9ca3af" : "#6b7280"}; text-transform: uppercase;">
            Record
          </p>
          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: ${GOLD};">
            ${record}
          </p>
        </div>
        <div style="
          background: ${isDark ? "#1a2332" : "white"};
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        ">
          <p style="margin: 0; font-size: 11px; color: ${isDark ? "#9ca3af" : "#6b7280"}; text-transform: uppercase;">
            Championships
          </p>
          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: ${GOLD};">
            ${data.data.championships}
          </p>
        </div>
      </div>

      <div style="
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid ${isDark ? "#374151" : "#e5e7eb"};
        text-align: center;
        font-size: 11px;
      ">
        <a href="https://phillysportspack.com" style="
          color: ${GOLD};
          text-decoration: none;
          font-weight: 600;
        ">
          Powered by PhillySportsPack.com
        </a>
      </div>
    </div>
  `;
}

function renderPlayer(data: { type: string; data: PlayerData }, theme: string) {
  const isDark = theme === "dark";
  const bg = isDark ? NAVY : LIGHT_BG;
  const text = isDark ? LIGHT_TEXT : DARK_TEXT;

  return `
    <div style="
      background: ${bg};
      color: ${text};
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      padding: 20px;
      border-radius: 8px;
      width: 100%;
      max-width: 100%;
    ">
      <div>
        <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">
          ${data.data.name}
        </h3>
        <p style="margin: 0; font-size: 12px; color: ${GOLD};">
          ${data.data.school?.name || "School Unknown"}
        </p>
      </div>

      ${
        data.data.stats && data.data.stats.length > 0
          ? `
        <div style="margin-top: 16px;">
          <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${GOLD};">
            Recent Stats
          </p>
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            ${data.data.stats
              .slice(0, 3)
              .map(
                (stat) => `
              <tr style="border-bottom: 1px solid ${isDark ? "#374151" : "#e5e7eb"};">
                <td style="padding: 8px 0;">
                  <span style="font-weight: 600;">${stat.season_label || "N/A"}</span>
                </td>
                <td style="padding: 8px 0; text-align: right; color: ${GOLD};">
                  Stats available
                </td>
              </tr>
            `
              )
              .join("")}
          </table>
        </div>
      `
          : ""
      }

      <div style="
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid ${isDark ? "#374151" : "#e5e7eb"};
        text-align: center;
        font-size: 11px;
      ">
        <a href="https://phillysportspack.com" style="
          color: ${GOLD};
          text-decoration: none;
          font-weight: 600;
        ">
          Powered by PhillySportsPack.com
        </a>
      </div>
    </div>
  `;
}

function renderStatCard(data: { type: string; data: StatCardData }, theme: string) {
  const isDark = theme === "dark";
  const bg = isDark ? NAVY : LIGHT_BG;
  const text = isDark ? LIGHT_TEXT : DARK_TEXT;
  const cardBg = isDark ? "#1a2332" : "white";

  return `
    <div style="
      background: ${bg};
      color: ${text};
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      padding: 20px;
      border-radius: 8px;
      width: 100%;
      max-width: 100%;
    ">
      <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; text-align: center;">
        PhillySportsPack.com
      </h3>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
        <div style="
          background: ${cardBg};
          padding: 16px;
          border-radius: 6px;
          border-left: 3px solid ${GOLD};
          text-align: center;
        ">
          <p style="margin: 0; font-size: 11px; color: ${isDark ? "#9ca3af" : "#6b7280"}; text-transform: uppercase;">
            Schools
          </p>
          <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: ${GOLD};">
            ${data.data.schools}
          </p>
        </div>
        <div style="
          background: ${cardBg};
          padding: 16px;
          border-radius: 6px;
          border-left: 3px solid ${GOLD};
          text-align: center;
        ">
          <p style="margin: 0; font-size: 11px; color: ${isDark ? "#9ca3af" : "#6b7280"}; text-transform: uppercase;">
            Players
          </p>
          <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: ${GOLD};">
            ${data.data.players}
          </p>
        </div>
        <div style="
          background: ${cardBg};
          padding: 16px;
          border-radius: 6px;
          border-left: 3px solid ${GOLD};
          text-align: center;
        ">
          <p style="margin: 0; font-size: 11px; color: ${isDark ? "#9ca3af" : "#6b7280"}; text-transform: uppercase;">
            Championships
          </p>
          <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: ${GOLD};">
            ${data.data.championships}
          </p>
        </div>
      </div>

      <div style="
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid ${isDark ? "#374151" : "#e5e7eb"};
        text-align: center;
        font-size: 11px;
      ">
        <a href="https://phillysportspack.com" style="
          color: ${GOLD};
          text-decoration: none;
          font-weight: 600;
        ">
          Learn More
        </a>
      </div>
    </div>
  `;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const theme = (searchParams.get("theme") || "dark") as "dark" | "light";
    const type = searchParams.get("type");

    if (!type) {
      return new NextResponse("<p>Error: Missing type parameter</p>", {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    let embedData;
    try {
      embedData = await getEmbedData(request.nextUrl.toString());
    } catch (error) {
      return new NextResponse("<p>Error: Could not fetch embed data</p>", {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    let html = "";

    if (embedData.type === "leaderboard") {
      html = renderLeaderboard(embedData, theme);
    } else if (embedData.type === "school") {
      html = renderSchool(embedData, theme);
    } else if (embedData.type === "player") {
      html = renderPlayer(embedData, theme);
    } else if (embedData.type === "stat-card") {
      html = renderStatCard(embedData, theme);
    }

    const isDark = theme === "dark";
    const bgColor = isDark ? NAVY : "#ffffff";
    const textColor = isDark ? LIGHT_TEXT : DARK_TEXT;

    const document = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PhillySportsPack Embed</title>
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            background: ${bgColor};
            color: ${textColor};
            font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    return new NextResponse(document, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("[embed/widget/route] Error:", error);
    return new NextResponse("<p>Error: Failed to render widget</p>", {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
