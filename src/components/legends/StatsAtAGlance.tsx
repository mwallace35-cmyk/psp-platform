"use client";

import { useEffect, useRef, useState } from "react";
import type { StatAtAGlance } from "@/content/legends-schema";

interface Props {
  stats: StatAtAGlance[];
  className?: string;
}

/**
 * A 4-6 column strip of big numbers that animate-count when scrolled into
 * view. Used directly under the hero to hit the reader with the headline
 * numbers before they start reading prose.
 *
 * Respects prefers-reduced-motion — when set, values render immediately
 * without the count-up.
 */
export default function StatsAtAGlance({ stats, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!stats || stats.length === 0) return null;

  return (
    <section
      ref={ref}
      aria-label="Career highlights at a glance"
      className={`bg-[var(--psp-navy)] text-white ${className}`}
    >
      <div
        className="max-w-7xl mx-auto px-4 py-8 grid gap-4"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${
            stats.length > 4 ? "140px" : "180px"
          }, 1fr))`,
        }}
      >
        {stats.map((s, i) => (
          <Stat key={`${s.label}-${i}`} stat={s} animateNow={visible} />
        ))}
      </div>
    </section>
  );
}

function Stat({
  stat,
  animateNow,
}: {
  stat: StatAtAGlance;
  animateNow: boolean;
}) {
  const numericTarget =
    typeof stat.value === "number"
      ? stat.value
      : Number.isFinite(Number(stat.value))
        ? Number(stat.value)
        : null;

  const [displayValue, setDisplayValue] = useState<string>(
    numericTarget !== null ? "0" : String(stat.value),
  );

  useEffect(() => {
    if (numericTarget === null) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!animateNow || prefersReduced) {
      setDisplayValue(String(numericTarget));
      return;
    }

    const durationMs = 1100;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(eased * numericTarget);
      setDisplayValue(String(current));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animateNow, numericTarget]);

  return (
    <div className="text-center">
      <div className="font-heading text-4xl md:text-5xl text-[var(--psp-gold)] tabular-nums">
        {stat.prefix}
        {displayValue}
        {stat.suffix}
      </div>
      <div className="mt-1 text-[11px] md:text-xs uppercase tracking-wider text-white/60">
        {stat.label}
      </div>
    </div>
  );
}
