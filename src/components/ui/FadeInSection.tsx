'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './fade-in-section.module.css';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
}

export default function FadeInSection({
  children,
  delay = 0,
  className = '',
  threshold = 0.1,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Unobserve after animation triggers (prevent re-trigger)
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, isVisible]);

  return (
    <div
      ref={ref}
      className={`${styles.fadeInSection} ${isVisible ? styles.visible : ''} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
