export default function EventHero() {
  return (
    <section
      className="relative overflow-hidden px-4 pt-12 pb-10 md:pt-16 md:pb-12"
      style={{ background: "var(--psp-navy)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 80%, rgba(240,165,0,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 85% 20%, rgba(59,130,246,0.05) 0%, transparent 50%)",
        }}
      />
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Eyebrow */}
        <p
          className="text-[0.7rem] font-bold tracking-[0.15em] uppercase mb-3"
          style={{ color: "var(--psp-gold)" }}
        >
          Philly HS Sports
        </p>
        <h1
          className="text-white mb-3"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.8rem, 7vw, 4.5rem)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
          }}
        >
          COMMUNITY{" "}
          <span style={{ color: "var(--psp-gold)" }}>EVENTS</span>
        </h1>
        <p
          className="text-base md:text-lg max-w-lg leading-relaxed"
          style={{ color: "var(--psp-gray-300, #cbd5e1)" }}
        >
          Camps, clinics, showcases, award ceremonies, and more across
          Philadelphia high school sports.
        </p>
      </div>
    </section>
  );
}
