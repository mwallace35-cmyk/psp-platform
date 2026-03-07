/**
 * Utilities for dynamic Open Graph image generation
 */

import type { SportId } from "@/lib/sports";

export interface SportColorMap {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface OGImageParams {
  title: string;
  subtitle?: string;
  sport?: SportId;
  type?: "player" | "team" | "school" | "article" | "sport";
}

// Sport-specific color palettes for OG images
const SPORT_COLOR_PALETTE: Record<SportId, SportColorMap> = {
  football: {
    primary: "#16a34a",
    secondary: "#0f5132",
    accent: "#22c55e",
    text: "#ffffff",
  },
  basketball: {
    primary: "#ea580c",
    secondary: "#7c2d12",
    accent: "#fb923c",
    text: "#ffffff",
  },
  baseball: {
    primary: "#dc2626",
    secondary: "#7f1d1d",
    accent: "#ef4444",
    text: "#ffffff",
  },
  "track-field": {
    primary: "#7c3aed",
    secondary: "#4c1d95",
    accent: "#a78bfa",
    text: "#ffffff",
  },
  lacrosse: {
    primary: "#0891b2",
    secondary: "#155e75",
    accent: "#06b6d4",
    text: "#ffffff",
  },
  wrestling: {
    primary: "#ca8a04",
    secondary: "#713f12",
    accent: "#eab308",
    text: "#ffffff",
  },
  soccer: {
    primary: "#059669",
    secondary: "#064e3b",
    accent: "#10b981",
    text: "#ffffff",
  },
};

// Brand colors (PSP brand)
const PSP_BRAND = {
  primary: "#0a1628", // Navy
  secondary: "#1a365d", // Dark blue
  accent: "#2563eb", // Bright blue
  light: "#f3f4f6", // Light gray
};

/**
 * Get sport-specific color palette
 */
export function getSportColors(sport?: SportId): SportColorMap {
  if (!sport || !SPORT_COLOR_PALETTE[sport]) {
    // Default to PSP brand colors
    return {
      primary: PSP_BRAND.primary,
      secondary: PSP_BRAND.secondary,
      accent: PSP_BRAND.accent,
      text: "#ffffff",
    };
  }
  return SPORT_COLOR_PALETTE[sport];
}

/**
 * Truncate text to a maximum number of characters
 * Adds ellipsis if truncated
 */
export function truncateText(text: string, maxChars: number = 60): string {
  if (text.length <= maxChars) {
    return text;
  }
  return text.substring(0, maxChars - 3) + "...";
}

/**
 * Truncate title for OG image (typically shorter than subtitle)
 */
export function truncateTitle(text: string): string {
  return truncateText(text, 50);
}

/**
 * Truncate subtitle for OG image
 */
export function truncateSubtitle(text: string): string {
  return truncateText(text, 80);
}

/**
 * Build the OG image URL with query parameters
 */
export function buildOgImageUrl(params: OGImageParams): string {
  const queryParams = new URLSearchParams();

  queryParams.set("title", truncateTitle(params.title));

  if (params.subtitle) {
    queryParams.set("subtitle", truncateSubtitle(params.subtitle));
  }

  if (params.sport) {
    queryParams.set("sport", params.sport);
  }

  if (params.type) {
    queryParams.set("type", params.type);
  }

  // Always use absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://phillysportspack.com";
  return `${baseUrl}/api/og?${queryParams.toString()}`;
}

/**
 * Validate OG image parameters
 */
export function validateOGParams(params: OGImageParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!params.title || params.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (params.title && params.title.length > 200) {
    errors.push("Title must be less than 200 characters");
  }

  if (params.subtitle && params.subtitle.length > 300) {
    errors.push("Subtitle must be less than 300 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
