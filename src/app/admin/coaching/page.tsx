"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, ToastContainer } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

interface CoachingStaff {
  id: number;
  coach_id: number;
  school_id: number;
  sport_id: string;
  start_year: number;
  end_year?: number;
  role: string;
  record_wins?: number;
  record_losses?: number;
  record_ties?: number;
  championships?: number;
  notes?: string;
  coaches?: { id: number; name: string };
  schools?: { id: number; name: string };
}

interface School {
  id: number;
  name: string;
}

interface Coach {
  id: number;
  name: string;
}

const SPORTS = ["football", "basketball", "baseball", "track-field", "soccer", "lacrosse", "wrestling"];
const ROLES = ["head_coach", "offensive_coordinator", "defensive_coordinator", "assistant_coach"];

export default function CoachingAdmin() {
  const [staffList, setStaffList] = useState<CoachingStaff[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolFilter, setSchoolFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    school_id: "",
    sport_id: "",
    coach_id: "",
    role: "head_coach",
    start_year: new Date().getFullYear(),
    end_year: "",
    record_wins: "",
    record_losses: "",
    record_ties: "",
    championships: "",
    notes: "",
  });

  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [schoolFilter, sportFilter]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [staffRes, schoolsRes, coachesRes] = await Promise.all([
        supabase
          .from("coaching_stints")
          .select(`
            *,
            coaches:coach_id(id, name),
            schools:school_id(id, name)
          `),
        supabase.from("schools").select("id, name").order("name"),
        supabase.from("coaches").select("id, name").order("name"),
      ]);

      if (staffRes.error) throw staffRes.error;
      if (schoolsRes.error) throw schoolsRes.error;
      if (coachesRes.error) throw coachesRes.error;

      setStaffList((staffRes.data || []) as CoachingStaff[]);
      setSchools((schoolsRes.data || []) as School[]);
      setCoaches((coachesRes.data || []) as Coach[]);
    } catch (err) {
      console.error("Error fetching data:", err);
      toastError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function filterStaff() {
    let filtered = staffList;
    if (schoolFilter) filtered = filtered.filter((s) => s.school_id === Number(schoolFilter));
    if (sportFilter) filtered = filtered.filter((s) => s.sport_id === sportFilter);
    return filtered;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.school_id || !formData.sport_id || !formData.coach_id) {
      toastError("Please fill in required fields");
      return;
    }

    try {
      const payload = {
        school_id: Number(formData.school_id),
        sport_id: formData.sport_id,
        coach_id: Number(formData.coach_id),
        role: formData.role,
        start_year: Number(formData.start_year),
        end_year: formData.end_year ? Number(formData.end_year) : null,
        record_wins: formData.record_wins ? Number(formData.record_wins) : null,
        record_losses: formData.record_losses ? Number(formData.record_losses) : null,
        record_ties: formData.record_ties ? Number(formData.record_ties) : null,
        championships: formData.championships ? Number(formData.championships) : null,
        notes: formData.notes || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("coaching_stints")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toastSuccess("Coaching staff updated!");
      } else {
        const { error } = await supabase.from("coaching_stints").insert([payload]);
        if (error) throw error;
        toastSuccess("Coaching staff added!");
      }

      resetForm();
      fetchAll();
    } catch (err) {
      console.error("Error saving coaching staff:", err);
      toastError("Failed to save coaching staff");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const { error } = await supabase.from("coaching_stints").delete().eq("id", id);
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
      school_id: "",
      sport_id: "",
      coach_id: "",
      role: "head_coach",
      start_year: new Date().getFullYear(),
      end_year: "",
      record_wins: "",
      record_losses: "",
      record_ties: "",
      championships: "",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(staff: CoachingStaff) {
    setFormData({
      school_id: String(staff.school_id),
      sport_id: staff.sport_id,
      coach_id: String(staff.coach_id),
      role: staff.role,
      start_year: staff.start_year,
      end_year: staff.end_year ? String(staff.end_year) : "",
      record_wins: staff.record_wins ? String(staff.record_wins) : "",
      record_losses: staff.record_losses ? String(staff.record_losses) : "",
      record_ties: staff.record_ties ? String(staff.record_ties) : "",
      championships: staff.championships ? String(staff.championships) : "",
      notes: staff.notes || "",
    });
    setEditingId(staff.id);
    setShowForm(true);
  }

  const filtered = filterStaff();

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
            Coaching Staff Management
          </h1>
          <p style={{ color: "var(--psp-gray-500)" }}>Manage coaches and coaching staff assignments</p>
        </div>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))} variant="primary">
          {showForm ? "Cancel" : "Add New Coach"}
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
              <label className="block text-sm font-semibold mb-2">School *</label>
              <select
                value={formData.school_id}
                onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              >
                <option value="">Select School</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Sport *</label>
              <select
                value={formData.sport_id}
                onChange={(e) => setFormData({ ...formData, sport_id: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              >
                <option value="">Select Sport</option>
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Coach *</label>
              <select
                value={formData.coach_id}
                onChange={(e) => setFormData({ ...formData, coach_id: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              >
                <option value="">Select Coach</option>
                {coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Start Year</label>
              <input
                type="number"
                value={formData.start_year}
                onChange={(e) => setFormData({ ...formData, start_year: Number(e.target.value) })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">End Year</label>
              <input
                type="number"
                value={formData.end_year}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
                placeholder="Leave blank if current"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Wins</label>
              <input
                type="number"
                value={formData.record_wins}
                onChange={(e) => setFormData({ ...formData, record_wins: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Losses</label>
              <input
                type="number"
                value={formData.record_losses}
                onChange={(e) => setFormData({ ...formData, record_losses: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Ties</label>
              <input
                type="number"
                value={formData.record_ties}
                onChange={(e) => setFormData({ ...formData, record_ties: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Championships</label>
              <input
                type="number"
                value={formData.championships}
                onChange={(e) => setFormData({ ...formData, championships: e.target.value })}
                className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border border-[var(--psp-gray-200)] rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              {editingId ? "Update Coach" : "Add Coach"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
          className="p-2 border border-[var(--psp-gray-200)] rounded-lg"
        >
          <option value="">All Schools</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="p-2 border border-[var(--psp-gray-200)] rounded-lg"
        >
          <option value="">All Sports</option>
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8" style={{ color: "var(--psp-gray-500)" }}>
          Loading...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Sport</th>
                <th>Coach</th>
                <th>Role</th>
                <th>Tenure</th>
                <th>Record</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((staff) => (
                <tr key={staff.id}>
                  <td className="font-medium">{staff.schools?.name || "—"}</td>
                  <td>{staff.sport_id}</td>
                  <td>{staff.coaches?.name || "—"}</td>
                  <td className="text-sm">{staff.role.replace(/_/g, " ")}</td>
                  <td className="text-sm">
                    {staff.start_year}
                    {staff.end_year ? `–${staff.end_year}` : "–Present"}
                  </td>
                  <td className="text-sm">
                    {staff.record_wins}
                    {staff.record_losses ? `–${staff.record_losses}` : ""}
                    {staff.record_ties ? `–${staff.record_ties}` : ""}
                  </td>
                  <td className="text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
