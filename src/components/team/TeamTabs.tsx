"use client";

import { useState, ReactNode } from "react";

export type TabType = "schedule" | "roster" | "statistics" | "history" | "articles";

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

interface TeamTabsProps {
  tabs: Tab[];
  defaultTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  children: {
    [key in TabType]?: ReactNode;
  };
}

export function TeamTabs({
  tabs,
  defaultTab = "schedule",
  onTabChange,
  children,
}: TeamTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <div className="flex gap-0 min-w-full md:min-w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex-1 md:flex-none px-4 py-3 font-semibold text-sm transition-all
                border-b-2 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-[var(--psp-gold)] text-[var(--psp-navy)]"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
              style={{
                borderBottomColor:
                  activeTab === tab.id ? "var(--psp-gold)" : "transparent",
              }}
            >
              <span className="mr-2" aria-hidden="true">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="content-area">
        {children[activeTab] || <div>No content available</div>}
      </div>
    </div>
  );
}
