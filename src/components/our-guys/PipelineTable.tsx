'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PipelineRow } from './SchoolPipelineRanking';
import { GRADE_STYLE, SPORT_LABEL } from './SchoolPipelineRanking';

const DEFAULT_VISIBLE = 15;

export default function PipelineTable({ rows }: { rows: PipelineRow[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? rows : rows.slice(0, DEFAULT_VISIBLE);
  const hasMore = rows.length > DEFAULT_VISIBLE;

  return (
    <>
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
            {visible.map((row, i) => {
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

      {/* View All / Collapse button */}
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="font-heading px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all
              bg-[var(--psp-gold)]/10 text-[var(--psp-gold)] border border-[var(--psp-gold)]/30
              hover:bg-[var(--psp-gold)]/20 hover:border-[var(--psp-gold)]/50"
          >
            {showAll
              ? 'Show Top 15'
              : `View All ${rows.length} Schools`}
          </button>
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 md:gap-6 text-xs text-gray-500">
        <div>
          <span className="text-gray-300 font-semibold">{visible.reduce((s, r) => s + r.pro_count, 0)}</span> total pros from {showAll ? `all ${rows.length}` : 'top 15'} schools
        </div>
        <div>
          <span className="text-gray-300 font-semibold">{visible.reduce((s, r) => s + r.college_count, 0)}</span> college athletes tracked
        </div>
        <div className="ml-auto text-gray-600">
          Updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      </div>
    </>
  );
}
