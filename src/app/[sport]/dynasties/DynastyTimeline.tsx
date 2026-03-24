"use client";

import { useState, useMemo } from "react";
import { DynastyDecadeData } from "@/lib/data/dynasty-tracker";

interface Props {
  decadeData: DynastyDecadeData[];
  sport: string;
  sportColor: string;
}

export default function DynastyTimeline({
  decadeData,
  sport,
  sportColor,
}: Props) {
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);

  // Get max championships for scaling
  const maxChampionships = useMemo(() => {
    let max = 0;
    for (const decade of decadeData) {
      for (const school of decade.schools) {
        if (school.championship_count > max) {
          max = school.championship_count;
        }
      }
    }
    return max || 1;
  }, [decadeData]);

  // Get available decades for filter
  const decades = decadeData.map((d) => d.decade);

  // Filter data
  const filteredData = useMemo(() => {
    if (!selectedDecade) return decadeData;
    return decadeData.filter((d) => d.decade === selectedDecade);
  }, [decadeData, selectedDecade]);

  return (
    <div className="space-y-8">
      {/* Decade Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedDecade(null)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            !selectedDecade
              ? "text-black"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          style={!selectedDecade ? { backgroundColor: sportColor, color: "white" } : {}}
        >
          All Decades
        </button>
        {decades.map((decade) => (
          <button
            key={decade}
            onClick={() => setSelectedDecade(decade)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedDecade === decade
                ? "text-black"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            style={
              selectedDecade === decade
                ? { backgroundColor: sportColor, color: "white" }
                : {}
            }
          >
            {decade}
          </button>
        ))}
      </div>

      {/* Timeline Visualization */}
      <div className="space-y-8">
        {filteredData.map((decadeItem) => (
          <div key={decadeItem.decade} className="space-y-4">
            <h2 className="psp-h2 text-gray-900">
              {decadeItem.decade}
            </h2>

            <div className="space-y-3">
              {decadeItem.schools.slice(0, 10).map((school) => {
                const percentage = (school.championship_count / maxChampionships) * 100;
                return (
                  <div key={school.school_id} className="flex items-center gap-4">
                    <div className="w-40 flex-shrink-0">
                      <a
                        href={`/${sport}/schools/${school.school_slug}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 hover:underline text-sm line-clamp-2"
                      >
                        {school.school_name}
                      </a>
                    </div>

                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div
                          className="h-full rounded-full transition-all flex items-center justify-end pr-2"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: sportColor,
                          }}
                        >
                          {percentage > 15 && (
                            <span className="text-white text-xs font-bold">
                              {school.championship_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-12 text-right flex-shrink-0">
                      <span className="font-bebas text-lg font-bold text-gray-900">
                        {school.championship_count}
                      </span>
                    </div>
                  </div>
                );
              })}

              {decadeItem.schools.length > 10 && (
                <p className="text-sm text-gray-400 italic">
                  +{decadeItem.schools.length - 10} more schools
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
        <p className="font-semibold mb-2">Legend</p>
        <p>
          Bar width represents the school's championship count relative to the decade
          leader. Hover over school names to visit their profile.
        </p>
      </div>
    </div>
  );
}
