"use client";

import type { Metadata } from "next";
import { useState, type FormEvent } from "react";

const SPORTS = [
  { emoji: "\uD83C\uDFC8", name: "Football", color: "#16a34a" },
  { emoji: "\uD83C\uDFC0", name: "Basketball", color: "#3b82f6" },
  { emoji: "\u26BE", name: "Baseball", color: "#dc2626" },
  { emoji: "\uD83C\uDFC3", name: "Track & Field", color: "#7c3aed" },
  { emoji: "\uD83E\uDD4D", name: "Lacrosse", color: "#0891b2" },
  { emoji: "\uD83E\uDD3C", name: "Wrestling", color: "#ca8a04" },
  { emoji: "\u26BD", name: "Soccer", color: "#059669" },
];

const STATS = [
  { value: "17,800+", label: "Players" },
  { value: "400+", label: "Schools" },
  { value: "25", label: "Years of Data" },
  { value: "72", label: "Pro Alumni" },
];

const FEATURES = [
  {
    icon: "\uD83D\uDCCA",
    title: "Complete Sports Database",
    description:
      "Every stat, every game, every player. The most comprehensive Philly high school sports archive ever assembled.",
  },
  {
    icon: "\uD83C\uDFAF",
    title: "Live Scores & Coverage",
    description:
      "Real-time game scores, weekly rankings, Player of the Week voting, and in-depth editorial coverage.",
  },
  {
    icon: "\uD83C\uDF1F",
    title: "Recruiting Intel",
    description:
      "Track top prospects, D1 commitments, and scouting reports. Built for coaches, parents, and scouts.",
  },
];

function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/preview-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        setError("Incorrect password");
        setPassword("");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUnlock} style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      <input
        type="password"
        placeholder="Site password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          fontSize: 14,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          outline: "none",
          width: 180,
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "1px solid rgba(240,165,0,0.4)",
          background: "transparent",
          color: "#f0a500",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {loading ? "..." : "Enter Site"}
      </button>
      {error && <div style={{ width: "100%", textAlign: "center", color: "#f87171", fontSize: 12, marginTop: 4 }}>{error}</div>}
    </form>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/coming-soon-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You\u2019re on the list! We\u2019ll let you know when we launch.");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 480 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: 15,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 15,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "14px 28px",
              borderRadius: 8,
              border: "none",
              background: status === "success" ? "#10b981" : "#f0a500",
              color: status === "success" ? "#fff" : "#0a1628",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              cursor: status === "loading" ? "wait" : "pointer",
              whiteSpace: "nowrap",
              opacity: status === "loading" ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {status === "loading"
              ? "Sending..."
              : status === "success"
              ? "\u2713 Done"
              : "Get Notified"}
          </button>
        </div>
      </div>
      {message && (
        <p
          style={{
            marginTop: 12,
            fontSize: 13,
            color: status === "success" ? "#10b981" : "#f87171",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default function ComingSoonPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #0f2040 40%, #1a2d4a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
        color: "#fff",
        padding: "48px 24px",
        textAlign: "center",
        overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          PHILLY<span style={{ color: "#f0a500" }}>SPORTS</span>PACK
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#f0a500",
          }}
        >
          Philadelphia High School Sports Database
        </div>
      </div>

      {/* Sport Icons */}
      <div
        style={{
          display: "flex",
          gap: 14,
          marginBottom: 48,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {SPORTS.map((sport) => (
          <div
            key={sport.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `${sport.color}18`,
              border: `2px solid ${sport.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              transition: "transform 0.2s ease",
            }}
            title={sport.name}
          >
            {sport.emoji}
          </div>
        ))}
      </div>

      {/* Main Headline */}
      <h1
        style={{
          fontSize: "clamp(36px, 8vw, 56px)",
          fontFamily: "'Bebas Neue', sans-serif",
          fontWeight: 800,
          lineHeight: 1.05,
          marginBottom: 20,
          maxWidth: 640,
        }}
      >
        Something Big
        <br />
        Is Coming
      </h1>

      <p
        style={{
          fontSize: 17,
          color: "rgba(255,255,255,0.6)",
          maxWidth: 560,
          lineHeight: 1.65,
          marginBottom: 48,
        }}
      >
        The most comprehensive Philadelphia high school sports database ever built.
        Every stat. Every champion. Every player. Decades of history &mdash; all in one
        place.
      </p>

      {/* Stats Strip */}
      <div
        style={{
          display: "flex",
          gap: 40,
          marginBottom: 56,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {STATS.map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#f0a500",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Preview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          maxWidth: 900,
          width: "100%",
          marginBottom: 56,
        }}
      >
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "28px 24px",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{feature.icon}</div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                color: "#fff",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Email Signup */}
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Be the First to Know
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.45)",
            marginBottom: 20,
          }}
        >
          Get notified the moment we launch. No spam, just Philly sports.
        </p>
        <SignupForm />
      </div>

      {/* Status Badge */}
      <div
        style={{
          background: "rgba(240,165,0,0.1)",
          border: "1px solid rgba(240,165,0,0.3)",
          borderRadius: 8,
          padding: "14px 32px",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
              display: "inline-block",
              animation: "pulse 2s ease infinite",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#f0a500" }}>
            Launching Spring 2026
          </span>
        </div>
      </div>

      {/* Social Links */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 32,
          alignItems: "center",
        }}
      >
        <a
          href="https://twitter.com/PhillySportsPk"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.2s",
          }}
          aria-label="Follow us on X (Twitter)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @PhillySportsPk
        </a>
        <a
          href="https://instagram.com/phillysportspack"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.2s",
          }}
          aria-label="Follow us on Instagram"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          @phillysportspack
        </a>
      </div>

      {/* Password Gate — for authorized users */}
      <div
        style={{
          marginBottom: 32,
          padding: "20px 28px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>
          Authorized Access
        </div>
        <PasswordGate />
      </div>

      {/* Credit */}
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
        Data compiled by{" "}
        <strong style={{ color: "rgba(255,255,255,0.35)" }}>Ted Silary</strong>
        &nbsp;&mdash;&nbsp;Philadelphia&apos;s high school sports historian
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        input:focus {
          border-color: rgba(240,165,0,0.5) !important;
          background: rgba(255,255,255,0.08) !important;
        }
        a:hover {
          color: rgba(255,255,255,0.7) !important;
        }
      `}</style>
    </div>
  );
}
