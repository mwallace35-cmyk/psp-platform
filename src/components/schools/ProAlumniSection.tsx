import Link from "next/link";
import { getProAthletesBySchool } from "@/lib/data";
import { createProAthleteSlug } from "@/lib/slug-utils";

interface ProAlumniSectionProps {
  schoolId: number;
  schoolName: string;
}

const leagueColors: Record<string, string> = {
  NFL: "#003da5",
  NBA: "#c4122e",
  MLB: "#002d72",
  WNBA: "#552583",
};

const sportEmojis: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  soccer: "⚽",
  lacrosse: "🥍",
};

export async function ProAlumniSection({
  schoolId,
  schoolName,
}: ProAlumniSectionProps) {
  const proAthletes = await getProAthletesBySchool(schoolId);

  if (proAthletes.length === 0) {
    return null;
  }

  // Group by league
  const byLeague: Record<string, typeof proAthletes> = {};
  proAthletes.forEach((athlete) => {
    const league = athlete.pro_league || "Other";
    if (!byLeague[league]) byLeague[league] = [];
    byLeague[league].push(athlete);
  });

  // Sort leagues by priority (NFL, NBA, MLB, WNBA)
  const leagueOrder = ["NFL", "NBA", "MLB", "WNBA"];
  const sortedLeagues = Object.keys(byLeague).sort(
    (a, b) => leagueOrder.indexOf(a) - leagueOrder.indexOf(b)
  );

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-head">
        🏆 Pro Alumni ({proAthletes.length})
      </div>
      <div className="card-body">
        {sortedLeagues.map((league) => {
          const athletes = byLeague[league];
          const leagueColor = leagueColors[league] || "#0a1628";
          const leagueEmoji = league === "NFL" ? "🏈" :
                             league === "NBA" ? "🏀" :
                             league === "MLB" ? "⚾" :
                             league === "WNBA" ? "🏀" : "🏆";

          return (
            <div key={league} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "inline-block",
                  background: leagueColor,
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {leagueEmoji} {league} ({athletes.length})
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 12,
                }}
              >
                {athletes.map((athlete) => {
                  const athleteSlug = createProAthleteSlug(
                    athlete.person_name,
                    athlete.id
                  );
                  const sportEmoji =
                    sportEmojis[athlete.sport_id?.toLowerCase() || ""] || "🏆";

                  return (
                    <Link
                      key={athlete.id}
                      href={`/next-level/${athleteSlug}`}
                      style={{
                        padding: "10px 12px",
                        background: "var(--g50)",
                        borderRadius: 4,
                        textDecoration: "none",
                        transition: ".15s",
                        display: "block",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "var(--g100)";
                        (e.currentTarget as HTMLElement).style.transform =
                          "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "var(--g50)";
                        (e.currentTarget as HTMLElement).style.transform =
                          "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--text)",
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={athlete.person_name}
                      >
                        {athlete.person_name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--g400)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={athlete.pro_team || "N/A"}
                      >
                        {athlete.pro_team || "N/A"}
                      </div>
                      {athlete.draft_info && (
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--g500)",
                            marginTop: 2,
                            fontStyle: "italic",
                          }}
                        >
                          {athlete.draft_info}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
