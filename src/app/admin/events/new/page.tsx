"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, ToastContainer } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { VALID_SPORTS, SPORT_META } from "@/lib/sports";

const EVENT_TYPES = [
  { value: "camp", label: "Camp" },
  { value: "clinic", label: "Clinic" },
  { value: "combine", label: "Combine" },
  { value: "showcase", label: "Showcase" },
  { value: "tournament", label: "Tournament" },
  { value: "award-ceremony", label: "Award Ceremony" },
  { value: "tryout", label: "Tryout" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "meeting", label: "Meeting" },
  { value: "other", label: "Other" },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 200);
}

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    event_type: "camp",
    description: "",
    sport_id: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location_name: "",
    location_address: "",
    is_free: true,
    cost_info: "",
    registration_url: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    organizer: "",
    is_featured: false,
    tags: "",
  });

  function updateForm(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(publish: boolean) {
    if (!form.title.trim()) {
      toastError("Title is required");
      return;
    }
    if (!form.start_date) {
      toastError("Start date is required");
      return;
    }

    setSaving(true);
    try {
      const slug = generateSlug(form.title) + "-" + new Date().getFullYear();
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { error } = await supabase.from("community_events").insert({
        slug,
        title: form.title.trim(),
        event_type: form.event_type,
        description: form.description.trim() || null,
        sport_id: form.sport_id || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        location_name: form.location_name.trim() || null,
        location_address: form.location_address.trim() || null,
        is_free: form.is_free,
        cost_info: form.is_free ? "Free" : form.cost_info.trim() || null,
        registration_url: form.registration_url.trim() || null,
        contact_name: form.contact_name.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        organizer: form.organizer.trim() || null,
        is_featured: form.is_featured,
        status: publish ? "published" : "draft",
        tags: tagsArray,
      });

      if (error) throw error;

      toastSuccess(`Event ${publish ? "published" : "saved as draft"}!`);
      router.push("/admin/events");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error saving event:", err);
      toastError("Error saving event. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts.map((t) => ({ ...t, onClose: removeToast }))} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--psp-navy)" }}>
          New Event
        </h1>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          {/* Title */}
          <Field label="Event Title *">
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="e.g. PCL Spring Football Combine"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            />
          </Field>

          {/* Type + Sport row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Event Type *">
              <select
                value={form.event_type}
                onChange={(e) => updateForm("event_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Sport (optional)">
              <select
                value={form.sport_id}
                onChange={(e) => updateForm("sport_id", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
              >
                <option value="">All Sports / Multi-Sport</option>
                {VALID_SPORTS.map((s) => (
                  <option key={s} value={s}>{SPORT_META[s].name}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Date/Time row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Start Date *">
              <input type="date" value={form.start_date} onChange={(e) => updateForm("start_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
            <Field label="End Date">
              <input type="date" value={form.end_date} onChange={(e) => updateForm("end_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
            <Field label="Start Time">
              <input type="time" value={form.start_time} onChange={(e) => updateForm("start_time", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
            <Field label="End Time">
              <input type="time" value={form.end_time} onChange={(e) => updateForm("end_time", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Venue Name">
              <input type="text" value={form.location_name} onChange={(e) => updateForm("location_name", e.target.value)}
                placeholder="e.g. Cardinal O'Hara High School"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
            <Field label="Address">
              <input type="text" value={form.location_address} onChange={(e) => updateForm("location_address", e.target.value)}
                placeholder="1701 S Sproul Rd, Springfield, PA 19064"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={5}
              placeholder="What should attendees know about this event?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-y"
            />
          </Field>

          {/* Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Field label="Cost">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_free}
                    onChange={(e) => updateForm("is_free", e.target.checked)}
                    className="rounded"
                  />
                  Free event
                </label>
              </div>
              {!form.is_free && (
                <input type="text" value={form.cost_info} onChange={(e) => updateForm("cost_info", e.target.value)}
                  placeholder="e.g. $25/player or $200/team"
                  className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              )}
            </Field>
            <Field label="Registration URL">
              <input type="url" value={form.registration_url} onChange={(e) => updateForm("registration_url", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
          </div>

          {/* Organizer + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Organizer">
              <input type="text" value={form.organizer} onChange={(e) => updateForm("organizer", e.target.value)}
                placeholder="e.g. Philadelphia Catholic League"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
            <Field label="Contact Name">
              <input type="text" value={form.contact_name} onChange={(e) => updateForm("contact_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
            <Field label="Contact Email">
              <input type="email" value={form.contact_email} onChange={(e) => updateForm("contact_email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
          </div>

          {/* Tags + Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Field label="Tags (comma-separated)">
              <input type="text" value={form.tags} onChange={(e) => updateForm("tags", e.target.value)}
                placeholder="youth, varsity, combine, free"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </Field>
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => updateForm("is_featured", e.target.checked)}
                  className="rounded"
                />
                <span className="font-medium">Feature this event</span>
                <span className="text-xs text-gray-400">(shows in featured strip)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button onClick={() => handleSave(true)} disabled={saving}>
              {saving ? "Saving..." : "Publish"}
            </Button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => router.push("/admin/events")}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
