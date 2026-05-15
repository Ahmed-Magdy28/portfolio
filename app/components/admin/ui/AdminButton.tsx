import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "../../ui/utils";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "emerald" | "sky" | "fuchsia" | "amber";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-600/20",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600",
      outline: "border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:active:bg-gray-750 text-gray-700 dark:text-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-sm shadow-red-600/20",
      ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700 text-gray-600 dark:text-gray-400",
      emerald: "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-sm shadow-emerald-600/20",
      sky: "bg-sky-600 text-white hover:bg-sky-500 active:bg-sky-700 shadow-sm shadow-sky-600/20",
      fuchsia: "bg-fuchsia-600 text-white hover:bg-fuchsia-500 active:bg-fuchsia-700 shadow-sm shadow-fuchsia-600/20",
      amber: "bg-amber-600 text-white hover:bg-amber-500 active:bg-amber-700 shadow-sm shadow-amber-600/20",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs h-8",
      md: "px-4 py-2 text-sm h-10",
      lg: "px-6 py-3 text-base h-12",
      icon: "p-2 w-10 h-10",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";
