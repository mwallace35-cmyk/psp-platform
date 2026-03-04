"use client";

import { useState, useEffect } from "react";

type LayoutType = "editorial" | "dashboard" | "league";

const LAYOUT_LABELS: Record<LayoutType, { label: string; icon: string }> = {
  editorial: { label: "Editorial", icon: "📰" },
  dashboard: { label: "Dashboard", icon: "📊" },
  league: { label: "By League", icon: "🏟️" },
};

interface LayoutToggleProps {
  sport: string;
  sportColor: string;
  onLayoutChange: (layout: LayoutType) => void;
  defaultLayout?: LayoutType;
}

export default function LayoutToggle({ sport, sportColor, onLayoutChange, defaultLayout = "editorial" }: LayoutToggleProps) {
  const [active, setActive] = useState<LayoutType>(defaultLayout);

  useEffect(() => {
    // Restore from localStorage
    try {
      const saved = localStorage.getItem(`psp-layout-${sport}`);
      if (saved && (saved === "editorial" || saved === "dashboard" || saved === "league")) {
        setActive(saved);
        onLayoutChange(saved);
      }
    } catch {}
  }, [sport]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (layout: LayoutType) => {
    setActive(layout);
    onLayoutChange(layout);
    try {
      localStorage.setItem(`psp-layout-${sport}`, layout);
    } catch {}
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "8px 16px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <span style={{ fontSize: 10, color: "var(--g400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginRight: 8 }}>
        Layout:
      </span>
      {(Object.keys(LAYOUT_LABELS) as LayoutType[]).map((key) => (
        <button
          key={key}
          onClick={() => handleChange(key)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 20,
            border: active === key ? `2px solid ${sportColor}` : "1px solid var(--g200)",
            background: active === key ? `${sportColor}15` : "var(--psp-white)",
            color: active === key ? sportColor : "var(--g500)",
            cursor: "pointer",
            transition: ".15s",
          }}
        >
          <span style={{ fontSize: 12 }}>{LAYOUT_LABELS[key].icon}</span>
          {LAYOUT_LABELS[key].label}
        </button>
      ))}
    </div>
  );
}

export type { LayoutType };
