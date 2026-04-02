/**
 * Embed layout — minimal chrome, no header/footer/nav.
 * Used for iframe-embeddable components like player stat cards.
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 16,
        background: "transparent",
      }}
    >
      {children}
    </div>
  );
}
