'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

interface OfferRecord {
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

interface RatingRecord {
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

interface RecruitProfile {
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

interface Props {
  recruits: RecruitProfile[];
  classYears: number[];
}

const sportColors: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#ea580c',
  'track-field': '#7c3aed',
  lacrosse: '#0891b2',
  wrestling: '#ca8a04',
  soccer: '#059669',
};

function StarRating({ stars }: { stars: number | null }) {
  if (!stars) return <span className="text-gray-400 text-xs">NR</span>;
  return (
    <span className="text-sm tracking-tight">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < stars ? '#f0a500' : '#d1d5db' }}>&#9733;</span>
      ))}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    prospect: { bg: '#e2e8f0', text: '#475569' },
    offered: { bg: '#dbeafe', text: '#1d4ed8' },
    committed: { bg: '#dcfce7', text: '#15803d' },
    signed: { bg: '#d1fae5', text: '#047857' },
    enrolled: { bg: '#f0fdf4', text: '#166534' },
    decommitted: { bg: '#fee2e2', text: '#b91c1c' },
  };
  const s = styles[status] ?? styles.prospect;
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

export default function RecruitBoard({ recruits, classYears }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | null>(classYears[0] ?? null);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'offers' | 'school'>('rating');

  const filtered = useMemo(() => {
    let list = recruits;
    if (selectedYear) list = list.filter((r) => r.class_year === selectedYear);
    if (selectedSport !== 'all') list = list.filter((r) => r.sport_id === selectedSport);
    if (selectedStatus !== 'all') list = list.filter((r) => r.status === selectedStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.player_name.toLowerCase().includes(q) ||
          r.school_name.toLowerCase().includes(q) ||
          (r.committed_school ?? '').toLowerCase().includes(q) ||
          (r.position ?? '').toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') return (b.star_rating ?? 0) - (a.star_rating ?? 0) || (b.composite_rating ?? 0) - (a.composite_rating ?? 0);
      if (sortBy === 'name') return a.player_name.localeCompare(b.player_name);
      if (sortBy === 'offers') return (b.offers?.length ?? 0) - (a.offers?.length ?? 0);
      if (sortBy === 'school') return a.school_name.localeCompare(b.school_name);
      return 0;
    });
    return list;
  }, [recruits, selectedYear, selectedSport, selectedStatus, searchQuery, sortBy]);

  const sports = [...new Set(recruits.map((r) => r.sport_id))];
  const statuses = [...new Set(recruits.map((r) => r.status))];

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex gap-1.5">
          {classYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(selectedYear === yr ? null : yr)}
              className="px-4 py-1.5 text-sm font-semibold rounded-full transition-all"
              style={
                selectedYear === yr
                  ? { backgroundColor: 'var(--psp-navy)', color: '#fff' }
                  : { border: '1.5px solid #e2e8f0', color: '#64748b' }
              }
            >
              {yr}
            </button>
          ))}
        </div>
        {sports.length > 1 && (
          <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="text-sm border rounded-lg px-3 py-1.5 text-gray-700">
            <option value="all">All Sports</option>
            {sports.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
          </select>
        )}
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="text-sm border rounded-lg px-3 py-1.5 text-gray-700">
          <option value="all">All Statuses</option>
          {statuses.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
        </select>
        <input type="text" placeholder="Search name, school, position..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="text-sm border rounded-lg px-3 py-1.5 text-gray-700 flex-1 min-w-[200px]" aria-label="Search recruits by name, school, or position" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="text-sm border rounded-lg px-3 py-1.5 text-gray-700">
          <option value="rating">Sort: Rating</option>
          <option value="name">Sort: Name</option>
          <option value="offers">Sort: Offers</option>
          <option value="school">Sort: School</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">Showing {filtered.length} recruit{filtered.length !== 1 ? 's' : ''}{selectedYear ? ` in Class of ${selectedYear}` : ''}</p>

      {filtered.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">No recruits found matching your filters.</p>
          <p className="text-gray-400 text-sm mt-2">Recruiting profiles will appear here as they are added to the system.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((recruit, idx) => (
            <div key={recruit.id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#0a1628', color: '#f0a500' }}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/player/${recruit.player_slug}`} className="font-bold text-lg hover:underline font-bebas tracking-wide" style={{ color: 'var(--psp-navy)' }}>{recruit.player_name}</Link>
                    <StatusBadge status={recruit.status} />
                    <StarRating stars={recruit.star_rating} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-0.5 flex-wrap">
                    {recruit.position && (<span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: sportColors[recruit.sport_id] ?? '#6b7280' }}>{recruit.position}</span>)}
                    <span>{recruit.school_name}</span>
                    <span className="text-gray-400">|</span>
                    <span>Class of {recruit.class_year}</span>
                    {recruit.height && (<><span className="text-gray-400">|</span><span>{recruit.height}</span></>)}
                    {recruit.weight && (<><span className="text-gray-400">|</span><span>{recruit.weight} lbs</span></>)}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                    {(recruit.status === 'committed' || recruit.status === 'signed') && recruit.committed_school && (<span className="font-semibold" style={{ color: '#15803d' }}>Committed: {recruit.committed_school}</span>)}
                    {recruit.offers.length > 0 && (
                      <span className="text-gray-500">
                        {recruit.offers.length} offer{recruit.offers.length !== 1 ? 's' : ''}
                        {recruit.offers.length <= 6 && (<span className="text-gray-400 ml-1">({recruit.offers.map((o) => o.college_name).join(', ')})</span>)}
                      </span>
                    )}
                  </div>
                </div>
                {recruit.ratings.length > 0 && (
                  <div className="flex-shrink-0 flex gap-4 items-start">
                    {['247sports', 'rivals', 'on3'].map((svc) => {
                      const r = recruit.ratings.find((rt) => rt.service === svc);
                      if (!r) return null;
                      return (
                        <div key={svc} className="text-center min-w-[50px]">
                          <div className="text-[10px] font-semibold text-gray-400 uppercase">{svc === '247sports' ? '247' : svc}</div>
                          <div className="text-sm font-bold" style={{ color: '#0a1628' }}>{r.rating ? Number(r.rating).toFixed(2) : '--'}</div>
                          {r.state_rank && (<div className="text-[10px] text-gray-500">#{r.state_rank} PA</div>)}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex-shrink-0 flex gap-1.5 items-start">
                  {recruit.url_247 && (<a href={recruit.url_247} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold hover:bg-blue-100">247</a>)}
                  {recruit.url_rivals && (<a href={recruit.url_rivals} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-red-50 text-red-700 rounded font-semibold hover:bg-red-100">RIV</a>)}
                  {recruit.url_on3 && (<a href={recruit.url_on3} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded font-semibold hover:bg-green-100">On3</a>)}
                  {recruit.hudl_url && (<a href={recruit.hudl_url} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-orange-50 text-orange-700 rounded font-semibold hover:bg-orange-100">HUDL</a>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
