import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSchoolBySlug } from "@/lib/data/schools";
import { getTeamRoster, getRosterSeasons, groupRosterByPosition } from "@/lib/data/rosters";
import { SPORT_META } from "@/lib/data";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import Breadcrumb from "@/components/ui/Breadcrumb";

type PageParams = { sport: string; slug: string };

interface RosterPageProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ season?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: RosterPageProps): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const { slug } = await params;
  const { season } = await searchParams;
  const school = await getSchoolBySlug(slug);

  if (!school) {
    return { title: "Roster Not Found" };
  }

  const seasonLabel = season || "Current";
  return {
    title: `${school.name} ${seasonLabel} Roster | ${SPORT_META[sport].name} | PhillySportsPack`,
    description: `${school.name} ${SPORT_META[sport].name} roster for the ${seasonLabel} season.`,
  };
}

export const revalidate = 3600; // 1 hour

export function generateStaticParams() {
  return [
    { sport: "football" },
    { sport: "basketball" },
    { sport: "baseball" },
    { sport: "track-field" },
    { sport: "lacrosse" },
    { sport: "wrestling" },
    { sport: "soccer" },
  ];
}

export default async function RosterPage({
  params,
  searchParams,
}: RosterPageProps) {
  const sport = await validateSportParam(params);
  const { slug } = await params;
  const { season: seasonParam } = await searchParams;

  // Get school
  const school = await getSchoolBySlug(slug);
  if (!school) {
    notFound();
  }

  // Get available roster seasons
  const seasons = await getRosterSeasons(school.id, sport);
  if (seasons.length === 0) {
    return (
      <main id="main-content" className="flex-1">
        <Breadcrumb
          items={[
            { label: SPORT_META[sport].name, href: `/${sport}` },
            { label: school.name, href: `/${sport}/schools/${school.slug}` },
            { label: "Roster", href: "#" },
          ]}
        />
        <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontFamily: "var(--font-bebas)",
              marginBottom: "1rem",
            }}
          >
            Roster Not Available
          </h1>
          <p style={{ color: "#999", marginBottom: "2rem" }}>
            No roster data available for {school.name}.
          </p>
          <Link
            href={`/${sport}/schools/${school.slug}`}
            style={{
              color: "var(--psp-gold)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to School Profile
          </Link>
        </div>
      </main>
    );
  }

  // Get selected season or latest
  const selectedSeason =
    seasons.find((s) => s.label === seasonParam) ||
    seasons.find((s) => s.hasRoster) ||
    seasons[0];

  if (!selectedSeason || !selectedSeason.hasRoster) {
    return (
      <main id="main-content" className="flex-1">
        <Breadcrumb
          items={[
            { label: SPORT_META[sport].name, href: `/${sport}` },
            { label: school.name, href: `/${sport}/schools/${school.slug}` },
            { label: "Roster", href: "#" },
          ]}
        />
        <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontFamily: "var(--font-bebas)",
              marginBottom: "1rem",
            }}
          >
            Roster Not Available
          </h1>
          <p style={{ color: "#999", marginBottom: "2rem" }}>
            No roster data for this season.
          </p>
          <Link
            href={`/${sport}/schools/${school.slug}`}
            style={{
              color: "var(--psp-gold)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to School Profile
          </Link>
        </div>
      </main>
    );
  }

  // Fetch roster
  const roster = await getTeamRoster(
    school.id,
    sport,
    selectedSeason.season_id
  );

  const grouped = groupRosterByPosition(roster);
  const positions = Object.keys(grouped).sort();

  return (
    <main id="main-content" className="flex-1">
      <Breadcrumb
        items={[
          { label: SPORT_META[sport].name, href: `/${sport}` },
          { label: school.name, href: `/${sport}/schools/${school.slug}` },
          { label: `${selectedSeason.label} Roster`, href: "#" },
        ]}
      />

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "2rem 1rem",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.2rem",
            fontFamily: "var(--font-bebas)",
            marginBottom: "0.5rem",
          }}
        >
          {school.name} Roster
        </h1>
        <p style={{ color: "#ccc", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
          {SPORT_META[sport].name} • {selectedSeason.label}
        </p>

        {/* Season Selector */}
        {seasons.filter((s) => s.hasRoster).length > 1 && (
          <div>
            <label
              style={{
                color: "#999",
                fontSize: "0.9rem",
                marginRight: "1rem",
                fontWeight: 600,
              }}
            >
              Season:
            </label>
            <select
              defaultValue={selectedSeason.label}
              onChange={(e) => {
                window.location.href = `/${sport}/teams/${school.slug}/roster?season=${e.target.value}`;
              }}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "1px solid #333",
                background: "#0a1628",
                color: "#ccc",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              {seasons
                .filter((s) => s.hasRoster)
                .map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Roster Content */}
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {roster.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              background: "#1a1a1a",
              borderRadius: "8px",
            }}
          >
            <p style={{ color: "#999", fontSize: "1.1rem" }}>
              No roster data available for this season.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem", marginBottom: "2rem" }}>
            {positions.map((position) => (
              <div
                key={position}
                style={{
                  background: "#1a1a1a",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #333",
                }}
              >
                {/* Position Header */}
                <div
                  style={{
                    background: "rgba(240, 165, 0, 0.1)",
                    borderBottom: "2px solid var(--psp-gold)",
                    padding: "1rem",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.2rem",
                      fontFamily: "var(--font-bebas)",
                      color: "var(--psp-gold)",
                      margin: 0,
                    }}
                  >
                    {position}
                  </h2>
                </div>

                {/* Position Roster */}
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid #333" }}>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#999",
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#999",
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Player
                      </th>
                      {/* Only show if any player has height/weight */}
                      {grouped[position].some((p) => p.height || p.weight) && (
                        <>
                          <th
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "center",
                              fontWeight: 600,
                              color: "#999",
                              fontSize: "0.85rem",
                              textTransform: "uppercase",
                            }}
                          >
                            Ht/Wt
                          </th>
                        </>
                      )}
                      {grouped[position].some((p) => p.class) && (
                        <th
                          style={{
                            padding: "0.75rem 1rem",
                            textAlign: "center",
                            fontWeight: 600,
                            color: "#999",
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                          }}
                        >
                          Class
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[position].map((player) => (
                      <tr
                        key={player.id}
                        style={{ borderBottom: "1px solid #222" }}
                      >
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--psp-gold)",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            minWidth: "50px",
                          }}
                        >
                          {player.jersey_number || "—"}
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          {player.players ? (
                            <Link
                              href={`/${sport}/players/${player.players.slug}`}
                              style={{
                                color: "#ccc",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.color =
                                  "var(--psp-gold)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.color =
                                  "#ccc";
                              }}
                            >
                              {player.players.name}
                            </Link>
                          ) : (
                            <span style={{ color: "#999" }}>Unknown</span>
                          )}
                        </td>
                        {grouped[position].some((p) => p.height || p.weight) && (
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "center",
                              color: "#999",
                              fontSize: "0.9rem",
                            }}
                          >
                            {player.height && player.weight
                              ? `${player.height} / ${player.weight}`
                              : player.height
                                ? player.height
                                : player.weight
                                  ? player.weight
                                  : "—"}
                          </td>
                        )}
                        {grouped[position].some((p) => p.class) && (
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "center",
                              color: "#999",
                              fontSize: "0.9rem",
                            }}
                          >
                            {player.class || "—"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: "2rem" }}>
          <Link
            href={`/${sport}/schools/${school.slug}`}
            style={{
              color: "var(--psp-gold)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to School Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
