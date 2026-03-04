'use client';

import { useState, useRef, useEffect } from 'react';

interface StatTooltipProps {
  abbr: string;
  definition: string;
}

export default function StatTooltip({ abbr, definition }: StatTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span
        className="border-b border-dotted border-current cursor-help"
        role="button"
        tabIndex={0}
        aria-describedby={`stat-tooltip-${abbr.replace(/\s+/g, '-')}`}
      >
        {abbr}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          id={`stat-tooltip-${abbr.replace(/\s+/g, '-')}`}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          role="tooltip"
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#0a1628]" />

          {/* Tooltip box */}
          <div className="bg-[#0a1628] text-white text-xs px-3 py-2 rounded-md shadow-lg max-w-[200px] w-max">
            {definition}
          </div>
        </div>
      )}
    </span>
  );
}
