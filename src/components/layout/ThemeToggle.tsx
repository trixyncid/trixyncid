"use client";

import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  className?: string;
  variant?: "icon" | "switch";
  showLabel?: boolean;
  compact?: boolean;
};

export function ThemeToggle({
  className,
  variant = "icon",
  showLabel = false,
  compact = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const tNav = useTranslations("nav");
  const isDark = resolvedTheme === "dark";

  if (variant === "switch") {
    return (
      <div className={cn("flex items-center justify-between gap-4", className)}>
        {showLabel && (
          <span className="text-sm font-medium text-foreground">{tNav("theme")}</span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={tNav("darkMode")}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          suppressHydrationWarning
          className={cn(
            "relative inline-flex shrink-0 items-center rounded-full border border-border/60 p-0.5 transition-colors",
            compact ? "h-7 w-12 bg-muted/60" : "h-8 w-14 bg-muted/60",
            isDark ? "bg-brand/20" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-200",
              compact ? "h-6 w-6" : "h-6 w-6",
              isDark ? (compact ? "translate-x-5" : "translate-x-6") : "translate-x-0",
            )}
          >
            {isDark ? (
              <Moon className={cn("text-brand-text", compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
            ) : (
              <Sun className={cn("text-amber-500", compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
            )}
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? tNav("switchToLight") : tNav("switchToDark")}
      suppressHydrationWarning
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/50 text-foreground transition-colors hover:bg-card hover:text-brand-text",
        className,
      )}
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
