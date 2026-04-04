export default function EventHero() {
  return (
    <section
      className="relative overflow-hidden px-4 py-10 md:py-14"
      style={{ background: "var(--psp-navy)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 80%, rgba(240,165,0,0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 85% 20%, rgba(59,130,246,0.04) 0%, transparent 50%)",
        }}
      />
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <h1
          className="text-white mb-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 3.8rem)",
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          COMMUNITY{" "}
          <span style={{ color: "var(--psp-gold)" }}>EVENTS</span>
        </h1>
        <p
          className="text-lg max-w-xl"
          style={{ color: "var(--psp-gray-400, #94a3b8)" }}
        >
          Camps, clinics, showcases, award ceremonies, and more across
          Philadelphia high school sports.
        </p>
      </div>
    </section>
  );
}
