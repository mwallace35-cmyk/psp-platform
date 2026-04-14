interface ArticleStatsRibbonProps {
  playerName: string;
  accent: { bar: string; chip: string; tint: string };
  careerStats: { gp: number; rec: number; recYds: number; recTd: number };
}

export default function ArticleStatsRibbon({
  playerName,
  accent,
  careerStats,
}: ArticleStatsRibbonProps) {
  return (
    <section
      aria-label={`${playerName} career stats`}
      className="relative border-b"
      style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #0f2040 100%)',
        borderColor: 'rgba(245,235,214,0.08)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="flex items-stretch gap-4">
          {/* Accent bar + label */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-1 self-stretch rounded-full"
              style={{ background: accent.bar }}
              aria-hidden
            />
            <div>
              <p
                className="psp-caption"
                style={{ color: accent.bar, letterSpacing: '0.14em' }}
              >
                Career
              </p>
              <p
                className="text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: 'rgba(245,235,214,0.5)' }}
              >
                At Roman Catholic
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-4 gap-2 sm:gap-6">
            {[
              { label: 'REC', value: careerStats.rec },
              { label: 'YDS', value: careerStats.recYds.toLocaleString('en-US') },
              { label: 'TDs', value: careerStats.recTd },
              { label: 'GP', value: careerStats.gp || '\u2014' },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div
                  className="font-extrabold leading-none tabular-nums"
                  style={{
                    color: 'var(--psp-gold)',
                    fontFamily: "var(--font-display), 'Fraunces', serif",
                    fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.25rem)',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(245,235,214,0.6)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
