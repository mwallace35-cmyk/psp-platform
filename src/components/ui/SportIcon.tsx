interface SportIconProps {
  sport: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
  swimming: "🏊",
  golf: "⛳",
  tennis: "🎾",
};

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

const sizeMap = {
  sm: "text-lg w-8 h-8",
  md: "text-2xl w-12 h-12",
  lg: "text-4xl w-16 h-16",
};

export default function SportIcon({ sport, size = "md", className = "" }: SportIconProps) {
  const emoji = SPORT_EMOJI[sport] || "🏅";
  const color = SPORT_COLORS[sport] || "#64748b";

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl ${sizeMap[size]} ${className}`}
      style={{ background: `${color}15` }}
    >
      {emoji}
    </div>
  );
}

export { SPORT_EMOJI, SPORT_COLORS };
