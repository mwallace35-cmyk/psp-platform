import React from "react";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * PageTitle component - renders an h1 with consistent styling
 * Ensures every page has a proper semantic heading for accessibility
 */
export default function PageTitle({ children, className = "", id }: PageTitleProps) {
  return (
    <h1
      id={id}
      className={`text-4xl md:text-5xl font-bold text-[var(--psp-navy)] dark:text-white mb-4 ${className}`}
    >
      {children}
    </h1>
  );
}
