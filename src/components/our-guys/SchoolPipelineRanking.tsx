import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';

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

interface PipelineRow {
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

export default async function SchoolPipelineRanking() {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('school_pipeline_grades')
    .select('school_id, total_tracked, pro_count, college_count, pro_rate, grade, top_sport, schools:school_id(name, slug, logo_url, city)')
    .order('pro_count', { ascending: false })
    .order('college_count', { ascending: false })
    .limit(15);

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

        {/* Table */}
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left py-3 pl-2 w-10">#</th>
                <th className="text-left py-3">School</th>
                <th className="text-center py-3 w-16">Pros</th>
                <th className="text-center py-3 w-20 hidden sm:table-cell">College</th>
                <th className="text-center py-3 w-16 hidden md:table-cell">Total</th>
                <th className="text-center py-3 w-16 hidden lg:table-cell">Rate</th>
                <th className="text-center py-3 w-14">Grade</th>
                <th className="text-left py-3 w-24 hidden md:table-cell">Top Sport</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const school = row.schools;
                if (!school) return null;
                const gradeStyle = GRADE_STYLE[row.grade] || GRADE_STYLE['D'];
                const isTop3 = i < 3;

                return (
                  <tr
                    key={row.school_id}
                    className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${
                      isTop3 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 pl-2">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        i === 0 ? 'bg-gold text-navy' :
                        i === 1 ? 'bg-gray-300 text-gray-700' :
                        i === 2 ? 'bg-amber-700 text-amber-100' :
                        'bg-white/10 text-gray-400'
                      }`}>
                        {i + 1}
                      </span>
                    </td>

                    {/* School */}
                    <td className="py-3">
                      <Link
                        href={`/schools/${school.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {/* Logo */}
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          {school.logo_url ? (
                            <Image
                              src={school.logo_url}
                              alt={school.name}
                              width={36}
                              height={36}
                              className="object-contain"
                              unoptimized
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">
                              {school.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className={`font-semibold block truncate group-hover:text-gold transition-colors ${
                            isTop3 ? 'text-white' : 'text-gray-200'
                          }`}>
                            {school.name}
                          </span>
                          {school.city && (
                            <span className="text-[11px] text-gray-500 block">{school.city}</span>
                          )}
                        </div>
                      </Link>
                    </td>

                    {/* Pros */}
                    <td className="py-3 text-center">
                      <span className={`font-bebas text-lg ${isTop3 ? 'text-gold' : 'text-white'}`}>
                        {row.pro_count}
                      </span>
                    </td>

                    {/* College */}
                    <td className="py-3 text-center hidden sm:table-cell text-gray-300">
                      {row.college_count}
                    </td>

                    {/* Total */}
                    <td className="py-3 text-center hidden md:table-cell text-gray-400">
                      {row.total_tracked}
                    </td>

                    {/* Rate */}
                    <td className="py-3 text-center hidden lg:table-cell text-gray-400">
                      {row.pro_rate}%
                    </td>

                    {/* Grade */}
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-9 h-7 rounded-md text-xs font-black ring-2 ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.ring}`}>
                        {row.grade}
                      </span>
                    </td>

                    {/* Top Sport */}
                    <td className="py-3 hidden md:table-cell">
                      {row.top_sport && (
                        <span className="text-xs text-gray-400">
                          {SPORT_LABEL[row.top_sport] || row.top_sport}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer stats */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 md:gap-6 text-xs text-gray-500">
          <div>
            <span className="text-gray-300 font-semibold">{rows.reduce((s, r) => s + r.pro_count, 0)}</span> total pros from top 15 schools
          </div>
          <div>
            <span className="text-gray-300 font-semibold">{rows.reduce((s, r) => s + r.college_count, 0)}</span> college athletes tracked
          </div>
          <div className="ml-auto text-gray-600">
            Updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
    </section>
  );
}
