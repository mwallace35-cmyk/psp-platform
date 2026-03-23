"use client";

import { useState, useEffect, useCallback } from "react";

const FOLLOWED_KEY = "psp_followed_schools";
const ONBOARDED_KEY = "psp_onboarded";

export interface UseFollowedSchoolsReturn {
  followedSchools: string[];
  toggleSchool: (slug: string) => void;
  isFollowing: (slug: string) => boolean;
  hasOnboarded: boolean;
  setOnboarded: () => void;
}

export function useFollowedSchools(): UseFollowedSchoolsReturn {
  const [followedSchools, setFollowedSchools] = useState<string[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(true); // default true to avoid flash

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FOLLOWED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFollowedSchools(parsed);
        }
      }
      setHasOnboarded(localStorage.getItem(ONBOARDED_KEY) === "1");
    } catch {
      // localStorage unavailable or corrupted
    }
  }, []);

  const toggleSchool = useCallback((slug: string) => {
    setFollowedSchools((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem(FOLLOWED_KEY, JSON.stringify(next));
      } catch {
        // storage full or unavailable
      }
      return next;
    });
  }, []);

  const isFollowing = useCallback(
    (slug: string) => followedSchools.includes(slug),
    [followedSchools]
  );

  const setOnboarded = useCallback(() => {
    setHasOnboarded(true);
    try {
      localStorage.setItem(ONBOARDED_KEY, "1");
    } catch {
      // storage unavailable
    }
  }, []);

  return { followedSchools, toggleSchool, isFollowing, hasOnboarded, setOnboarded };
}
