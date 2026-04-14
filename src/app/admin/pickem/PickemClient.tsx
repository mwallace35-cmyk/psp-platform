"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, ToastContainer } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

interface PickemWeek {
  id: number;
  sport_id: string;
  season_id: number;
  week_number: number;
  title: string;
  status: string;
  opens_at: string;
  closes_at: string | null;
  created_at: string;
}

interface Game {
  id: number;
  home_school_id: number;
  away_school_id: number;
  final_home_score?: number;
  final_away_score?: number;
  home_school?: { id: number; name: string } | null;
  away_school?: { id: number; name: string } | null;
}

interface PickemClientProps {
  initialWeeks: PickemWeek[];
  initialGames: Game[];
}

const SPORTS = ["football", "basketball", "baseball", "track-field", "soccer", "lacrosse", "wrestling"];

export default function PickemClient({ initialWeeks, initialGames }: PickemClientProps) {
  const router = useRouter();
  const [weeks, setWeeks] = useState<PickemWeek[]>(initialWeeks);
  const [games, setGames] = useState<Game[]>(initialGames);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    sport_id: "football",
    season_id: "",
    week_number: "",
    title: "",
  });

  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  async function fetchAll() {
    setLoading(true);
    try {
      const [weeksRes, gamesRes] = await Promise.all([
        supabase
          .from("pickem_weeks")
          .select("*")
          .order("opens_at", { ascending: false }),
        supabase
          .from("pickem_games")
          .select(`
            *,
            home_school:schools!pickem_games_home_school_id_fkey(id, name),
            away_school:schools!pickem_games_away_school_id_fkey(id, name)
          `)
          .order("created_at", { ascending: false }),
      ]);

      if (weeksRes.error) throw weeksRes.error;
      if (gamesRes.error) throw gamesRes.error;

      setWeeks((weeksRes.data || []) as PickemWeek[]);
      setGames((gamesRes.data || []) as Game[]);
    } catch (err) {
      console.error("Error fetching data:", err);
      toastError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateWeek(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.sport_id || !formData.season_id || !formData.week_number || !formData.title) {
      toastError("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("pickem_weeks").insert([
        {
          sport_id: formData.sport_id,
          season_id: Number(formData.season_id),
          week_number: Number(formData.week_number),
          title: formData.title,
          status: "open",
          opens_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toastSuccess("Week created!");
      setFormData({ sport_id: "football", season_id: "", week_number: "", title: "" });
      setShowForm(false);
      await fetchAll();
      router.refresh();
    } catch (err) {
      console.error("Error creating week:", err);
      toastError("Failed to create week");
    }
  }

  async function handleToggleOpen(id: number, current: string) {
    const isOpen = current === "open";
    try {
      const { error } = await supabase
        .from("pickem_weeks")
        .update({ status: isOpen ? "closed" : "open", closes_at: isOpen ? new Date().toISOString() : null })
        .eq("id", id);

      if (error) throw error;
      toastSuccess("Updated!");
      await fetchAll();
      router.refresh();
    } catch (err) {
      console.error("Error updating:", err);
      toastError("Failed to update");
    }
  }

  async function handleDeleteWeek(id: number) {
    if (!confirm("Delete this week and all associated picks?")) return;

    try {
      const { error } = await supabase.from("pickem_weeks").delete().eq("id", id);
      if (error) throw error;
      toastSuccess("Deleted!");
      await fetchAll();
      router.refresh();
    } catch (err) {
      console.error("Error deleting:", err);
      toastError("Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
            Pick&apos;em Management
          </h1>
          <p style={{ color: "var(--psp-gray-500)" }}>Create and manage pick&apos;em weeks</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? "Cancel" : "Create Week"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleCreateWeek}
          className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Sport *</label>
              <select
                value={formData.sport_id}
                onChange={(e) => setFormData({ ...formData, sport_id: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Season ID *</label>
              <input
                type="number"
                value={formData.season_id}
                onChange={(e) => setFormData({ ...formData, season_id: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Week Number *</label>
              <input
                type="number"
                value={formData.week_number}
                onChange={(e) => setFormData({ ...formData, week_number: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Week 1: Week of Sept 1"
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              Create Week
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Weeks List */}
      {loading ? (
        <div className="text-center py-8" style={{ color: "var(--psp-gray-500)" }}>
          Loading...
        </div>
      ) : weeks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center" style={{ color: "var(--psp-gray-500)" }}>
          No pick&apos;em weeks yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {weeks.map((week) => (
            <div
              key={week.id}
              className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3
                    className="text-lg font-bold font-bebas"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    {week.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                    {week.sport_id} • Season {week.season_id} • Week {week.week_number}
                    {week.status === "open" ? (
                      <span className="ml-2 px-2 py-0.5 rounded text-xs bg-green-100 text-green-900 font-semibold">
                        Open
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-900 font-semibold">
                        Closed
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleToggleOpen(week.id, week.status)}
                    variant="outline"
                    size="sm"
                  >
                    {week.status === "open" ? "Close" : "Open"}
                  </Button>
                  <Button
                    onClick={() => handleDeleteWeek(week.id)}
                    variant="outline"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Games for this week */}
              <div className="mt-4 pt-4 border-t border-[var(--psp-gray-200)]">
                <h2 className="text-sm font-semibold mb-3">Games in this week</h2>
                <div className="space-y-2">
                  {games.filter((g) => g.id).slice(0, 5).map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                    >
                      <span>Game {game.id}</span>
                      {game.final_home_score && game.final_away_score && (
                        <span style={{ color: "var(--psp-gold)" }} className="font-medium">
                          {game.final_home_score}–{game.final_away_score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
