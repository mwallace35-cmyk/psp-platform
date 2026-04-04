import { cache } from "react";
import { createClient, withErrorHandling } from "./common";

export interface CommunityEvent {
  id: number;
  slug: string;
  title: string;
  event_type: string;
  description: string | null;
  sport_id: string | null;
  school_id: number | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  location_address: string | null;
  is_free: boolean;
  cost_info: string | null;
  registration_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  organizer: string | null;
  is_featured: boolean;
  status: string;
  tags: string[];
  image_url: string | null;
  created_at: string;
}

export const EVENT_TYPES = [
  { value: "camp", label: "Camps", color: "#16a34a" },
  { value: "clinic", label: "Clinics", color: "#2563eb" },
  { value: "combine", label: "Combines", color: "#7c3aed" },
  { value: "showcase", label: "Showcases", color: "#b87900" },
  { value: "tournament", label: "Tournaments", color: "#dc2626" },
  { value: "award-ceremony", label: "Awards", color: "#a16207" },
  { value: "tryout", label: "Tryouts", color: "#0891b2" },
  { value: "fundraiser", label: "Fundraisers", color: "#db2777" },
  { value: "meeting", label: "Meetings", color: "#64748b" },
  { value: "other", label: "Other", color: "#475569" },
] as const;

export function getEventTypeColor(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.color ?? "#475569";
}

export function getEventTypeLabel(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

const EVENTS_SELECT = `id, slug, title, event_type, description, sport_id, school_id, start_date, end_date, start_time, end_time, location_name, location_address, is_free, cost_info, registration_url, contact_name, contact_email, contact_phone, organizer, is_featured, status, tags, image_url, created_at`;

export interface EventFilters {
  type?: string;
  sport?: string;
  when?: string;
  page?: number;
}

const EVENTS_PER_PAGE = 12;

export const getCommunityEvents = cache(async (filters: EventFilters = {}) => {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    const page = filters.page || 1;
    const offset = (page - 1) * EVENTS_PER_PAGE;

    let query = supabase
      .from("community_events")
      .select(EVENTS_SELECT, { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null)
      .order("start_date", { ascending: true })
      .range(offset, offset + EVENTS_PER_PAGE - 1);

    // Filter by event type
    if (filters.type && filters.type !== "all") {
      query = query.eq("event_type", filters.type);
    }

    // Filter by sport
    if (filters.sport && filters.sport !== "all") {
      query = query.eq("sport_id", filters.sport);
    }

    // Filter by time period
    const today = new Date().toISOString().split("T")[0];
    if (!filters.when || filters.when === "upcoming") {
      query = query.gte("start_date", today);
    } else if (filters.when === "this-week") {
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() + 7);
      query = query.gte("start_date", today).lte("start_date", weekEnd.toISOString().split("T")[0]);
    } else if (filters.when === "this-month") {
      const monthEnd = new Date();
      monthEnd.setDate(monthEnd.getDate() + 30);
      query = query.gte("start_date", today).lte("start_date", monthEnd.toISOString().split("T")[0]);
    } else if (filters.when === "past") {
      query = query.lt("start_date", today).order("start_date", { ascending: false });
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      events: (data as CommunityEvent[]) || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / EVENTS_PER_PAGE),
    };
  }, { events: [], total: 0, page: 1, totalPages: 0 }, "getCommunityEvents");
});

export const getFeaturedEvents = cache(async () => {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("community_events")
      .select(EVENTS_SELECT)
      .eq("status", "published")
      .eq("is_featured", true)
      .is("deleted_at", null)
      .gte("start_date", today)
      .order("start_date", { ascending: true })
      .limit(6);

    if (error) throw error;
    return (data as CommunityEvent[]) || [];
  }, [] as CommunityEvent[], "getFeaturedEvents");
});

export const getEventBySlug = cache(async (slug: string) => {
  return withErrorHandling(async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("community_events")
      .select(EVENTS_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data as CommunityEvent;
  }, null as CommunityEvent | null, "getEventBySlug");
});

export const getRelatedEvents = cache(async (event: CommunityEvent, limit = 3) => {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    let query = supabase
      .from("community_events")
      .select(EVENTS_SELECT)
      .eq("status", "published")
      .is("deleted_at", null)
      .neq("id", event.id)
      .gte("start_date", today)
      .order("start_date", { ascending: true })
      .limit(limit);

    // Prefer same sport or same type
    if (event.sport_id) {
      query = query.eq("sport_id", event.sport_id);
    } else {
      query = query.eq("event_type", event.event_type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as CommunityEvent[]) || [];
  }, [] as CommunityEvent[], "getRelatedEvents");
});
