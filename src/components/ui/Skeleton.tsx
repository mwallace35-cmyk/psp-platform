import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseStyles = "animate-pulse skeleton";
  const shapeStyles = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`${baseStyles} ${shapeStyles[variant]} ${className}`}
      style={{ width, height, background: "var(--skeleton-bg, #e2e8f0)" }}
      aria-hidden="true"
    />
  );
}

const MemoSkeleton = React.memo(Skeleton);
export default MemoSkeleton;

/**
 * SkeletonText - Renders multiple skeleton lines for text content
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
  width?: string;
}

const SkeletonText = React.memo(function SkeletonText({
  lines = 3,
  className = "",
  width = "100%",
}: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`} style={{ width }} role="status" aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <MemoSkeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "80%" : "100%"}
        />
      ))}
    </div>
  );
});

/**
 * SkeletonCard - Renders a skeleton loader for card content
 */
interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
}

const SkeletonCard = React.memo(function SkeletonCard({
  className = "",
  showImage = true,
  showTitle = true,
  showDescription = true,
}: SkeletonCardProps) {
  return (
    <div
      className={`skeleton-card ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading card"
      style={{
        background: "var(--psp-white)",
        borderRadius: "0.5rem",
        border: "1px solid var(--psp-gray-200)",
        overflow: "hidden",
      }}
    >
      {showImage && (
        <MemoSkeleton
          variant="rectangular"
          width="100%"
          height="160px"
        />
      )}
      <div style={{ padding: "1rem" }}>
        {showTitle && (
          <MemoSkeleton
            variant="text"
            width="70%"
            className="mb-3"
          />
        )}
        {showDescription && (
          <SkeletonText lines={2} width="100%" />
        )}
      </div>
    </div>
  );
});

/**
 * SkeletonTable - Renders skeleton loaders for table rows
 */
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const SkeletonTable = React.memo(function SkeletonTable({
  rows = 5,
  columns = 4,
  className = "",
}: SkeletonTableProps) {
  return (
    <div
      className={`skeleton-table ${className}`}
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading table"
    >
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: "flex",
            gap: "1rem",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid var(--psp-gray-100)",
          }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <MemoSkeleton
              key={`${rowIdx}-${colIdx}`}
              variant="text"
              width={colIdx === 0 ? "60px" : "100%"}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
});

/**
 * SkeletonAvatar - Renders a circular skeleton for avatar/profile pictures
 */
interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SkeletonAvatar = React.memo(function SkeletonAvatar({
  size = "md",
  className = "",
}: SkeletonAvatarProps) {
  const sizeMap = {
    sm: "32px",
    md: "48px",
    lg: "64px",
  };

  return (
    <MemoSkeleton
      variant="circular"
      width={sizeMap[size]}
      height={sizeMap[size]}
      className={className}
    />
  );
});

export { SkeletonText, SkeletonCard, SkeletonTable, SkeletonAvatar };
