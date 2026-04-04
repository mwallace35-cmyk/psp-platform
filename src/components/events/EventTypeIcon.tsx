import { Dumbbell, GraduationCap, Trophy, Star, Swords, Users, Heart, HelpCircle, Target } from "lucide-react";

const EVENT_TYPE_MAP: Record<string, { color: string; bgColor: string; label: string; icon: React.ElementType }> = {
  camp: { color: "#16a34a", bgColor: "rgba(22,163,74,0.1)", label: "Camp", icon: Dumbbell },
  clinic: { color: "#2563eb", bgColor: "rgba(59,130,246,0.1)", label: "Clinic", icon: GraduationCap },
  combine: { color: "#7c3aed", bgColor: "rgba(124,58,237,0.1)", label: "Combine", icon: Target },
  showcase: { color: "#b87900", bgColor: "rgba(240,165,0,0.12)", label: "Showcase", icon: Star },
  tournament: { color: "#dc2626", bgColor: "rgba(220,38,38,0.1)", label: "Tournament", icon: Trophy },
  "award-ceremony": { color: "#a16207", bgColor: "rgba(202,138,4,0.12)", label: "Award Ceremony", icon: Trophy },
  tryout: { color: "#0891b2", bgColor: "rgba(8,145,178,0.1)", label: "Tryout", icon: Swords },
  fundraiser: { color: "#db2777", bgColor: "rgba(236,72,153,0.1)", label: "Fundraiser", icon: Heart },
  meeting: { color: "#64748b", bgColor: "rgba(100,116,139,0.1)", label: "Meeting", icon: Users },
  other: { color: "#475569", bgColor: "rgba(71,85,105,0.1)", label: "Other", icon: HelpCircle },
};

export function getEventTypeStyle(type: string) {
  return EVENT_TYPE_MAP[type] || EVENT_TYPE_MAP.other;
}

export function EventTypePill({ type, size = "sm" }: { type: string; size?: "sm" | "md" }) {
  const style = getEventTypeStyle(type);
  const Icon = style.icon;
  const isSmall = size === "sm";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide"
      style={{
        background: style.bgColor,
        color: style.color,
        padding: isSmall ? "2px 8px" : "3px 10px",
        fontSize: isSmall ? "0.6rem" : "0.65rem",
        letterSpacing: "0.08em",
      }}
    >
      <Icon size={isSmall ? 10 : 12} />
      {style.label}
    </span>
  );
}
