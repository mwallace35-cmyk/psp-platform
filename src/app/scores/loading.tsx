import Skeleton from "@/components/ui/Skeleton";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ScoresLoading() {
  return (
    <main id="main-content" className="flex-1">
      <Breadcrumb items={[{ label: "Scores", href: "/scores" }]} />

      {/* Hero Skeleton */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "2rem 1rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ margin: "0 auto 1rem", maxWidth: "200px" }}>
          <Skeleton width="200px" height="40px" />
        </div>
        <div style={{ margin: "0 auto 1.5rem", maxWidth: "400px" }}>
          <Skeleton width="400px" height="24px" />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} width="100px" height="36px" className="rounded-full" />
            ))}
        </div>
      </div>

      {/* Scores List Skeleton */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem" }}>
        {Array(3)
          .fill(0)
          .map((_, dateIdx) => (
            <div key={dateIdx} style={{ marginBottom: "2rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <Skeleton width="150px" height="28px" />
              </div>
              {Array(3)
                .fill(0)
                .map((_, gameIdx) => (
                  <div
                    key={gameIdx}
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                      padding: "1rem",
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Skeleton width="80px" height="20px" />
                    <Skeleton width="200px" height="32px" />
                    <Skeleton width="100px" height="32px" />
                  </div>
                ))}
            </div>
          ))}
      </div>
    </main>
  );
}
