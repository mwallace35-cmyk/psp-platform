"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TeamSeasonTabsProps {
  sportColor: string;
  tabs: { id: string; label: string }[];
}

export default function TeamSeasonTabs({ sportColor, tabs }: TeamSeasonTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "overview");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isClickScrolling = useRef(false);

  // Scroll active tab button into view on mobile
  const scrollTabIntoView = useCallback((tabId: string) => {
    const btn = tabRefs.current.get(tabId);
    if (btn && tabBarRef.current) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  // IntersectionObserver to highlight active tab based on scroll position
  useEffect(() => {
    const sectionIds = tabs.map((t) => t.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        // Find the topmost visible section
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
      // Allow observer to resume after scroll settles
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  return (
    <div
      className="sticky top-0 z-30"
      style={{ background: "var(--psp-navy)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div
        ref={tabBarRef}
        className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
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
              className="psp-caption relative whitespace-nowrap px-5 py-3 transition-colors flex-shrink-0"
              style={{
                fontSize: "1rem",
                letterSpacing: "0.08em",
                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {tab.label}
              {/* Active indicator bar */}
              <span
                className="absolute bottom-0 left-2 right-2 rounded-t-sm transition-all duration-200"
                style={{
                  height: isActive ? "3px" : "0px",
                  background: sportColor,
                  opacity: isActive ? 1 : 0,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
