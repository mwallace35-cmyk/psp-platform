import { ButtonHTMLAttributes, forwardRef } from "react";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--psp-gold)] text-[var(--psp-navy)] hover:bg-[var(--psp-gold-light)] hover:shadow-lg font-semibold",
  secondary:
    "bg-[var(--psp-navy)] text-white hover:bg-[var(--psp-navy-mid)] font-semibold",
  outline:
    "border border-[var(--psp-gray-300)] text-[var(--psp-gray-600)] hover:border-[var(--psp-gray-400)] hover:bg-[var(--psp-gray-50)]",
  ghost:
    "text-[var(--psp-gray-600)] hover:text-[var(--psp-navy)] hover:bg-[var(--psp-gray-100)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2 text-sm rounded-lg",
  lg: "px-8 py-3 text-base rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--psp-gold)] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default React.memo(Button);
