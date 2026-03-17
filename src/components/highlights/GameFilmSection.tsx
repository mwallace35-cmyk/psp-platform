import { getGameHighlights } from '@/lib/data/highlights';
import { getGameById } from '@/lib/data';
import HudlEmbed from './HudlEmbed';

interface GameFilmSectionProps {
  gameId: number;
  sportSlug: string;
}

export default async function GameFilmSection({
  gameId,
  sportSlug,
}: GameFilmSectionProps) {
  const [highlights, game] = await Promise.all([
    getGameHighlights(gameId),
    getGameById(gameId),
  ]);

  // Only show if highlights exist
  if (highlights.length === 0) {
    return null;
  }

  const displayHighlights = highlights.slice(0, 6);

  return (
    <section className="py-8 border-t border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 font-heading flex items-center gap-2">
        <span>🎥</span> Game Film
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayHighlights.map((highlight) => {
          // Use highlight title as the display name
          const playerName = highlight.title || 'Game Highlight';

          return (
            <div key={highlight.id} className="flex flex-col">
              <HudlEmbed
                hudlUrl={highlight.hudl_url}
                title={highlight.title}
                playerName={playerName}
                size="sm"
                className="mb-3"
              />
              <div className="flex-1 flex flex-col justify-end">
                <div className="bg-[var(--psp-navy-mid)] rounded-lg p-3 border border-gray-700">
                  <div className="text-sm font-semibold text-white mb-1">
                    {playerName}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {highlights.length > 6 && (
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            +{highlights.length - 6} more highlights available
          </p>
        </div>
      )}
    </section>
  );
}
