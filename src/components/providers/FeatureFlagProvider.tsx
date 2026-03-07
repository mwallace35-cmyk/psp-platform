'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { FeatureFlag, isFeatureEnabled, getAllFeatureFlags, getFeatureFlagMetadata } from '@/lib/feature-flags';

/**
 * Feature Flag Context for React components
 */
interface FeatureFlagContextType {
  isEnabled: (flag: FeatureFlag) => boolean;
  getAllFlags: () => Record<string, boolean>;
  getMetadata: () => Array<{
    name: FeatureFlag;
    description: string;
    enabled: boolean;
    default: boolean;
  }>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

/**
 * Provider component for feature flags
 * Wrap your app with this to enable useFeatureFlag hook
 */
export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<FeatureFlagContextType>(
    () => ({
      isEnabled: (flag: FeatureFlag) => isFeatureEnabled(flag),
      getAllFlags: () => getAllFeatureFlags(),
      getMetadata: () => getFeatureFlagMetadata(),
    }),
    []
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

/**
 * Hook to use feature flags in React components
 * @param flag - The feature flag to check
 * @returns Whether the flag is enabled
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    // Fallback if provider not available
    return isFeatureEnabled(flag);
  }
  return context.isEnabled(flag);
}

/**
 * Hook to get all feature flags
 */
export function useAllFeatureFlags(): Record<string, boolean> {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    // Fallback if provider not available
    return getAllFeatureFlags();
  }
  return context.getAllFlags();
}

/**
 * Hook to get feature flag metadata
 */
export function useFeatureFlagMetadata() {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    // Fallback if provider not available
    return getFeatureFlagMetadata();
  }
  return context.getMetadata();
}

/**
 * Wrapper component to conditionally render content based on feature flag
 */
export function FeatureFlaggedContent({
  flag,
  children,
  fallback = null,
}: {
  flag: FeatureFlag;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isEnabled = useFeatureFlag(flag);
  return isEnabled ? children : fallback;
}
