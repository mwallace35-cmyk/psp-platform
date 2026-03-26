import Link from 'next/link';

/* ─── Types ─── */
export interface WeekendRecap {
  id: number;
  player_name: string;
  team: string | null;
  sport: string;
  stat_line: string;
  result: string | null;
  game_date: string;
  week_label: string | null;
}

interface Props {
  recaps: WeekendRecap[];
}

/* ─── Sport icon lookup ─── */
const SPORT_ICON: Record<string, string> = {
  NFL: '\uD83C\uDFC8',
  NBA: '\uD83C\uDFC0',
  MLB: '\u26BE',
};

/* ─── Parse W/L from result string ─── */
function parseResult(result: string | null): { outcome: 'W' | 'L' | null; display: string } {
  if (!result) return { outcome: null, display: '' };
  const trimmed = result.trim();
  if (trimmed.startsWith('W')) return { outcome: 'W', display: trimmed };
  if (trimmed.startsWith('L')) return { outcome: 'L', display: trimmed };
  return { outcome: null, display: trimmed };
}

export default function ThisWeekendCard({ recaps }: Props) {
  if (recaps.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#0a1628] px-5 py-3 flex items-center gap-2">
          <span className="text-[#f0a500] text-lg">{'\uD83D\uDCC5'}</span>
          <h3 className="psp-caption text-white tracking-wider text-xs">THIS WEEKEND</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#0a1628]/5 flex items-center justify-center mb-3">
              <span className="text-2xl">{'\uD83C\uDFC6'}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">No recaps yet</p>
            <p className="text-xs text-gray-400 max-w-[200px]">
              Weekend highlights will appear here once games are played
            </p>
          </div>
        </div>
      </div>
    );
  }

  const weekLabel = recaps[0]?.week_label ?? 'This Weekend';

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0a1628] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#f0a500] text-lg">{'\uD83D\uDCC5'}</span>
          <h3 className="psp-caption text-white tracking-wider text-xs">THIS WEEKEND</h3>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {weekLabel}
        </span>
      </div>

      {/* Player lines */}
      <div className="divide-y divide-gray-100">
        {recaps.map((recap) => {
          const { outcome, display } = parseResult(recap.result);
          const icon = SPORT_ICON[recap.sport] ?? '\uD83C\uDFC5';

          return (
            <div key={recap.id} className="px-4 py-3 hover:bg-gray-50/80 transition-colors">
              <div className="flex items-start gap-3">
                {/* Sport icon */}
                <span className="text-sm mt-0.5 shrink-0">{icon}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-[#0a1628] truncate">
                      {recap.player_name}
                    </span>
                    {outcome && (
                      <span
                        className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-black ${
                          outcome === 'W'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {outcome}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mb-0.5">
                    {recap.team}
                    {display ? ` \u2014 ${display}` : ''}
                  </p>
                  <p className="text-xs font-medium text-[#0a1628]/70">
                    {recap.stat_line}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <Link
          href="/our-guys"
          className="text-xs font-semibold text-[#f0a500] hover:text-[#f5c542] transition-colors"
        >
          See all recaps &rarr;
        </Link>
      </div>
    </div>
  );
}
