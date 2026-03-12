"use client";

interface TeamStatsProps {
  team: {
    currentRecord: { wins: number; losses: number; ties: number };
    pointsFor: number;
    pointsAgainst: number;
  };
}

export default function TeamStats({ team }: TeamStatsProps) {
  const pointDiff = team.pointsFor - team.pointsAgainst;

  const stats = [
    { label: "Record", value: `${team.currentRecord.wins}-${team.currentRecord.losses}` },
    { label: "Points For", value: team.pointsFor },
    { label: "Points Against", value: team.pointsAgainst },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
        >
          Team Statistics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {stats.map((stat, idx) => (
                <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-2 font-medium" style={{ color: "var(--psp-navy)" }}>
                    {stat.label}
                  </td>
                  <td className="py-2 text-right">{stat.value}</td>
                </tr>
              ))}
              <tr className="border-b-0">
                <td className="py-2 font-medium" style={{ color: "var(--psp-navy)" }}>
                  Point Differential
                </td>
                <td
                  className="py-2 text-right font-bold"
                  style={{
                    color: pointDiff > 0 ? "#22c55e" : "#ef4444",
                  }}
                >
                  {pointDiff > 0 ? "+" : ""}{pointDiff}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
        >
          Statistical Leaders
        </h2>
        <div className="space-y-3">
          {[
            { name: "James Martinez", stat: "12 Passing TDs" },
            { name: "DeShawn Johnson", stat: "156 Rushing Yards" },
            { name: "Marcus White", stat: "8 Receiving Yards" },
          ].map((leader, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span style={{ color: "var(--psp-navy)" }}>{leader.name}</span>
              <span className="font-bold" style={{ color: "var(--psp-gold)" }}>
                {leader.stat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
