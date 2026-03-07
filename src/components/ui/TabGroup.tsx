"use client";

import { useState, useRef, useEffect } from "react";

interface Tab {
  key: string;
  label: string;
  icon?: string;
}

interface TabGroupProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  variant?: "pills" | "underline";
}

export function TabPanel({ tabKey, activeTab, children }: { tabKey: string; activeTab: string; children: React.ReactNode }) {
  if (activeTab !== tabKey) return null;
  return (
    <div role="tabpanel" id={`tabpanel-${tabKey}`} aria-labelledby={`tab-${tabKey}`} tabIndex={0}>
      {children}
    </div>
  );
}

export default function TabGroup({
  tabs,
  defaultTab,
  onChange,
  variant = "pills",
}: TabGroupProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key);
  const tabListRef = useRef<HTMLDivElement>(null);

  function handleClick(key: string) {
    setActive(key);
    onChange?.(key);
  }

  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    let nextIndex = currentIndex;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    } else {
      return;
    }

    const nextKey = tabs[nextIndex].key;
    handleClick(nextKey);

    // Focus the newly selected tab
    const nextButton = tabListRef.current?.querySelector(`button[id="tab-${nextKey}"]`) as HTMLButtonElement;
    nextButton?.focus();
  }

  if (variant === "underline") {
    return (
      <div ref={tabListRef} role="tablist" className="flex gap-6 border-b border-[var(--psp-gray-200)]">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            role="tab"
            aria-selected={active === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            onClick={() => handleClick(tab.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              active === tab.key
                ? "text-[var(--psp-navy)]"
                : "text-[var(--psp-gray-400)] hover:text-[var(--psp-gray-600)]"
            }`}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
            {active === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--psp-gold)]" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={tabListRef} role="tablist" className="flex gap-1 p-1 bg-[var(--psp-gray-100)] rounded-lg">
      {tabs.map((tab, index) => (
        <button
          key={tab.key}
          id={`tab-${tab.key}`}
          role="tab"
          aria-selected={active === tab.key}
          aria-controls={`tabpanel-${tab.key}`}
          onClick={() => handleClick(tab.key)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            active === tab.key
              ? "bg-white text-[var(--psp-navy)] shadow-sm"
              : "text-[var(--psp-gray-500)] hover:text-[var(--psp-gray-700)]"
          }`}
        >
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
