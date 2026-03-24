"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PlayerProfileTabsProps {
  sportColor: string;
  tabs: { id: string; label: string }[];
}

export default function PlayerProfileTabs({ sportColor, tabs }: PlayerProfileTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "overview");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isClickScrolling = useRef(false);

  const scrollTabIntoView = useCallback((tabId: string) => {
    const btn = tabRefs.current.get(tabId);
    if (btn && tabBarRef.current) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  useEffect(() => {
    const sectionIds = tabs.map((t) => t.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveTab(id);
          scrollTabIntoView(id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tabs, scrollTabIntoView]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    scrollTabIntoView(tabId);

    const section = document.getElementById(tabId);
    if (section) {
      isClickScrolling.current = true;
      section.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  return (
    <div
      className="sticky top-0 z-30"
      style={{ background: "var(--psp-navy)", borderBottom: `3px solid ${sportColor}22` }}
    >
      <div
        ref={tabBarRef}
        className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" } as React.CSSProperties}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              onClick={() => handleTabClick(tab.id)}
              className={`psp-caption whitespace-nowrap px-5 py-3 transition-colors duration-200 flex-shrink-0 cursor-pointer bg-transparent border-b-2 ${
                isActive
                  ? "border-[var(--psp-gold)] text-white"
                  : "border-transparent text-gray-300 hover:text-gray-200"
              }`}
              style={{
                fontSize: "1rem",
                letterSpacing: "0.08em",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
