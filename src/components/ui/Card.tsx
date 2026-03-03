import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "sport";
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles =
    "bg-white rounded-xl border border-[var(--psp-gray-200)] shadow-sm";
  const hoverStyles =
    variant === "hover"
      ? "hover:shadow-md hover:border-[var(--psp-gray-300)] transition-all duration-200 cursor-pointer"
      : "";
  const sportStyles =
    variant === "sport"
      ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
      : "";

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${sportStyles} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
