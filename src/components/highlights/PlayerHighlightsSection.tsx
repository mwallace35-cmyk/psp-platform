import Link from 'next/link';
import { getPlayerHighlights, getFeaturedHighlight } from '@/lib/data/highlights';
import HudlEmbed from './HudlEmbed';

interface PlayerHighlightsSectionProps {
  playerId: number;
  playerName: string;
  hudlProfileUrl?: string | null;
}

export default async function PlayerHighlightsSection({
  playerId,
  playerName,
  hudlProfileUrl,
}: PlayerHighlightsSectionProps) {
  const [highlights, featuredHighlight] = await Promise.all([
    getPlayerHighlights(playerId),
    getFeaturedHighlight(playerId),
  ]);

  // Show nothing if no highlights and no Hudl profile
  if (highlights.length === 0 && !hudlProfileUrl) {
    return null;
  }

  // Empty state
  if (highlights.length === 0) {
    return (
      <section className="py-8 border-t border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 font-heading flex items-center gap-2">
          <span>🎬</span> Highlights
        </h2>
        <div className="bg-[var(--psp-navy)] rounded-lg border border-gray-700 p-8 text-center">
          <p className="text-gray-300 mb-4">No highlights available yet</p>
          {hudlProfileUrl && (
            <a
              href={hudlProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-[var(--psp-gold)] text-black font-semibold rounded-lg hover:bg-[var(--psp-gold)]/80 transition-colors"
            >
              View Full Highlights on Hudl →
            </a>
          )}
        </div>
      </section>
    );
  }

  const additionalHighlights = highlights.filter(
    (h) => !featuredHighlight || h.id !== featuredHighlight.id
  );

  return (
    <section className="py-8 border-t border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 font-heading flex items-center gap-2">
        <span>🎬</span> Highlights
      </h2>

      {/* Featured highlight */}
      {featuredHighlight && (
        <div className="mb-8">
          <HudlEmbed
            hudlUrl={featuredHighlight.hudl_url}
            title={featuredHighlight.title || `${playerName} Highlights`}
            playerName={playerName}
            size="lg"
          />
        </div>
      )}

      {/* Additional highlights - horizontal scrollable */}
      {additionalHighlights.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
            More Highlights ({additionalHighlights.length})
          </h3>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-4 min-w-min">
              {additionalHighlights.slice(0, 6).map((highlight) => (
                <div key={highlight.id} className="flex-shrink-0 w-64">
                  <HudlEmbed
                    hudlUrl={highlight.hudl_url}
                    title={highlight.title}
                    playerName={playerName}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Link to full Hudl profile */}
      {hudlProfileUrl && (
        <div className="mt-6 text-center">
          <a
            href={hudlProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--psp-blue)] hover:underline text-sm font-semibold"
          >
            View complete Hudl profile →
          </a>
        </div>
      )}
    </section>
  );
}
