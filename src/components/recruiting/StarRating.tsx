interface StarRatingProps {
  rating: number; // 2-5
  size?: number;
}

export default function StarRating({ rating, size = 14 }: StarRatingProps) {
  return (
    <span style={{ fontSize: size, letterSpacing: 1 }} title={`${rating}-star recruit`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "#f0a500" : "var(--g200)" }}>★</span>
      ))}
    </span>
  );
}
