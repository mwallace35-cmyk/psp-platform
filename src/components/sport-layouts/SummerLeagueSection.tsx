'use client';

import Link from "next/link";
import { useMemo } from "react";

const summerPrograms = [
  {
    id: 1,
    name: "Narberth League",
    ageGroup: "14-18 years",
    description: "Premier summer baseball league in Philadelphia area",
    link: "#"
  },
  {
    id: 2,
    name: "Connie Mack World Series",
    ageGroup: "16-18 years",
    description: "National summer championship tournament",
    link: "#"
  },
  {
    id: 3,
    name: "American Legion Baseball",
    ageGroup: "15-18 years",
    description: "Competitive regional league",
    link: "#"
  },
  {
    id: 4,
    name: "Babe Ruth Summer League",
    ageGroup: "12-14 years",
    description: "Developmental summer program",
    link: "#"
  },
];

export default function SummerLeagueSection() {
  const isActiveSeason = useMemo(() => {
    const month = new Date().getMonth();
    return month >= 5 && month <= 7; // June, July, August (months 5, 6, 7)
  }, []);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        borderBottom: "1px solid var(--g100)",
        paddingBottom: 12
      }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          color: "var(--psp-navy)",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <span>Summer League</span>
          <span style={{ fontSize: 14, color: "var(--g400)" }}>/</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#B8860B" }}>Liga de Verano</span>
        </h2>
        {isActiveSeason && (
          <div style={{
            display: "inline-block",
            padding: "4px 10px",
            background: "#DC2626",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5
          }}>
            Active Season
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{
        fontSize: 14,
        lineHeight: 1.6,
        color: "var(--g500)",
        marginBottom: 24,
        maxWidth: 800
      }}>
        Philadelphia's premier summer baseball programs provide competitive opportunities for players during the off-season. These leagues feature top talent from the region and serve as crucial development platforms before college and professional careers.
      </p>

      {/* Programs Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
        marginBottom: 20
      }}>
        {summerPrograms.map((program) => (
          <Link
            key={program.id}
            href={program.link}
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div style={{
              background: "var(--psp-white)",
              border: "1px solid var(--g100)",
              borderRadius: 8,
              padding: 16,
              transition: "all 0.2s ease",
              cursor: "pointer",
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = "#B8860B";
              el.style.boxShadow = "0 4px 12px rgba(184, 134, 11, 0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = "var(--g100)";
              el.style.boxShadow = "none";
            }}>

              {/* Program Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                marginBottom: 10
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#B8860B",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span style={{ fontSize: 14 }} aria-hidden="true">⚾</span>
                  {program.ageGroup}
                </div>
              </div>

              {/* Program Name */}
              <h3 style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--psp-navy)",
                margin: "0 0 8px 0",
                lineHeight: 1.4
              }}>
                {program.name}
              </h3>

              {/* Program Description */}
              <p style={{
                fontSize: 13,
                color: "var(--g500)",
                margin: "0 0 12px 0",
                lineHeight: 1.5,
                flex: 1
              }}>
                {program.description}
              </p>

              {/* Learn More Link */}
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#B8860B",
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: "auto"
              }}>
                Learn more <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Season Info */}
      <div style={{
        background: "#FEF9E7",
        border: "1px solid #F4E4A1",
        borderRadius: 6,
        padding: 12,
        fontSize: 13,
        color: "var(--psp-navy)",
        display: "flex",
        alignItems: "flex-start",
        gap: 10
      }}>
        <span style={{ fontSize: 16, marginTop: 2 }} aria-hidden="true">📅</span>
        <div>
          <strong>Season:</strong> June – August. Programs run concurrently with regular season high school preparation and offer competitive play for development and recruitment visibility.
        </div>
      </div>
    </div>
  );
}
