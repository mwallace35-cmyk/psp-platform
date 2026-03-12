/**
 * Sport-specific color schemes
 * Maps sport slugs to gradient colors for hero sections
 */

export type SportSlug = 'football' | 'basketball' | 'baseball' | 'soccer' | 'lacrosse' | 'track-field' | 'wrestling';

export interface SportColorScheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  accentColor: string;
}

export const SPORT_COLORS: Record<SportSlug, SportColorScheme> = {
  football: {
    name: 'Football',
    primaryColor: '#0a1628',
    secondaryColor: '#1e3a5f',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)',
    accentColor: '#3b82f6',
  },
  basketball: {
    name: 'Basketball',
    primaryColor: '#0a1628',
    secondaryColor: '#c2410c',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #c2410c 100%)',
    accentColor: '#ea580c',
  },
  baseball: {
    name: 'Baseball',
    primaryColor: '#0a1628',
    secondaryColor: '#166534',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #166534 100%)',
    accentColor: '#22c55e',
  },
  soccer: {
    name: 'Soccer',
    primaryColor: '#0a1628',
    secondaryColor: '#059669',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #059669 100%)',
    accentColor: '#10b981',
  },
  lacrosse: {
    name: 'Lacrosse',
    primaryColor: '#0a1628',
    secondaryColor: '#7c3aed',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #7c3aed 100%)',
    accentColor: '#a78bfa',
  },
  'track-field': {
    name: 'Track & Field',
    primaryColor: '#0a1628',
    secondaryColor: '#dc2626',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #dc2626 100%)',
    accentColor: '#ef4444',
  },
  wrestling: {
    name: 'Wrestling',
    primaryColor: '#0a1628',
    secondaryColor: '#a16207',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #a16207 100%)',
    accentColor: '#d97706',
  },
};

export function getSportColor(sportSlug: string): SportColorScheme {
  return SPORT_COLORS[sportSlug as SportSlug] || SPORT_COLORS.football;
}
