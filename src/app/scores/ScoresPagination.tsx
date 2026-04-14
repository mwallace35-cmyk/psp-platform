import Link from "next/link";

export function ScoresPagination({
  currentPage,
  totalCount,
  pageSize,
  selectedSport,
  selectedSeason,
  selectedSchool,
}: {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  selectedSport: string;
  selectedSeason: string;
  selectedSchool: string;
}) {
  if (totalCount <= pageSize) return null;

  const totalPages = Math.ceil(totalCount / pageSize);
  const baseParams = new URLSearchParams();
  if (selectedSport !== "all") baseParams.set("sport", selectedSport);
  if (selectedSeason !== "all") baseParams.set("season", selectedSeason);
  if (selectedSchool) baseParams.set("school", selectedSchool);

  function pageUrl(page: number) {
    const p = new URLSearchParams(baseParams);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return `/scores${qs ? `?${qs}` : ""}`;
  }

  return (
    <div
      className="flex justify-center items-center gap-3 mt-8 pb-4"
    >
      {currentPage > 1 && (
        <Link
          href={pageUrl(currentPage - 1)}
          className="font-semibold text-[0.9rem] no-underline px-4 py-2 border border-[#444] rounded-md"
          style={{ color: "var(--psp-gold)" }}
        >
          ← Previous
        </Link>
      )}
      <span className="text-[#999] text-[0.85rem]">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          href={pageUrl(currentPage + 1)}
          className="font-semibold text-[0.9rem] no-underline px-4 py-2 border border-[#444] rounded-md"
          style={{ color: "var(--psp-gold)" }}
        >
          Next →
        </Link>
      )}
    </div>
  );
}
