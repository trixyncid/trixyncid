"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type FilterPillsProps<K extends string> = {
  options: readonly { key: K; label: string }[];
  active: K;
  onChange: (key: K) => void;
  /** Accessible name for the group, e.g. "Filter by category". */
  label?: string;
  className?: string;
};

/**
 * Filter buttons where one solid brand pill slides to the active option
 * (FAQ categories, service and project filters). Inactive options are plain text.
 */
export function FilterPills<K extends string>({ options, active, onChange, label, className }: FilterPillsProps<K>) {
  const pillId = useId();

  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap items-center gap-1", className)}>
      {options.map((option) => {
        const isActive = option.key === active;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.key)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.span
                layoutId={pillId}
                aria-hidden
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
