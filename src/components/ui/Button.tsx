import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconOnly?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconOnly = false,
      loading = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-label font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

    const sizes = {
      sm: iconOnly ? "h-8 w-8" : "h-8 px-3 text-sm",
      md: iconOnly ? "h-11 w-11" : "h-11 px-5 text-sm",
      lg: iconOnly ? "h-12 w-12" : "h-12 px-6 text-base",
    };

    const variants = {
      primary:
        "text-on-primary shadow-ghost-md hover:opacity-90 active:scale-[0.98]",
      secondary:
        "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim active:scale-[0.98]",
      tertiary:
        "text-on-surface-variant hover:bg-surface-container-high active:scale-[0.98]",
      danger:
        "bg-error text-white hover:opacity-90 active:scale-[0.98] shadow-ghost",
    };

    const primaryGradient =
      variant === "primary"
        ? { background: "linear-gradient(135deg, #005db5 0%, #0052a0 100%)" }
        : {};

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        style={primaryGradient}
        {...props}
      >
        {loading ? (
          <span className="material-symbols-outlined animate-spin text-base">
            progress_activity
          </span>
        ) : icon ? (
          <span className="material-symbols-outlined text-[18px] leading-none">
            {icon}
          </span>
        ) : null}
        {!iconOnly && children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
