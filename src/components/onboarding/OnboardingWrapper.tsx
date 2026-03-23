"use client";

import dynamic from "next/dynamic";

// Lazy-load the modal so it doesn't add to initial bundle for returning users
const FollowSchoolsModal = dynamic(
  () => import("@/components/onboarding/FollowSchoolsModal"),
  { ssr: false }
);

/**
 * Client component wrapper that renders the onboarding modal.
 * Placed in layout.tsx (a server component) to bridge the gap.
 * The modal itself checks localStorage and only shows on first visit.
 */
export default function OnboardingWrapper() {
  return <FollowSchoolsModal />;
}
