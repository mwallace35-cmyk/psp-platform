import React from "react";
import styles from "./hof-badge.module.css";

export interface HofBadgeProps {
  label: string;
  colorPrimary: string;
  colorSecondary: string;
  icon: string;
  size?: "sm" | "md" | "lg";
}

/**
 * SVG badge icons for each HOF organization type.
 * star = PHILLY LEGEND (purple star, gold border)
 * medallion = CITY ALL STAR (gold circle, navy fill)
 * keystone = PA STATE (keystone shape, state blue)
 * shield = PUBLIC LEAGUE LEGEND (orange shield)
 * crest = school-specific HOF (school-colored crest)
 */
function BadgeSvg({
  icon,
  primary,
  secondary,
  sizeClass,
}: {
  icon: string;
  primary: string;
  secondary: string;
  sizeClass: string;
}) {
  const dims = sizeClass === "lg" ? 56 : sizeClass === "md" ? 40 : 24;

  switch (icon) {
    case "star":
      return (
        <svg
          width={dims}
          height={dims}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polygon
            points="28,4 34,20 52,22 39,34 42,52 28,44 14,52 17,34 4,22 22,20"
            fill={primary}
            stroke={secondary}
            strokeWidth="2.5"
          />
          <circle cx="28" cy="28" r="6" fill={secondary} opacity="0.9" />
        </svg>
      );
    case "medallion":
      return (
        <svg
          width={dims}
          height={dims}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="28" cy="28" r="24" fill={secondary} stroke={primary} strokeWidth="3" />
          <circle cx="28" cy="28" r="18" fill="none" stroke={primary} strokeWidth="1.5" />
          <polygon
            points="28,14 31,24 42,24 33,30 36,40 28,34 20,40 23,30 14,24 25,24"
            fill={primary}
          />
        </svg>
      );
    case "keystone":
      return (
        <svg
          width={dims}
          height={dims}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14,8 L42,8 L48,28 L42,48 L14,48 L8,28 Z"
            fill={primary}
            stroke={secondary}
            strokeWidth="2"
          />
          <text
            x="28"
            y="32"
            textAnchor="middle"
            fill={secondary}
            fontSize="14"
            fontWeight="bold"
            fontFamily="var(--font-bebas), sans-serif"
          >
            PA
          </text>
        </svg>
      );
    case "shield":
      return (
        <svg
          width={dims}
          height={dims}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M28,4 L48,12 L48,30 C48,42 38,50 28,54 C18,50 8,42 8,30 L8,12 Z"
            fill={primary}
            stroke={secondary}
            strokeWidth="2"
          />
          <path
            d="M28,14 L40,20 L40,30 C40,38 34,44 28,48 C22,44 16,38 16,30 L16,20 Z"
            fill="none"
            stroke={secondary}
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      );
    case "crest":
      return (
        <svg
          width={dims}
          height={dims}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M28,2 L50,14 L50,34 C50,44 40,52 28,56 C16,52 6,44 6,34 L6,14 Z"
            fill={primary}
            stroke={secondary}
            strokeWidth="2"
          />
          <line x1="28" y1="14" x2="28" y2="44" stroke={secondary} strokeWidth="1.5" opacity="0.4" />
          <line x1="14" y1="26" x2="42" y2="26" stroke={secondary} strokeWidth="1.5" opacity="0.4" />
          <circle cx="28" cy="26" r="5" fill={secondary} opacity="0.8" />
        </svg>
      );
    default:
      return (
        <svg
          width={dims}
          height={dims}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="28" cy="28" r="24" fill={primary} stroke={secondary} strokeWidth="2" />
        </svg>
      );
  }
}

export default function HofBadge({
  label,
  colorPrimary,
  colorSecondary,
  icon,
  size = "md",
}: HofBadgeProps) {
  const sizeClass = size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;

  return (
    <div className={`${styles.badge} ${sizeClass}`}>
      <div className={styles.iconWrap} style={{ borderColor: colorPrimary }}>
        <BadgeSvg icon={icon} primary={colorPrimary} secondary={colorSecondary} sizeClass={size} />
      </div>
      <span
        className={styles.label}
        style={{ color: colorPrimary }}
      >
        {label}
      </span>
    </div>
  );
}
