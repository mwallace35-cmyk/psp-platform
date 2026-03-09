import React from 'react';

interface BadgeIconProps {
  type: 'voter' | 'explorer' | 'fact_checker' | 'superfan';
  level: 'bronze' | 'silver' | 'gold';
}

const getLevelGradient = (level: 'bronze' | 'silver' | 'gold') => {
  switch (level) {
    case 'gold':
      return {
        gradient: 'url(#goldGradient)',
        shadow: '#fbbf24',
      };
    case 'silver':
      return {
        gradient: 'url(#silverGradient)',
        shadow: '#d1d5db',
      };
    case 'bronze':
      return {
        gradient: 'url(#bronzeGradient)',
        shadow: '#b45309',
      };
  }
};

export default function BadgeIcon({ type, level }: BadgeIconProps) {
  const { gradient, shadow } = getLevelGradient(level);

  // Voter Badge - Ballot Box
  if (type === 'voter') {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" className="w-20 h-20">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <filter id="badgeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={shadow} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="40" cy="40" r="35" fill={gradient} opacity="0.15" filter="url(#badgeShadow)" />

        {/* Ballot box */}
        <g transform="translate(40, 40)">
          {/* Box body */}
          <rect x="-18" y="-16" width="36" height="28" rx="2" fill={gradient} filter="url(#badgeShadow)" />
          {/* Slot */}
          <rect x="-10" y="-14" width="20" height="3" fill="rgba(0, 0, 0, 0.2)" />
          {/* Checkmark inside */}
          <path d="M -6 -4 L -1 2 L 6 -6" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }

  // Explorer Badge - Compass
  if (type === 'explorer') {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" className="w-20 h-20">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <filter id="badgeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={shadow} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="40" cy="40" r="35" fill={gradient} opacity="0.15" filter="url(#badgeShadow)" />

        {/* Compass */}
        <g transform="translate(40, 40)">
          {/* Compass circle */}
          <circle cx="0" cy="0" r="16" fill={gradient} filter="url(#badgeShadow)" />
          {/* Cardinal points */}
          <line x1="0" y1="-12" x2="0" y2="-16" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" strokeLinecap="round" />
          {/* North pointer */}
          <polygon points="0,-14 -3,-8 3,-8" fill="rgba(255, 255, 255, 0.9)" />
        </g>
      </svg>
    );
  }

  // Fact Checker Badge - Magnifying Glass with Checkmark
  if (type === 'fact_checker') {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" className="w-20 h-20">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <filter id="badgeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={shadow} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="40" cy="40" r="35" fill={gradient} opacity="0.15" filter="url(#badgeShadow)" />

        {/* Magnifying glass */}
        <g transform="translate(40, 40)">
          {/* Lens */}
          <circle cx="-3" cy="-3" r="12" fill="none" stroke={gradient} strokeWidth="2.5" filter="url(#badgeShadow)" />
          {/* Handle */}
          <line x1="7" y1="7" x2="13" y2="13" stroke={gradient} strokeWidth="2.5" strokeLinecap="round" />
          {/* Checkmark inside lens */}
          <path d="M -8 -3 L -4 1 L 3 -6" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }

  // Superfan Badge - Star with Crown
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="w-20 h-20">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <filter id="badgeShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={shadow} floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx="40" cy="40" r="35" fill={gradient} opacity="0.15" filter="url(#badgeShadow)" />

      {/* Star + Crown */}
      <g transform="translate(40, 40)">
        {/* Star */}
        <polygon points="0,-14 3,-4 14,-4 6,2 9,12 0,6 -9,12 -6,2 -14,-4 -3,-4" fill={gradient} filter="url(#badgeShadow)" />
        {/* Crown points on top */}
        <polygon points="0,-18 -4,-12 -2,-16 0,-14 2,-16 4,-12" fill="rgba(255, 255, 255, 0.9)" />
      </g>
    </svg>
  );
}
