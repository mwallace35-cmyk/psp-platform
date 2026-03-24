"use client";

interface Player {
  name: string;
  position: string;
  class: "Sr" | "Jr" | "So" | "Fr";
  height: string;
  weight: string;
  slug: string;
}

interface TeamRosterProps {
  roster: Player[];
  positionGroups: Record<string, string[]>;
  sportMeta: {
    color: string;
  };
}

export default function TeamRoster({
  roster,
  positionGroups,
  sportMeta,
}: TeamRosterProps) {
  // Group roster by positions
  const groupedRoster: Record<string, Player[]> = {};
  Object.keys(positionGroups).forEach((group) => {
    groupedRoster[group] = roster.filter((player) =>
      positionGroups[group].includes(player.position)
    );
  });

  return (
    <div className="space-y-6">
      {Object.keys(positionGroups).map((groupName) => {
        const groupPlayers = groupedRoster[groupName] || [];

        return (
          <div key={groupName} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Position Group Header */}
            <div
              className="psp-caption px-4 py-3 text-white"
              style={{
                background: sportMeta.color,
              }}
            >
              {groupName} ({groupPlayers.length})
            </div>

            {/* Players Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Player Name
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Position
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Class
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Height
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupPlayers.map((player, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--psp-navy)] font-medium">
                        {player.name}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {player.position}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 font-medium">
                        {player.class}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {player.height}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {player.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
