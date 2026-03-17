import { getWidgetConfig, getWidgetData, incrementWidgetViews } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/widgets/[embedKey]
 * Returns embeddable widget HTML
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ embedKey: string }> }
) {
  try {
    const { embedKey } = await params;

    const config = await getWidgetConfig(embedKey);

    if (!config) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    incrementWidgetViews(config.id).catch(console.error);

    // Get widget data
    const widgetData = await getWidgetData(config);

    // Render widget HTML
    const html = renderWidget(widgetData, config);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300", // 5 min cache
      },
    });
  } catch (error) {
    console.error("Widget API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Render widget HTML based on type
 */
function renderWidget(
  data: any,
  config: any
): string {
  const containerStyle = `
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #333;
    max-width: 100%;
  `;

  const baseStyle = `
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    color: #333;
  `;

  const headerStyle = `
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #0a1628;
  `;

  const tableStyle = `
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  `;

  const rowStyle = (even: boolean) => `
    padding: 8px;
    border-bottom: 1px solid #ddd;
    background: ${even ? "white" : "#f8f9fa"};
  `;

  switch (config.widget_type) {
    case "schedule":
    case "scores":
      const games = data.content.games || [];
      return `
        <div style="${containerStyle}">
          <div style="${baseStyle}">
            <div style="${headerStyle}">
              ${config.widget_type === "schedule" ? "Upcoming Games" : "Recent Scores"}
            </div>
            <table style="${tableStyle}">
              ${games
                .map(
                  (game: any, idx: number) => `
                <tr>
                  <td style="${rowStyle(idx % 2 === 0)}">
                    <strong>${game.home_school?.name || "Home"}</strong><br/>
                    vs ${game.away_school?.name || "Away"}<br/>
                    <small style="color: #666;">${new Date(game.game_date).toLocaleDateString()}</small>
                  </td>
                  <td style="${rowStyle(idx % 2 === 0)}; text-align: right; width: 80px;">
                    ${
                      game.home_score !== null
                        ? `${game.home_score} - ${game.away_score}`
                        : "TBA"
                    }
                  </td>
                </tr>
              `
                )
                .join("")}
            </table>
          </div>
          <div style="padding: 8px; text-align: center; font-size: 12px; color: #999;">
            Powered by <strong>PhillySportsPack</strong>
          </div>
        </div>
      `;

    case "record":
      const { wins, losses, ties } = data.content;
      return `
        <div style="${containerStyle}">
          <div style="${baseStyle}">
            <div style="${headerStyle}">Current Record</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
              <div style="padding: 12px; background: white; border-radius: 4px;">
                <div style="font-size: 24px; font-weight: bold; color: #0a1628;">${wins}</div>
                <div style="font-size: 12px; color: #666;">Wins</div>
              </div>
              <div style="padding: 12px; background: white; border-radius: 4px;">
                <div style="font-size: 24px; font-weight: bold; color: #0a1628;">${losses}</div>
                <div style="font-size: 12px; color: #666;">Losses</div>
              </div>
              <div style="padding: 12px; background: white; border-radius: 4px;">
                <div style="font-size: 24px; font-weight: bold; color: #0a1628;">${ties}</div>
                <div style="font-size: 12px; color: #666;">Ties</div>
              </div>
            </div>
          </div>
          <div style="padding: 8px; text-align: center; font-size: 12px; color: #999;">
            Powered by <strong>PhillySportsPack</strong>
          </div>
        </div>
      `;

    case "roster":
      const roster = data.content.roster || [];
      return `
        <div style="${containerStyle}">
          <div style="${baseStyle}">
            <div style="${headerStyle}">Team Roster</div>
            <table style="${tableStyle}">
              ${roster
                .map(
                  (player: any, idx: number) => `
                <tr>
                  <td style="${rowStyle(idx % 2 === 0)}">
                    <strong>${player.players?.name || "Unknown"}</strong><br/>
                    <small style="color: #666;">#${player.jersey_number} • ${player.position}</small>
                  </td>
                </tr>
              `
                )
                .join("")}
            </table>
          </div>
          <div style="padding: 8px; text-align: center; font-size: 12px; color: #999;">
            Powered by <strong>PhillySportsPack</strong>
          </div>
        </div>
      `;

    default:
      return `
        <div style="${containerStyle}">
          <div style="${baseStyle}">
            <div style="${headerStyle}">PhillySportsPack Widget</div>
            <p>Widget type: ${config.widget_type}</p>
          </div>
        </div>
      `;
  }
}

/**
 * CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
