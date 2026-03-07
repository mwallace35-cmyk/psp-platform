"use client";

import dynamic from "next/dynamic";

const NewsletterSignup = dynamic(() => import("@/components/newsletter/NewsletterSignup"), { ssr: false });
const PSPPromo = dynamic(() => import("@/components/ads/PSPPromo"), { ssr: false });

interface HomeClientContentProps {
  type: 'billboard' | 'sidebar-ad' | 'newsletter';
}

export function BillboardPromo() {
  return <PSPPromo size="billboard" variant={2} />;
}

export function NewsletterWidget() {
  return <NewsletterSignup />;
}

export function SidebarPromo() {
  return <PSPPromo size="sidebar" variant={1} />;
}
