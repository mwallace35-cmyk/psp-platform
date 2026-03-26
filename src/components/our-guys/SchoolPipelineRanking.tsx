import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';
import PipelineTable from './PipelineTable';

/* ─── Grade badge styles ─── */
const GRADE_STYLE: Record<string, { bg: string; text: string; ring: string }> = {
  'A+': { bg: 'bg-gradient-to-br from-yellow-400 to-amber-500', text: 'text-navy', ring: 'ring-yellow-400/30' },
  'A':  { bg: 'bg-gradient-to-br from-emerald-500 to-green-600', text: 'text-white', ring: 'ring-emerald-400/30' },
  'B+': { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', text: 'text-white', ring: 'ring-blue-400/30' },
  'B':  { bg: 'bg-gradient-to-br from-blue-400 to-blue-500', text: 'text-white', ring: 'ring-blue-300/30' },
  'C+': { bg: 'bg-gradient-to-br from-gray-400 to-gray-500', text: 'text-white', ring: 'ring-gray-400/30' },
  'C':  { bg: 'bg-gray-300', text: 'text-gray-700', ring: 'ring-gray-300/30' },
  'D':  { bg: 'bg-gray-200', text: 'text-gray-500', ring: 'ring-gray-200/30' },
  'F':  { bg: 'bg-red-200', text: 'text-red-700', ring: 'ring-red-200/30' },
};

const SPORT_LABEL: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  baseball: 'Baseball',
  soccer: 'Soccer',
  lacrosse: 'Lacrosse',
  'track-field': 'Track',
  wrestling: 'Wrestling',
};

export interface PipelineRow {
  school_id: number;
  total_tracked: number;
  pro_count: number;
  college_count: number;
  pro_rate: number;
  grade: string;
  top_sport: string | null;
  schools: {
    name: string;
    slug: string;
    logo_url: string | null;
    city: string | null;
  } | null;
}

export { GRADE_STYLE, SPORT_LABEL };

export default async function SchoolPipelineRanking() {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('school_pipeline_grades')
    .select('school_id, total_tracked, pro_count, college_count, pro_rate, grade, top_sport, schools:school_id(name, slug, logo_url, city)')
    .order('pro_count', { ascending: false })
    .order('college_count', { ascending: false })
    .limit(200);

  if (error || !data || data.length === 0) return null;

  const rows = (data as unknown as PipelineRow[]).map((r) => ({
    ...r,
    schools: Array.isArray(r.schools) ? r.schools[0] : r.schools,
  }));

  return (
    <section className="py-8">
      <div className="rounded-2xl bg-gradient-to-br from-navy via-navy-mid to-[#0d1b30] p-6 md:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-bebas text-2xl md:text-3xl text-white tracking-wide">
              School Pipeline Rankings
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Which schools produce the most pro athletes? Graded by total pros sent to the next level.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> A+
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-2" /> A
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 ml-2" /> B+
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 ml-2" /> C+
          </div>
        </div>

        <PipelineTable rows={rows} />
      </div>
    </section>
  );
}
