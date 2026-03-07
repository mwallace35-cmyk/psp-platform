import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "sport";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--psp-gray-100)] text-[var(--psp-gray-700)]",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  sport: "bg-[var(--psp-gold)]/10 text-[var(--psp-gold)]",
};

function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default React.memo(Badge);
