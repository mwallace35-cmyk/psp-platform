import { createStaticClient } from "@/lib/supabase/static";
import CoachingClient, { type CoachingInitialData } from "./CoachingClient";

interface CoachingStaffRow {
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

interface SchoolRow {
  id: number;
  name: string;
}

interface CoachRow {
  id: number;
  name: string;
}

async function getInitialData(): Promise<CoachingInitialData | undefined> {
  try {
    const supabase = createStaticClient();

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

    if (staffRes.error || schoolsRes.error || coachesRes.error) {
      return undefined;
    }

    return {
      staffList: (staffRes.data || []) as CoachingStaffRow[],
      schools: (schoolsRes.data || []) as SchoolRow[],
      coaches: (coachesRes.data || []) as CoachRow[],
    };
  } catch (err) {
    console.error("[admin/coaching] initial fetch failed:", err);
    return undefined;
  }
}

export default async function CoachingAdminPage() {
  const initialData = await getInitialData();
  return <CoachingClient initialData={initialData} />;
}
