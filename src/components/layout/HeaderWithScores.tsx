import { Suspense } from "react";
import Header from "./Header";
import ScoreStrip from "./ScoreStrip";

function ScoreStripFallback() {
  return (
    <div className="scorestrip">
      <div className="ss-label">Scores</div>
      <div className="ss-scroll">
        <div style={{ padding: "8px 16px", color: "var(--g400)", fontSize: 11 }}>Loading scores...</div>
      </div>
    </div>
  );
}

export default function HeaderWithScores() {
  return (
    <>
      <Header />
      <Suspense fallback={<ScoreStripFallback />}>
        <ScoreStrip />
      </Suspense>
    </>
  );
}
