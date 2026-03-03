"use client";

import { useState } from "react";

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

export default function TabGroup({
  tabs,
  defaultTab,
  onChange,
  variant = "pills",
}: TabGroupProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key);

  function handleClick(key: string) {
    setActive(key);
    onChange?.(key);
  }

  if (variant === "underline") {
    return (
      <div className="flex gap-6 border-b border-[var(--psp-gray-200)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
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
    <div className="flex gap-1 p-1 bg-[var(--psp-gray-100)] rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleClick(tab.key)}
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
