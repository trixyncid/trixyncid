"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId } from "react";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { cn } from "@/lib/utils";

type FaqAccordionItemProps = {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export function FaqAccordionItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  const reducedMotion = useHydrationSafeReducedMotion();
  const duration = reducedMotion ? 0 : 0.38;
  const panelId = useId();
  const buttonId = useId();

  return (
    <motion.article
      layout="position"
      initial={false}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-[border-color,box-shadow,background-color] duration-300",
        isOpen
          ? "border-brand/30 bg-card/60 shadow-[0_8px_32px_rgba(33,56,184,0.08)] dark:bg-card/40 dark:shadow-[0_8px_32px_rgba(56,102,242,0.12)]"
          : "border-border/60 bg-card/30 hover:border-brand/20 hover:bg-card/45 dark:bg-card/20",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-y-3 left-0 w-0.5 rounded-full bg-brand transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        )}
        aria-hidden
      />

      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 px-5 py-5 text-left sm:gap-5 sm:px-6 sm:py-5"
      >
        <span
          className={cn(
            "mt-0.5 shrink-0 font-heading text-sm font-semibold tabular-nums transition-colors duration-300",
            isOpen ? "text-brand-text" : "text-muted-foreground",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block font-heading text-base font-semibold leading-snug tracking-tight transition-colors duration-300 sm:text-lg",
              isOpen ? "text-foreground" : "text-foreground/90",
            )}
          >
            {question}
          </span>
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            isOpen
              ? "border-brand/30 bg-brand/10 text-brand-text"
              : "border-border/60 bg-background/50 text-muted-foreground group-hover:border-brand/25 group-hover:text-brand-text",
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </motion.span>
      </button>

      {/* Panel stays mounted so every answer is in the server HTML for crawlers;
          collapsed panels are height 0 and inert. */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        inert={!isOpen}
        className="overflow-hidden"
      >
        <div className="border-t border-border/40 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pl-[4.25rem]">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] md:leading-7">
            {answer}
          </p>
        </div>
      </motion.div>
    </motion.article>
  );
}
