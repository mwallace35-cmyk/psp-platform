"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TABS = [
  { id: "all-americans", label: "All-Americans" },
  { id: "class-spotlight", label: "Class Spotlight" },
  { id: "pipeline", label: "Pipeline" },
  { id: "destinations", label: "Destinations" },
  { id: "recruit-finder", label: "Recruit Finder" },
];

export default function RecruitingSubNav() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const barRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isClickScrolling = useRef(false);

  const scrollTabIntoView = useCallback((tabId: string) => {
    const btn = tabRefs.current.get(tabId);
    if (btn && barRef.current) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  /* IntersectionObserver — highlight active section */
  useEffect(() => {
    const elements = TABS.map((t) => document.getElementById(t.id)).filter(
      Boolean
    ) as HTMLElement[];
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
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scrollTabIntoView]);

  const handleClick = (tabId: string) => {
    setActiveTab(tabId);
    scrollTabIntoView(tabId);
    isClickScrolling.current = true;

    const el = document.getElementById(tabId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  return (
    <div
      ref={barRef}
      className="sticky top-0 z-40 overflow-x-auto scrollbar-hide"
      style={{ backgroundColor: "#0a1628", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-7xl mx-auto px-4 flex gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              onClick={() => handleClick(tab.id)}
              className="relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors shrink-0"
              style={{
                color: isActive ? "#f0a500" : "rgba(255,255,255,0.5)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                  style={{ backgroundColor: "#f0a500" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
