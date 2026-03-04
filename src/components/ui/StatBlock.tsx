interface StatBlockProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: { value: number; isPositive: boolean };
  size?: "sm" | "md" | "lg";
}

export default function StatBlock({
  label,
  value,
  icon,
  trend,
  size = "md",
}: StatBlockProps) {
  const valueSize = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className="text-center">
      {icon && <div className={size === "lg" ? "text-4xl mb-2" : "text-2xl mb-1"}>{icon}</div>}
      <div
        className={`font-bold ${valueSize[size]} tracking-tight`}
        style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-xs font-medium mt-1" style={{ color: "var(--psp-gray-500)" }}>
        {label}
      </div>
      {trend && (
        <div
          className={`text-xs font-medium mt-0.5 ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend.isPositive ? "+" : ""}{trend.value}%
        </div>
      )}
    </div>
  );
}
