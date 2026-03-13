"use client";

import { useState } from "react";

interface MatchupData {
  classification: string;
  team1: string;
  team1Record: string;
  team1Seed: string;
  team2: string;
  team2Record: string;
  team2Seed: string;
  time: string;
  location: string;
  highlight: string;
}

const QUARTERFINAL_MATCHUPS: MatchupData[] = [
  {
    classification: "6A",
    team1: "Imhotep Charter",
    team1Record: "21-6",
    team1Seed: "D12-1",
    team2: "Parkland",
    team2Record: "24-6",
    team2Seed: "D11-1",
    time: "Sat 3/14, 2:30 PM",
    location: "Pottstown HS",
    highlight: "Coach Noble chasing 11th PIAA title — first-ever in 6A",
  },
  {
    classification: "6A",
    team1: "Father Judge",
    team1Record: "15-11",
    team1Seed: "D12-2",
    team2: "Plymouth Whitemarsh",
    team2Record: "23-5",
    team2Seed: "D1-1",
    time: "Sat 3/14",
    location: "TBD",
    highlight: "Defending state champs seeking back-to-back titles",
  },
  {
    classification: "5A",
    team1: "Neumann-Goretti",
    team1Record: "20-5",
    team1Seed: "D12-1",
    team2: "Upper Moreland",
    team2Record: "19-9",
    team2Seed: "D1-5",
    time: "Fri 3/13, 7:00 PM",
    location: "Bensalem HS",
    highlight: "Defending 5A champs — semifinal rematch from last year",
  },
  {
    classification: "5A",
    team1: "Bonner-Prendergast",
    team1Record: "18-6",
    team1Seed: "D12-3",
    team2: "Springfield (Delco)",
    team2Record: "20-8",
    team2Seed: "D1-4",
    time: "Fri 3/13, 6:00 PM",
    location: "Cardinal O'Hara",
    highlight: "PCL MVP Korey Francis leads a high-major backcourt",
  },
  {
    classification: "4A",
    team1: "Devon Prep",
    team1Record: "16-12",
    team1Seed: "D12-4",
    team2: "Scranton Prep",
    team2Record: "22-5",
    team2Seed: "D2-1",
    time: "Fri 3/13, 7:30 PM",
    location: "Liberty HS",
    highlight: "Johnnie Doogan has 20+ in every state playoff game",
  },
  {
    classification: "4A",
    team1: "Engineering & Science",
    team1Record: "17-9",
    team1Seed: "D12-5",
    team2: "North Catholic",
    team2Record: "20-6",
    team2Seed: "D7-3",
    time: "Fri 3/13, 5:00 PM",
    location: "McConnellsburg",
    highlight: "Fareed Brown & Matt McField both dropped 20 in Round 2",
  },
  {
    classification: "3A",
    team1: "West Catholic",
    team1Record: "12-12",
    team1Seed: "D12-1",
    team2: "Riverside",
    team2Record: "22-5",
    team2Seed: "D2-1",
    time: "Sat 3/14",
    location: "TBD",
    highlight: "Defending 3A state champs — Kingston Wheatley headed to FGCU",
  },
  {
    classification: "2A",
    team1: "Paul Robeson",
    team1Record: "11-13",
    team1Seed: "D12-2",
    team2: "United",
    team2Record: "19-7",
    team2Seed: "D5-3",
    time: "Sat 3/14",
    location: "TBD",
    highlight: "First-ever state quarterfinal appearance for Robeson",
  },
  {
    classification: "1A",
    team1: "Sankofa Freedom",
    team1Record: "20-4",
    team1Seed: "D12-1",
    team2: "York Country Day",
    team2Record: "19-5",
    team2Seed: "D3-2",
    time: "Fri 3/13, 6:00 PM",
    location: "Coatesville",
    highlight: "All-time leading scorer Nafis DuBose chasing Hershey return",
  },
];

export default function PlayoffPreview() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "0 auto 2rem",
        padding: "0 1.5rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1a2744 100%)",
          borderRadius: "12px",
          border: "1px solid rgba(240, 165, 0, 0.3)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(90deg, #f0a500 0%, #e09000 100%)",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🏀</span>
            <div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.4rem",
                  color: "#0a1628",
                  margin: 0,
                  letterSpacing: "0.5px",
                }}
              >
                PIAA State Playoffs — Quarterfinals
              </h2>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#0a1628",
                  opacity: 0.8,
                  fontWeight: 600,
                }}
              >
                March 13–14, 2026 &bull; Road to Hershey
              </span>
            </div>
          </div>
          <span
            style={{
              background: "#0a1628",
              color: "#f0a500",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.3rem 0.6rem",
              borderRadius: "4px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Live Preview
          </span>
        </div>

        {/* Preview Article */}
        <div style={{ padding: "1.5rem", color: "#e2e8f0" }}>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              margin: "0 0 1rem",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Nine Philadelphia-area boys basketball teams are still standing as
            the PIAA state tournament hits the quarterfinal round this weekend —
            and the city&apos;s fingerprints are all over every classification
            from 1A to 6A.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              margin: "0 0 1rem",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            The headliner is a potential collision course in{" "}
            <strong style={{ color: "#f0a500" }}>Class 6A</strong>, where{" "}
            <strong>Imhotep Charter</strong> (21-6) and defending state champion{" "}
            <strong>Father Judge</strong> (15-11) both advanced to the quarters
            and could meet again in the semis — just like last year, when Judge
            ended Imhotep&apos;s run. Coach Andre Noble, already a 10-time PIAA
            champion, is chasing history: a title in 6A would make him the only
            coach ever to win a state championship in five different
            classifications. Imhotep&apos;s 6-8 junior{" "}
            <strong>Zaahir Muhammad-Gray</strong> has been a matchup nightmare in
            the bracket, while Judge leans on a trio of D-I seniors led by
            Temple-bound guard <strong>Derrick Morton-Rivera</strong>.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              margin: "0 0 1rem",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            In <strong style={{ color: "#f0a500" }}>5A</strong>, defending
            champion <strong>Neumann-Goretti</strong> (20-5) draws Upper
            Moreland in a semifinal rematch tonight at Bensalem. Senior{" "}
            <strong>Kody Colson</strong> poured in 20 in their second-round win,
            though the Saints will be without injured guard Stephon
            Ashley-Wright. Down the road at O&apos;Hara,{" "}
            <strong>Bonner-Prendergast</strong> (18-6) and PCL MVP{" "}
            <strong>Korey Francis</strong> — a high-major recruit drawing Power 4
            interest — face neighborhood rival Springfield in what figures to be
            a packed, hostile gym.
          </p>

          {expanded && (
            <>
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  margin: "0 0 1rem",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                The smaller classifications are stacked with Philly grit.{" "}
                <strong style={{ color: "#f0a500" }}>West Catholic</strong>{" "}
                (12-12) enters as defending 3A state champs with a deceptive
                record — they play a murderous Catholic League schedule and own
                wins over D1 6A champ Plymouth Whitemarsh and Archbishop Wood
                this season. FGCU-bound 6-7 forward{" "}
                <strong>Kingston Wheatley</strong> and a pair of talented
                sophomores in <strong>Rocky Johnson</strong> and{" "}
                <strong>Jayden Ortiz-Muhammad</strong> make them dangerous.
                In 4A, <strong>Devon Prep&apos;s</strong> junior{" "}
                <strong>Johnnie Doogan</strong> has been unconscious in the
                playoffs with 20+ in every game, while{" "}
                <strong>Engineering & Science</strong> rides the tandem of{" "}
                <strong>Fareed Brown</strong> and{" "}
                <strong>Matt McField</strong>, who both dropped 20 in their
                Round 2 win over Dallas.
              </p>
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  margin: "0 0 1rem",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                Keep an eye on <strong>Paul Robeson</strong> in 2A — making
                their first-ever state quarterfinal appearance — and{" "}
                <strong>Sankofa Freedom</strong> in 1A, where all-time leading
                scorer <strong>Nafis DuBose</strong> is looking to punch another
                ticket to Hershey after a dominant 67-36 quarterfinal win over
                York Country Day last season. The state finals tip off March
                19-21 at Giant Center.
              </p>
            </>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none",
              border: "1px solid rgba(240, 165, 0, 0.4)",
              color: "#f0a500",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(240, 165, 0, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            {expanded ? "Show Less" : "Read Full Preview →"}
          </button>

          {/* Matchup Cards */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1.25rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                color: "#f0a500",
                margin: "0 0 0.75rem",
                letterSpacing: "0.5px",
              }}
            >
              Philly-Area Quarterfinal Matchups
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {QUARTERFINAL_MATCHUPS.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        background: "#f0a500",
                        color: "#0a1628",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.4rem",
                        borderRadius: "3px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {m.classification}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#94a3b8",
                      }}
                    >
                      {m.time}
                    </span>
                  </div>
                  <div style={{ marginBottom: "0.35rem" }}>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.9rem",
                      }}
                    >
                      {m.team1}
                    </span>
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.8rem",
                        marginLeft: "0.4rem",
                      }}
                    >
                      ({m.team1Record})
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#64748b",
                      margin: "0.15rem 0",
                      fontWeight: 600,
                      letterSpacing: "1px",
                    }}
                  >
                    VS
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.9rem",
                      }}
                    >
                      {m.team2}
                    </span>
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.8rem",
                        marginLeft: "0.4rem",
                      }}
                    >
                      ({m.team2Record})
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#cbd5e1",
                      fontStyle: "italic",
                      lineHeight: 1.4,
                    }}
                  >
                    {m.highlight}
                  </div>
                  {m.location !== "TBD" && (
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#64748b",
                        marginTop: "0.35rem",
                      }}
                    >
                      📍 {m.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.75rem",
              color: "#64748b",
            }}
          >
            <span>State Finals: March 19-21 at Giant Center, Hershey</span>
            <span>Updated March 13, 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
