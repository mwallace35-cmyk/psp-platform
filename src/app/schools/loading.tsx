export default function Loading() {
  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .loading-skeleton {
          background: linear-gradient(135deg, #0a1628 0%, #0f2040 100%);
          height: 120px;
          animation: pulse 2s infinite;
        }
        .loading-card {
          background: #f3f4f6;
          borderRadius: 8px;
          animation: pulse 2s infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="loading-skeleton py-8" />

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {/* League Headers */}
        {[...Array(3)].map((_, leagueIdx) => (
          <div key={leagueIdx} style={{ marginBottom: "48px" }}>
            {/* League Title */}
            <div
              className="loading-card"
              style={{ height: 24, width: "40%", marginBottom: "24px" }}
            />

            {/* School Grid Skeleton */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {[...Array(6)].map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="loading-card"
                  style={{
                    height: 120,
                    padding: "16px",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
