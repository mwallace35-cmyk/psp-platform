"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface FollowButtonProps {
  entityType: "school" | "player" | "sport";
  entityId: number;
  entityName?: string;
}

export default function FollowButton({
  entityType,
  entityId,
  entityName,
}: FollowButtonProps) {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    notify_scores: true,
    notify_articles: true,
    notify_recruiting: true,
    notify_milestones: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, [supabase.auth]);

  const handleToggleFollow = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          ...preferences,
        }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          if (isFollowing) {
            setShowPreferences(!showPreferences);
          } else {
            handleToggleFollow();
          }
        }}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: "2px solid",
          borderColor: isFollowing ? "var(--psp-gold)" : "#444",
          background: isFollowing
            ? "rgba(240, 165, 0, 0.1)"
            : "transparent",
          color: isFollowing ? "var(--psp-gold)" : "#aaa",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        title={
          isFollowing
            ? "Click to manage notifications"
            : "Click to follow"
        }
      >
        <span style={{ fontSize: "1.1rem" }}>
          {isFollowing ? "🔔" : "🫶"}
        </span>
        {isFollowing ? "Following" : "Follow"}
      </button>

      {/* Notification Preferences Popover */}
      {showPreferences && isFollowing && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "1rem",
            minWidth: "240px",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h4
            style={{
              margin: "0 0 0.75rem 0",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--psp-gold)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Notify Me About
          </h4>

          <div style={{ display: "grid", gap: "0.5rem" }}>
            {[
              {
                key: "notify_scores",
                label: "Game Scores",
              },
              {
                key: "notify_articles",
                label: "Articles",
              },
              {
                key: "notify_recruiting",
                label: "Recruiting News",
              },
              {
                key: "notify_milestones",
                label: "Stat Milestones",
              },
            ].map(({ key, label }) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  color: "#ccc",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    preferences[
                      key as keyof typeof preferences
                    ]
                  }
                  onChange={(e) => {
                    setPreferences((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }));
                  }}
                  style={{
                    cursor: "pointer",
                    accentColor:
                      "var(--psp-gold)",
                  }}
                />
                {label}
              </label>
            ))}
          </div>

          <button
            onClick={handleToggleFollow}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#222",
              color: "#ccc",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.borderColor =
                "var(--psp-gold)";
              (e.currentTarget as any).style.color =
                "var(--psp-gold)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.borderColor =
                "#444";
              (e.currentTarget as any).style.color = "#ccc";
            }}
          >
            Unfollow
          </button>

          <button
            onClick={() => setShowPreferences(false)}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "none",
              background: "transparent",
              color: "#999",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
