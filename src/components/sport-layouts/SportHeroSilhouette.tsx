"use client";

import { useEffect, useRef } from "react";

interface SportHeroSilhouetteProps {
  sport: string;
  variant?: string;
}

// ======================
// LAYER 1: Court/Field Diagrams (Background — very faint)
// ======================

function BasketballCourtBg() {
  return (
    <svg viewBox="0 0 940 340" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" opacity="0.08" strokeWidth="1.5">
        <rect x="20" y="10" width="900" height="320" rx="2" />
        <line x1="470" y1="10" x2="470" y2="330" />
        <circle cx="470" cy="170" r="55" />
        <rect x="20" y="90" width="150" height="160" />
        <circle cx="170" cy="170" r="55" />
        <path d="M20 30 L90 30 Q240 30 240 170 Q240 310 90 310 L20 310" />
        <circle cx="42" cy="170" r="10" />
        <line x1="27" y1="145" x2="27" y2="195" strokeWidth="3" />
        <rect x="770" y="90" width="150" height="160" />
        <circle cx="770" cy="170" r="55" />
        <path d="M920 30 L850 30 Q700 30 700 170 Q700 310 850 310 L920 310" />
        <circle cx="898" cy="170" r="10" />
        <line x1="913" y1="145" x2="913" y2="195" strokeWidth="3" />
      </g>
      <g opacity="0.03" fill="currentColor">
        <rect x="20" y="90" width="150" height="160" />
        <rect x="770" y="90" width="150" height="160" />
        <circle cx="470" cy="170" r="55" />
      </g>
    </svg>
  );
}

function FootballFieldBg() {
  return (
    <svg viewBox="0 0 500 400" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" opacity="0.08" strokeWidth="1.5">
        <rect x="30" y="30" width="440" height="340" rx="2" />
        <line x1="70" y1="30" x2="70" y2="370" strokeWidth="2" />
        <line x1="430" y1="30" x2="430" y2="370" strokeWidth="2" />
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <line key={i} x1={70 + i * 36} y1="30" x2={70 + i * 36} y2="370" strokeWidth={i === 5 ? "2" : "1"} />
        ))}
        {Array.from({length: 45}, (_, i) => (
          <line key={`h${i}`} x1={70 + i * 8} y1="135" x2={70 + i * 8} y2="145" strokeWidth="0.8" />
        ))}
      </g>
      <g opacity="0.04" fill="currentColor">
        <rect x="30" y="30" width="40" height="340" />
        <rect x="430" y="30" width="40" height="340" />
      </g>
    </svg>
  );
}

function BaseballDiamondBg() {
  return (
    <svg viewBox="0 0 500 450" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" opacity="0.08" strokeWidth="1.5">
        <path d="M50 420 Q50 80 250 50 Q450 80 450 420" />
        <path d="M250 350 L370 230 L250 110 L130 230 Z" />
        <line x1="250" y1="350" x2="40" y2="140" />
        <line x1="250" y1="350" x2="460" y2="140" />
        <circle cx="250" cy="235" r="16" />
      </g>
      <g opacity="0.03" fill="currentColor">
        <path d="M250 350 L370 230 L250 110 L130 230 Z" />
      </g>
    </svg>
  );
}

function GenericFieldBg() {
  return (
    <svg viewBox="0 0 500 400" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" opacity="0.06" strokeWidth="1.5">
        <rect x="30" y="30" width="440" height="340" rx="2" />
        <line x1="250" y1="30" x2="250" y2="370" />
        <circle cx="250" cy="200" r="50" />
      </g>
    </svg>
  );
}

// ======================
// LAYER 2: Geometric shapes (Middle — medium opacity)
// ======================

function GeometricOverlay({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 800 400" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* Diagonal lines */}
      <g stroke={color} opacity="0.06" strokeWidth="1">
        <line x1="600" y1="0" x2="400" y2="400" />
        <line x1="650" y1="0" x2="450" y2="400" />
        <line x1="700" y1="0" x2="500" y2="400" />
        <line x1="750" y1="0" x2="550" y2="400" />
        <line x1="800" y1="0" x2="600" y2="400" />
      </g>
      {/* Triangular shapes */}
      <g fill={color} opacity="0.04">
        <path d="M700 0 L800 0 L800 150 Z" />
        <path d="M650 400 L800 400 L800 200 Z" />
      </g>
      {/* Dots grid */}
      <g fill={color} opacity="0.08">
        {Array.from({length: 6}, (_, row) =>
          Array.from({length: 4}, (_, col) => (
            <circle key={`d${row}${col}`} cx={550 + col * 30} cy={50 + row * 60} r="2" />
          ))
        )}
      </g>
      {/* Horizontal accent lines */}
      <g stroke={color} opacity="0.1" strokeWidth="2">
        <line x1="0" y1="398" x2="800" y2="398" />
      </g>
      <g stroke={color} opacity="0.05" strokeWidth="1">
        <line x1="0" y1="2" x2="800" y2="2" />
      </g>
    </svg>
  );
}

// ======================
// LAYER 3: Player Silhouettes (Foreground — visible)
// ======================

function BasketballPlayer() {
  return (
    <svg viewBox="0 0 300 420" fill="none" className="w-full h-full">
      <g fill="currentColor" opacity="0.22">
        {/* Player shooting - jump shot */}
        <circle cx="155" cy="62" r="22" />
        <path d="M140 84 L133 185 L182 185 L176 82 Z" />
        {/* Arms up shooting */}
        <path d="M176 95 L206 68 L222 48 L218 42 L200 62 L170 88 Z" />
        <path d="M140 100 L115 82 L110 88 L135 108 Z" />
        {/* Basketball releasing */}
        <circle cx="225" cy="38" r="14" />
        {/* Shot arc */}
        <path d="M237 32 Q268 5 300 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.5" />
        {/* Legs - jumping */}
        <path d="M138 185 L122 258 L112 325 L128 328 L138 262 L148 190 Z" />
        <path d="M170 185 L180 258 L190 325 L174 328 L166 262 L160 190 Z" />
        {/* Sneakers */}
        <path d="M108 322 L133 332 L108 336 Z" />
        <path d="M186 322 L208 332 L186 336 Z" />
        {/* Jump shadow */}
        <ellipse cx="155" cy="390" rx="50" ry="8" opacity="0.3" />
      </g>
    </svg>
  );
}

function FootballPlayer() {
  return (
    <svg viewBox="0 0 300 420" fill="none" className="w-full h-full">
      <g fill="currentColor" opacity="0.22">
        {/* Helmet */}
        <path d="M160 38 Q192 24 202 50 Q208 72 188 80 Q168 85 158 65 Q152 45 160 38 Z" />
        <path d="M202 50 L212 44 L208 60 L202 55" opacity="0.6" />
        {/* Torso + pads */}
        <path d="M155 82 L140 185 L202 185 L192 82 Z" />
        <path d="M130 85 L155 82 L192 82 L218 88 L212 108 L135 108 Z" opacity="0.8" />
        {/* Right arm cocked with football */}
        <path d="M192 95 L222 74 L248 48 L254 56 L230 82 L200 104 Z" />
        <ellipse cx="250" cy="42" rx="14" ry="8" transform="rotate(-30 250 42)" />
        {/* Left arm guiding */}
        <path d="M148 100 L114 126 L110 120 L142 94 Z" />
        {/* Legs */}
        <path d="M145 185 L128 278 L118 348 L138 352 L148 282 L158 190 Z" />
        <path d="M188 185 L202 278 L212 348 L192 352 L186 282 L178 190 Z" />
        {/* Cleats */}
        <path d="M113 345 L143 356 L113 360 Z" />
        <path d="M208 345 L235 356 L208 360 Z" />
      </g>
    </svg>
  );
}

function BaseballPlayer() {
  return (
    <svg viewBox="0 0 300 420" fill="none" className="w-full h-full">
      <g fill="currentColor" opacity="0.22">
        {/* Head + helmet */}
        <path d="M172 42 Q204 32 208 58 Q208 76 188 82 Q168 82 164 62 Q162 44 172 42 Z" />
        <path d="M164 48 L152 44 L154 58 L164 62" />
        {/* Torso - rotated swing */}
        <path d="M168 84 L148 180 L198 180 L208 84 Z" />
        {/* Arms - follow through */}
        <path d="M168 94 L132 74 L94 44 L88 50 L124 82 L162 104 Z" />
        <path d="M208 100 L232 84 L228 78 L204 94 Z" />
        {/* Bat */}
        <line x1="88" y1="46" x2="32" y2="14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <line x1="32" y1="14" x2="18" y2="6" stroke="currentColor" strokeWidth="9" strokeLinecap="round" opacity="0.7" />
        {/* Swing arc */}
        <path d="M88 50 Q54 95 82 138" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="3 3" opacity="0.4" />
        {/* Legs */}
        <path d="M152 180 L138 272 L128 342 L148 346 L154 276 L162 185 Z" />
        <path d="M188 180 L202 272 L212 342 L192 346 L188 276 L182 185 Z" />
        <path d="M124 339 L153 350 L124 354 Z" />
        <path d="M208 339 L234 350 L208 354 Z" />
      </g>
    </svg>
  );
}

function GenericPlayer() {
  return (
    <svg viewBox="0 0 300 420" fill="none" className="w-full h-full">
      <g fill="currentColor" opacity="0.12">
        <circle cx="155" cy="65" r="20" />
        <path d="M142 85 L135 185 L180 185 L175 83 Z" />
        <path d="M175 100 L210 82 L212 88 L178 108 Z" />
        <path d="M142 105 L112 128 L110 122 L138 100 Z" />
        <path d="M140 185 L125 275 L115 345 L135 348 L142 278 L150 190 Z" />
        <path d="M172 185 L185 275 L195 345 L175 348 L170 278 L165 190 Z" />
      </g>
    </svg>
  );
}

// ======================
// LAYER 4: Gold accent glow
// ======================

function GoldGlow({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 800 400" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="glow1" cx="75%" cy="30%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="85%" cy="80%" r="30%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="topEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="400" fill="url(#glow1)" />
      <rect x="0" y="0" width="800" height="400" fill="url(#glow2)" />
      <rect x="0" y="0" width="800" height="6" fill="url(#topEdge)" />
    </svg>
  );
}

// ======================
// SPORT COLOR MAP
// ======================

const SPORT_COLORS: Record<string, string> = {
  basketball: "#3b82f6",
  football: "#16a34a",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

const GOLD = "#f0a500";

// ======================
// MAIN COMPONENT
// ======================

export default function SportHeroSilhouette({ sport }: SportHeroSilhouetteProps) {
  const sportColor = SPORT_COLORS[sport] || "#3b82f6";

  const courtBgs: Record<string, React.ReactNode> = {
    basketball: <BasketballCourtBg />,
    football: <FootballFieldBg />,
    baseball: <BaseballDiamondBg />,
  };

  const players: Record<string, React.ReactNode> = {
    basketball: <BasketballPlayer />,
    football: <FootballPlayer />,
    baseball: <BaseballPlayer />,
  };

  return (
    <div className="text-white w-full h-full relative">
      {/* LAYER 1: Court/field diagram — very faint background */}
      <div className="absolute inset-0">
        {courtBgs[sport] || <GenericFieldBg />}
      </div>

      {/* LAYER 2: Geometric shapes — medium opacity */}
      <div className="absolute inset-0">
        <GeometricOverlay color={sportColor} />
      </div>

      {/* LAYER 3: Player silhouette — right side, foreground */}
      <div className="absolute right-0 bottom-0" style={{ width: "45%", height: "130%", marginBottom: "-10%" }}>
        {players[sport] || <GenericPlayer />}
      </div>

      {/* LAYER 4: Gold accent glow */}
      <div className="absolute inset-0">
        <GoldGlow color={GOLD} />
      </div>

      {/* LAYER 5: Sport-color edge glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${sportColor}40, ${GOLD}60, ${sportColor}40, transparent)` }} />
    </div>
  );
}
