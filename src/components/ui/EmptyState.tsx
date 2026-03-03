import Button from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--psp-navy)" }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--psp-gray-500)" }}>
          {description}
        </p>
      )}
      {actionLabel && (
        actionHref ? (
          <a href={actionHref}>
            <Button>{actionLabel}</Button>
          </a>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}
