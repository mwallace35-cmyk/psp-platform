export default function Loading() {
  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      <div
        style={{
          height: 32,
          width: 200,
          background: "#e2e8f0",
          borderRadius: 4,
          marginBottom: 24,
          animation: "pulse 2s infinite",
        }}
      />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            height: 20,
            width: `${80 - i * 5}%`,
            background: "#e2e8f0",
            borderRadius: 4,
            marginBottom: 12,
            animation: "pulse 2s infinite",
          }}
        />
      ))}
    </div>
  );
}
