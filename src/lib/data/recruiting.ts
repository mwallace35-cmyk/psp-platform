import { createClient, withErrorHandling, withRetry } from "./common";

export interface RecruitProfile {
  id: number;
  player_id: number;
  player_name: string;
  player_slug: string;
  school_name: string;
  school_id: number;
  class_year: number;
  sport_id: string;
  position: string | null;
  height: string | null;
  weight: number | null;
  star_rating: number | null;
  composite_rating: number | null;
  status: string;
  committed_school: string | null;
  committed_college_id: number | null;
  committed_college_name: string | null;
  commitment_date: string | null;
  featured: boolean;
  hudl_url: string | null;
  url_247: string | null;
  url_rivals: string | null;
  url_on3: string | null;
  offers: OfferRecord[];
  ratings: RatingRecord[];
}

export interface OfferRecord {
  id: number;
  college_id: number;
  college_name: string;
  college_division: string;
  college_conference: string | null;
  status: string;
  offer_date: string | null;
  visit_date: string | null;
  commitment_date: string | null;
  scholarship_type: string | null;
}

export interface RatingRecord {
  id: number;
  service: string;
  rating: number | null;
  stars: number | null;
  national_rank: number | null;
  state_rank: number | null;
  position_rank: number | null;
  overall_rank: number | null;
  recorded_date: string;
}

export interface CollegeOption {
  id: number;
  name: string;
  city: string | null;
  state: string | null;
  division: string;
  subdivision: string | null;
  conference: string | null;
}

/**
 * Get all recruiting profiles with player info, offers, and latest ratings
 */
export async function getRecruitingBoard(classYear?: number, sportId?: string) {
  return withErrorHandling(
    async () => {
      return withRetry(async () => {
        const supabase = await createClient();

        let query = (supabase as any)
          .from("recruiting_profiles")
          .select(`
            id, player_id, class_year, sport_id, position, star_rating,
            composite_rating, status, committed_school, committed_college_id,
            committed_date, featured, height, weight,
            url_hudl, url_247, url_rivals, url_on3,
            players(name, slug, primary_school_id, schools(name, id))
          `)
          .order("star_rating", { ascending: false, nullsFirst: false });

        if (classYear) query = query.eq("class_year", classYear);
        if (sportId) query = query.eq("sport_id", sportId);

        const { data, error } = await query;
        if (error) throw error;
        if (!data) return [];

        // Get all profile IDs to batch-fetch offers and ratings
        const profileIds = data.map((d: any) => d.id);

        // Fetch offers with college info
        const { data: offers } = await (supabase as any)
          .from("recruiting_offers")
          .select(`
            id, recruiting_profile_id, college_id, status,
            offer_date, visit_date, commitment_date, scholarship_type,
            colleges(name, division, conference)
          `)
          .in("recruiting_profile_id", profileIds)
          .order("created_at", { ascending: false });

        // Fetch ratings from profiles JSONB column
        const ratings: any[] = [];
        (data ?? []).forEach((p: any) => {
          const profileRatings = p.ratings || [];
          profileRatings.forEach((r: any) => {
            ratings.push({ ...r, recruiting_profile_id: p.id });
          });
        });

        // Group offers and ratings by profile
        const offersMap = new Map<number, OfferRecord[]>();
        const ratingsMap = new Map<number, RatingRecord[]>();

        (offers ?? []).forEach((o: any) => {
          const college = Array.isArray(o.colleges) ? o.colleges[0] : o.colleges;
          const record: OfferRecord = {
            id: o.id,
            college_id: o.college_id,
            college_name: college?.name ?? "Unknown",
            college_division: college?.division ?? "",
            college_conference: college?.conference ?? null,
            status: o.status,
            offer_date: o.offer_date,
            visit_date: o.visit_date,
            commitment_date: o.commitment_date,
            scholarship_type: o.scholarship_type,
          };
          const arr = offersMap.get(o.recruiting_profile_id) ?? [];
          arr.push(record);
          offersMap.set(o.recruiting_profile_id, arr);
        });

        // Dedupe ratings: keep only latest per service per profile
        const seenRatings = new Set<string>();
        (ratings ?? []).forEach((r: any) => {
          const key = `${r.recruiting_profile_id}-${r.service}`;
          if (seenRatings.has(key)) return;
          seenRatings.add(key);
          const record: RatingRecord = {
            id: r.id,
            service: r.service,
            rating: r.rating ? parseFloat(r.rating) : null,
            stars: r.stars,
            national_rank: r.national_rank,
            state_rank: r.state_rank,
            position_rank: r.position_rank,
            overall_rank: r.overall_rank,
            recorded_date: r.recorded_date,
          };
          const arr = ratingsMap.get(r.recruiting_profile_id) ?? [];
          arr.push(record);
          ratingsMap.set(r.recruiting_profile_id, arr);
        });

        // Assemble profiles
        return data.map((d: any) => {
          const player = Array.isArray(d.players) ? d.players[0] : d.players;
          const school = player?.schools
            ? Array.isArray(player.schools) ? player.schools[0] : player.schools
            : null;

          // Check if committed_college_id has a matching offer
          const profileOffers = offersMap.get(d.id) ?? [];
          const committedOffer = profileOffers.find(
            (o) => o.status === "committed" || o.status === "signed"
          );

          return {
            id: d.id,
            player_id: d.player_id,
            player_name: player?.name ?? "Unknown",
            player_slug: player?.slug ?? "",
            school_name: school?.name ?? "",
            school_id: school?.id ?? 0,
            class_year: d.class_year,
            sport_id: d.sport_id ?? "football",
            position: d.position,
            height: d.height,
            weight: d.weight,
            star_rating: d.star_rating,
            composite_rating: d.composite_rating ? parseFloat(d.composite_rating) : null,
            status: d.status,
            committed_school: committedOffer?.college_name ?? d.committed_school,
            committed_college_id: d.committed_college_id,
            committed_college_name: committedOffer?.college_name ?? null,
            commitment_date: d.committed_date,
            featured: d.featured ?? false,
            hudl_url: d.url_hudl,
            url_247: d.url_247,
            url_rivals: d.url_rivals,
            url_on3: d.url_on3,
            offers: profileOffers,
            ratings: ratingsMap.get(d.id) ?? [],
          } as RecruitProfile;
        });
      });
    },
    [],
    "RECRUITING_BOARD_ERROR"
  );
}

/**
 * Get available class years from recruiting profiles
 */
export async function getRecruitingClassYears() {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("recruiting_profiles")
        .select("class_year")
        .order("class_year", { ascending: false });
      const years = [...new Set((data ?? []).map((d: any) => d.class_year))];
      return years;
    },
    [],
    "RECRUITING_CLASS_YEARS_ERROR"
  );
}

/**
 * Get all colleges for dropdown
 */
export async function getCollegeOptions(): Promise<CollegeOption[]> {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("colleges")
        .select("id, name, city, state, division, subdivision, conference")
        .order("name");
      return (data ?? []) as CollegeOption[];
    },
    [],
    "COLLEGE_OPTIONS_ERROR"
  );
}

/**
 * Get recruiting summary stats
 */
export async function getRecruitingSummary() {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data: profiles } = await supabase
        .from("recruiting_profiles")
        .select("id, status, star_rating, class_year");

      const total = (profiles ?? []).length;
      const committed = (profiles ?? []).filter((p: any) => p.status === "committed" || p.status === "signed").length;
      const fiveStars = (profiles ?? []).filter((p: any) => p.star_rating === 5).length;
      const fourStars = (profiles ?? []).filter((p: any) => p.star_rating === 4).length;

      const { count: offerCount } = await supabase
        .from("recruiting_offers")
        .select("id", { count: "exact", head: true });

      return { total, committed, fiveStars, fourStars, totalOffers: offerCount ?? 0 };
    },
    { total: 0, committed: 0, fiveStars: 0, fourStars: 0, totalOffers: 0 },
    "RECRUITING_SUMMARY_ERROR"
  );
}
