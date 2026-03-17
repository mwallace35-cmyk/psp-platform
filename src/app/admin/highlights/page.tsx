"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, ToastContainer } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

interface Highlight {
  id: number;
  player_id: number;
  hudl_url: string;
  title: string;
  sport_id: string;
  season_id?: number;
  game_id?: number;
  is_featured: boolean;
  created_at: string;
  players?: { id: number; name: string; slug: string };
}

interface Player {
  id: number;
  name: string;
  slug: string;
}

const SPORTS = ["football", "basketball", "baseball", "track-field", "soccer", "lacrosse", "wrestling"];

export default function HighlightsAdmin() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPlayer, setSearchPlayer] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    player_id: "",
    hudl_url: "",
    title: "",
    sport_id: "football",
    season_id: "",
    game_id: "",
    is_featured: false,
  });

  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [highlightsRes, playersRes] = await Promise.all([
        supabase
          .from("player_highlights")
          .select(`
            *,
            players:player_id(id, name, slug)
          `)
          .order("created_at", { ascending: false }),
        supabase.from("players").select("id, name, slug").order("name").limit(5000),
      ]);

      if (highlightsRes.error) throw highlightsRes.error;
      if (playersRes.error) throw playersRes.error;

      setHighlights((highlightsRes.data || []) as Highlight[]);
      setPlayers((playersRes.data || []) as Player[]);
    } catch (err) {
      console.error("Error fetching data:", err);
      toastError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function handlePlayerSearch(query: string) {
    setSearchPlayer(query);
    if (query.length > 1) {
      const filtered = players.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      if (filtered.length > 0) {
        setSelectedPlayer(filtered[0]);
        setFormData({ ...formData, player_id: String(filtered[0].id) });
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.player_id || !formData.hudl_url || !formData.title) {
      toastError("Please fill in required fields");
      return;
    }

    try {
      const payload = {
        player_id: Number(formData.player_id),
        hudl_url: formData.hudl_url,
        title: formData.title,
        sport_id: formData.sport_id,
        season_id: formData.season_id ? Number(formData.season_id) : null,
        game_id: formData.game_id ? Number(formData.game_id) : null,
        is_featured: formData.is_featured,
      };

      const { error } = await supabase.from("player_highlights").insert([payload]);
      if (error) throw error;

      toastSuccess("Highlight added!");
      resetForm();
      fetchAll();
    } catch (err) {
      console.error("Error saving highlight:", err);
      toastError("Failed to save highlight");
    }
  }

  async function handleToggleFeatured(id: number, current: boolean) {
    try {
      const { error } = await supabase
        .from("player_highlights")
        .update({ is_featured: !current })
        .eq("id", id);

      if (error) throw error;
      toastSuccess("Updated!");
      fetchAll();
    } catch (err) {
      console.error("Error updating:", err);
      toastError("Failed to update");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this highlight?")) return;

    try {
      const { error } = await supabase.from("player_highlights").delete().eq("id", id);
      if (error) throw error;
      toastSuccess("Deleted!");
      fetchAll();
    } catch (err) {
      console.error("Error deleting:", err);
      toastError("Failed to delete");
    }
  }

  function resetForm() {
    setFormData({
      player_id: "",
      hudl_url: "",
      title: "",
      sport_id: "football",
      season_id: "",
      game_id: "",
      is_featured: false,
    });
    setSelectedPlayer(null);
    setSearchPlayer("");
    setShowForm(false);
  }

  const playerHighlights = selectedPlayer
    ? highlights.filter((h) => h.player_id === selectedPlayer.id)
    : highlights;

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
            Highlights Management
          </h1>
          <p style={{ color: "var(--psp-gray-500)" }}>Manage player Hudl highlights</p>
        </div>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))} variant="primary">
          {showForm ? "Cancel" : "Add Highlight"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Player *</label>
              <input
                type="text"
                placeholder="Search player..."
                value={searchPlayer}
                onChange={(e) => handlePlayerSearch(e.target.value)}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
              {selectedPlayer && (
                <p className="text-sm mt-2" style={{ color: "var(--psp-gray-600)" }}>
                  Selected: {selectedPlayer.name}
                </p>
              )}
            </div>

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

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Hudl URL *</label>
              <input
                type="url"
                value={formData.hudl_url}
                onChange={(e) => setFormData({ ...formData, hudl_url: e.target.value })}
                placeholder="https://www.hudl.com/..."
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Senior Highlights 2024"
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Season ID</label>
              <input
                type="number"
                value={formData.season_id}
                onChange={(e) => setFormData({ ...formData, season_id: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Game ID</label>
              <input
                type="number"
                value={formData.game_id}
                onChange={(e) => setFormData({ ...formData, game_id: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 mr-2"
              />
              <label className="text-sm font-semibold">Featured</label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              Add Highlight
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Player Search */}
      <div>
        <label className="block text-sm font-semibold mb-2">Filter by Player</label>
        <input
          type="text"
          placeholder="Search player..."
          onChange={(e) => {
            const filtered = players.filter((p) =>
              p.name.toLowerCase().includes(e.target.value.toLowerCase())
            );
            if (filtered.length > 0) setSelectedPlayer(filtered[0]);
          }}
          className="p-2 border border-[var(--psp-gray-200)] rounded-lg w-full md:w-64"
        />
      </div>

      {/* Highlights List */}
      {loading ? (
        <div className="text-center py-8" style={{ color: "var(--psp-gray-500)" }}>
          Loading...
        </div>
      ) : playerHighlights.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center" style={{ color: "var(--psp-gray-500)" }}>
          No highlights found.
        </div>
      ) : (
        <div className="space-y-3">
          {playerHighlights.map((highlight) => (
            <div
              key={highlight.id}
              className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium" style={{ color: "var(--psp-navy)" }}>
                  {highlight.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                  {highlight.players?.name} • {highlight.sport_id}
                  {highlight.is_featured && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-900 font-semibold">
                      Featured
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleFeatured(highlight.id, highlight.is_featured)}
                  variant="outline"
                  size="sm"
                >
                  {highlight.is_featured ? "Unfeature" : "Feature"}
                </Button>
                <Button
                  onClick={() => handleDelete(highlight.id)}
                  variant="outline"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
