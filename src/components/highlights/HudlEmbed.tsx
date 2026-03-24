'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui';

interface HudlEmbedProps {
  hudlUrl: string;
  title?: string;
  playerName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // sm=240px, md=360px, lg=full width
}

const sizeMap = {
  sm: { height: 'h-[240px]', containerHeight: 240 },
  md: { height: 'h-[360px]', containerHeight: 360 },
  lg: { height: 'h-[540px]', containerHeight: 540 },
};

export default function HudlEmbed({
  hudlUrl,
  title,
  playerName,
  className = '',
  size = 'md',
}: HudlEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Validate and convert Hudl URL
  const getEmbedUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      // Hudl URLs like https://www.hudl.com/video/3/12345/abcdef
      // Can be embedded as iframe with /v/ path
      if (urlObj.hostname.includes('hudl.com')) {
        // Extract the path and convert to embed format
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          // https://www.hudl.com/v/... format for embedding
          const embedUrl = `https://www.hudl.com/v/${pathParts[pathParts.length - 1]}`;
          return embedUrl;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(hudlUrl);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const sizeConfig = sizeMap[size];

  if (!embedUrl) {
    return (
      <div
        ref={containerRef}
        className={`${sizeConfig.height} bg-[var(--psp-navy)] rounded-lg border-2 border-[var(--psp-gold)] flex items-center justify-center ${className}`}
      >
        <div className="text-center px-4">
          <p className="text-gray-300 font-semibold">Highlight unavailable</p>
          <p className="text-gray-400 text-sm mt-1">Invalid Hudl URL</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <div
        className={`${sizeConfig.height} bg-[var(--psp-navy)] rounded-lg border-2 border-[var(--psp-gold)] overflow-hidden relative group`}
      >
        {/* Loading skeleton */}
        {isLoading && (
          <Skeleton className={`w-full ${sizeConfig.height}`} />
        )}

        {/* Lazy-loaded iframe */}
        {isInView && embedUrl && (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="fullscreen"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Failed to load highlight');
              setIsLoading(false);
            }}
            title={title || playerName || 'Hudl highlight video'}
          />
        )}

        {/* Play button overlay (before first interaction) */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="w-16 h-16 bg-[var(--psp-gold)]/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-[var(--psp-gold)] ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--psp-navy-mid)] text-center px-4">
            <p className="text-gray-300 text-sm">{error}</p>
          </div>
        )}

        {/* Title overlay at bottom */}
        {(title || playerName) && !isLoading && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 text-white">
            <p className="text-sm font-semibold line-clamp-1">
              {title || playerName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
