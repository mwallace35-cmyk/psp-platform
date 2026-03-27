/**
 * NoteFromTed — displays Ted Silary's season commentary notes.
 * Server component. Navy card with gold left border, Bebas Neue header, DM Sans italic body.
 */

interface NoteFromTedProps {
  notes: string[];
  sourceUrl?: string | null;
}

export default function NoteFromTed({ notes, sourceUrl }: NoteFromTedProps) {
  if (!notes || notes.length === 0) return null;

  return (
    <div
      className="rounded-lg p-5 my-6"
      style={{
        background: 'var(--psp-navy-mid)',
        borderLeft: '4px solid var(--psp-gold)',
      }}
    >
      <h3
        className="font-heading text-lg tracking-wide mb-3"
        style={{ color: 'var(--psp-gold)', letterSpacing: '0.05em' }}
      >
        NOTE FROM TED SILARY
      </h3>

      <div className="space-y-2">
        {notes.map((note, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed"
            style={{
              color: 'rgba(255, 255, 255, 0.88)',
              fontStyle: 'italic',
              fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
            }}
          >
            {note}
          </p>
        ))}
      </div>

      <div
        className="mt-4 pt-3 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          — Ted Silary
        </span>
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--psp-gold-light)' }}
          >
            tedsilary.com
          </a>
        ) : (
          <a
            href="http://www.tedsilary.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--psp-gold-light)' }}
          >
            tedsilary.com
          </a>
        )}
      </div>
    </div>
  );
}
