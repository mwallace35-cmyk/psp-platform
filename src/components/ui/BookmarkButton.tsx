'use client';

import { useState, useEffect } from 'react';
import { isMySchool, toggleMySchool } from '@/lib/my-schools';

interface BookmarkButtonProps {
  schoolSlug: string;
  schoolName: string;
  className?: string;
}

export default function BookmarkButton({ schoolSlug, schoolName, className = '' }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    setIsBookmarked(isMySchool(schoolSlug));
    setIsMounted(true);
  }, [schoolSlug]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleMySchool(schoolSlug);
    setIsBookmarked(newState);
  };

  // Prevent rendering until mounted (avoid hydration mismatch)
  if (!isMounted) {
    return (
      <button
        aria-label={`Bookmark ${schoolName}`}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${className}`}
        disabled
      >
        <span className="text-xl">☆</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={isBookmarked ? `Remove ${schoolName} from bookmarks` : `Bookmark ${schoolName}`}
      title={isBookmarked ? `Remove from My Schools` : `Add to My Schools`}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150 hover:bg-[var(--psp-gold-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--psp-gold)] ${className}`}
    >
      <span className={`text-xl transition-all duration-150 ${isBookmarked ? 'text-[var(--psp-gold)]' : 'text-[var(--psp-gray-400)]'}`}>
        {isBookmarked ? '★' : '☆'}
      </span>
    </button>
  );
}
