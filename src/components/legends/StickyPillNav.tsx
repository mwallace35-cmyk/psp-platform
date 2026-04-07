"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PillSection {
  id: string;
  label: string;
}

interface Props {
  sections: PillSection[];
  className?: string;
}

/**
 * Sticky pill navigation bar that appears beneath the hero after scroll
 * and follows the reader down the page.
 *
 *  - Each pill jumps to a section id on click (smooth scroll).
 *  - Current section is highlighted automatically via IntersectionObserver.
 *  - A reading-progress bar under the pills fills as the reader scrolls
 *    through the document.
 *  - On mobile (<768px) the pill bar collapses to a horizontal scroller.
 *  - Respects prefers-reduced-motion for scroll behavior.
 */
export default function StickyPillNav({ sections, className = "" }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Observe sections to update active pill as reader scrolls
  useEffect(() => {
    if (sections.length === 0) return;
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the entry whose top is closest to the top of the viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);

  // Reading progress bar based on document scroll
  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, scrollTop / total)) : 0;
      setProgress(p);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Keep the active pill scrolled into view within the horizontal scroller
  useEffect(() => {
    const pill = pillRefs.current.get(activeId);
    const scroller = scrollerRef.current;
    if (!pill || !scroller) return;
    const pillRect = pill.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    if (
      pillRect.left < scrollerRect.left ||
      pillRect.right > scrollerRect.right
    ) {
      pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeId]);

  const onPillClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({
        top,
        behavior: prefersReduced ? "auto" : "smooth",
      });
      setActiveId(id);
      history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Jump to section"
      className={`sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[var(--psp-gray-200)] ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={scrollerRef}
          className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-none"
          role="tablist"
        >
          {sections.map((s) => {
            const active = s.id === activeId;
            return (
              <a
                key={s.id}
                ref={(node) => {
                  if (node) pillRefs.current.set(s.id, node);
                  else pillRefs.current.delete(s.id);
                }}
                role="tab"
                aria-selected={active}
                aria-current={active ? "location" : undefined}
                href={`#${s.id}`}
                onClick={(e) => onPillClick(e, s.id)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-1.5 text-sm font-semibold rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 ${
                  active
                    ? "bg-[var(--psp-navy)] text-white"
                    : "text-[var(--psp-gray-600)] hover:bg-[var(--psp-gray-100)]"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
      {/* Reading progress bar */}
      <div
        className="h-[3px] bg-[var(--psp-gray-100)]"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[var(--psp-gold)] transition-[width] duration-100 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </nav>
  );
}
