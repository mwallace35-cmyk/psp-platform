import Link from "next/link";
import Button from "./Button";
import React, { ReactNode } from "react";

interface ActionConfig {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: ReactNode | string;
  title: string;
  message?: string;
  description?: string;
  action?: ActionConfig;
  className?: string;
}

function EmptyState({
  icon = "📭",
  title,
  message,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const displayMessage = message || description;

  return (
    <div
      className={`empty-state ${className}`}
      style={{
        textAlign: "center",
        padding: "2rem 1rem",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Icon */}
      {icon && (
        <span
          role="img"
          aria-label={title || "Status icon"}
          style={{
            fontSize: "3.5rem",
            marginBottom: "1rem",
            opacity: 0.8,
            display: "block",
          }}
        >
          {icon}
        </span>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold mb-2 text-navy">
        {title}
      </h3>

      {/* Message/Description */}
      {displayMessage && (
        <p
          style={{
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
            maxWidth: "28rem",
            margin: "0 auto 1.5rem",
            color: "var(--psp-gray-500)",
            lineHeight: 1.6,
          }}
        >
          {displayMessage}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <div style={{ marginTop: "0.5rem" }}>
          {action.href ? (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(EmptyState);
