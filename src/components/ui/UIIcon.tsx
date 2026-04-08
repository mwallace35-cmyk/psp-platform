/**
 * UIIcon — semantic wrapper around lucide-react for non-sport UI glyphs.
 *
 * Use this instead of literal emoji (audit CC-2). Maps friendly names to
 * lucide icons so the rest of the codebase doesn't import lucide directly
 * and we can swap the underlying icon set later if needed.
 *
 * Usage:
 *   <UIIcon name="trophy" size={24} />
 *   <UIIcon name="search" className="text-gold" />
 */

import {
  Trophy,
  BarChart3,
  Search,
  Home,
  Menu,
  Star,
  Target,
  School,
  Flame,
  Calendar,
  Users,
  Award,
  Medal,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Bell,
  Heart,
  Share2,
  ExternalLink,
  Eye,
  Filter,
  Zap,
  Newspaper,
  TrendingUp,
  Clock,
  Map,
  type LucideIcon,
} from "lucide-react";

export type UIIconName =
  | "trophy"
  | "chart"
  | "search"
  | "home"
  | "menu"
  | "star"
  | "target"
  | "school"
  | "fire"
  | "calendar"
  | "users"
  | "award"
  | "medal"
  | "arrow-right"
  | "arrow-left"
  | "chevron-down"
  | "chevron-right"
  | "bookmark"
  | "bell"
  | "heart"
  | "share"
  | "external"
  | "eye"
  | "filter"
  | "zap"
  | "news"
  | "trending"
  | "clock"
  | "map";

const ICON_MAP: Record<UIIconName, LucideIcon> = {
  trophy: Trophy,
  chart: BarChart3,
  search: Search,
  home: Home,
  menu: Menu,
  star: Star,
  target: Target,
  school: School,
  fire: Flame,
  calendar: Calendar,
  users: Users,
  award: Award,
  medal: Medal,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  bookmark: Bookmark,
  bell: Bell,
  heart: Heart,
  share: Share2,
  external: ExternalLink,
  eye: Eye,
  filter: Filter,
  zap: Zap,
  news: Newspaper,
  trending: TrendingUp,
  clock: Clock,
  map: Map,
};

interface UIIconProps {
  name: UIIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export default function UIIcon({
  name,
  size = 18,
  className,
  strokeWidth = 2,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: UIIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;

  const isDecorative = ariaHidden ?? !ariaLabel;

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={isDecorative}
      focusable={false}
    />
  );
}

export { ICON_MAP };
