/**
 * SkeletonHero — Pulsing placeholder hero section.
 * 200px height, full width, dark navy with subtle pulse.
 */
export default function SkeletonHero({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse w-full bg-[var(--psp-navy-mid)] ${className}`}
      style={{ height: 200 }}
      role="status"
      aria-busy="true"
      aria-label="Loading hero section"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col justify-center h-full gap-4">
        {/* Title placeholder */}
        <div className="h-8 w-1/3 rounded bg-white/5" />
        {/* Subtitle placeholder */}
        <div className="h-4 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  );
}
