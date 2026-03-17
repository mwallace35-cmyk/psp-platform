"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
  entity_type: string | null;
  entity_id: number | null;
}

const TYPE_COLORS: Record<string, string> = {
  score_update: "#4ade80",
  article: "#3b82f6",
  recruiting: "#f59e0b",
  milestone: "#ec4899",
};

const TYPE_LABELS: Record<string, string> = {
  score_update: "Score Update",
  article: "Article",
  recruiting: "Recruiting",
  milestone: "Milestone",
};

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/notifications");
      } else {
        setUser(user);
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, [router, supabase.auth]);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const url = new URL("/api/notifications", window.location.origin);
        if (filteredType) {
          url.searchParams.set("type", filteredType);
        }

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to load notifications");

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadNotifications();
    }
  }, [user, filteredType]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const typeOptions = [
    "score_update",
    "article",
    "recruiting",
    "milestone",
  ];

  if (authLoading || loading) {
    return (
      <main id="main-content" className="flex-1 flex items-center justify-center min-h-screen">
        <p style={{ color: "#999" }}>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main id="main-content" className="flex-1 bg-gray-950 min-h-screen">
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "2rem 1rem",
          textAlign: "center",
          borderBottom: "3px solid var(--psp-gold)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "var(--font-bebas)",
            color: "white",
            margin: "0 0 0.5rem 0",
          }}
        >
          Notifications
        </h1>
        {unreadCount > 0 && (
          <p style={{ color: "#bbb", margin: 0 }}>
            {unreadCount} unread
          </p>
        )}
      </div>

      {/* Filters */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "1.5rem 1rem",
          borderBottom: "1px solid #333",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <button
            onClick={() => setFilteredType(null)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "2px solid",
              borderColor: !filteredType ? "var(--psp-gold)" : "#444",
              background: !filteredType
                ? "rgba(240, 165, 0, 0.2)"
                : "transparent",
              color: !filteredType ? "var(--psp-gold)" : "#aaa",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            All
          </button>

          {typeOptions.map((type) => (
            <button
              key={type}
              onClick={() => setFilteredType(type)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: "2px solid",
                borderColor: filteredType === type ? "var(--psp-gold)" : "#444",
                background: filteredType === type
                  ? "rgba(240, 165, 0, 0.2)"
                  : "transparent",
                color: filteredType === type ? "var(--psp-gold)" : "#aaa",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {TYPE_LABELS[type] || type}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
        }}
      >
        {notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#999",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              No notifications
            </p>
            <Link
              href="/"
              style={{
                color: "var(--psp-gold)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Back to Home →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {notifications.map((notif) => {
              const typeColor = TYPE_COLORS[notif.type] || "#999";
              const typeLabel = TYPE_LABELS[notif.type] || notif.type;
              const date = new Date(notif.created_at);
              const timeAgo = getTimeAgo(date);

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    handleMarkAsRead(notif.id);
                    if (notif.link) {
                      window.location.href = notif.link;
                    }
                  }}
                  style={{
                    background: notif.read
                      ? "#0f0f0f"
                      : "linear-gradient(135deg, rgba(240, 165, 0, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                    border: notif.read
                      ? "1px solid #333"
                      : "1px solid rgba(240, 165, 0, 0.3)",
                    borderRadius: "8px",
                    padding: "1rem",
                    cursor: notif.link ? "pointer" : "default",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (notif.link) {
                      (e.currentTarget as any).style.borderColor =
                        "rgba(240, 165, 0, 0.6)";
                      (e.currentTarget as any).style.background =
                        "rgba(240, 165, 0, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as any).style.borderColor = notif.read
                      ? "#333"
                      : "rgba(240, 165, 0, 0.3)";
                    (e.currentTarget as any).style.background = notif.read
                      ? "#0f0f0f"
                      : "linear-gradient(135deg, rgba(240, 165, 0, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: "0 0 0.25rem 0",
                          fontWeight: 600,
                          color: notif.read ? "#999" : "#ccc",
                          fontSize: "0.95rem",
                        }}
                      >
                        {notif.title}
                      </p>
                      {notif.body && (
                        <p
                          style={{
                            margin: "0 0 0.5rem 0",
                            color: "#999",
                            fontSize: "0.85rem",
                          }}
                        >
                          {notif.body}
                        </p>
                      )}
                    </div>
                    {!notif.read && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--psp-gold)",
                          flexShrink: 0,
                          marginTop: "0.5rem",
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        background: `${typeColor}20`,
                        color: typeColor,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {typeLabel}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#666",
                      }}
                    >
                      {timeAgo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
