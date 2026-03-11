export default function ProAthleteLoading() {
  return (
    <div className="espn-container" style={{ flex: 1 }}>
      <main>
        {/* Breadcrumb Skeleton */}
        <div style={{ height: 24, background: "var(--g100)", borderRadius: 4, marginBottom: 20, width: "30%" }} />

        {/* Hero Section Skeleton */}
        <div
          className="sport-header"
          style={{
            borderColor: "var(--g100)",
            animation: "pulse 1.5s infinite",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, background: "var(--g100)", borderRadius: 4 }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  width: "70%",
                  height: 32,
                  background: "var(--g100)",
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  width: "20%",
                  height: 20,
                  background: "var(--g100)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              padding: "12px 0",
              borderTop: "1px solid var(--g100)",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div
                  style={{
                    width: "40%",
                    height: 12,
                    background: "var(--g100)",
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    width: "80%",
                    height: 20,
                    background: "var(--g100)",
                    borderRadius: 4,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Share Buttons Skeleton */}
        <div style={{ display: "flex", gap: 12, margin: "16px 0 24px 0" }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                background: "var(--g100)",
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        {/* Content Grid */}
        <div className="hero-container">
          {/* Left Column */}
          <div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card" style={{ marginBottom: 24 }}>
                <div className="card-head">
                  <div
                    style={{
                      width: "40%",
                      height: 16,
                      background: "var(--g100)",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div className="card-body">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      style={{
                        width: "100%",
                        height: 16,
                        background: "var(--g100)",
                        borderRadius: 4,
                        marginBottom: 12,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <aside className="sidebar">
            {[1, 2, 3].map((i) => (
              <div key={i} className="widget">
                <div className="w-head">
                  <div
                    style={{
                      width: "50%",
                      height: 16,
                      background: "var(--g100)",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div className="w-body">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      style={{
                        width: "100%",
                        height: 14,
                        background: "var(--g100)",
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
