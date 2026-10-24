"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId } from "react";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { cn } from "@/lib/utils";

type FaqAccordionItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One question in a quiet list: no outline, no numbering. The open question
 * sits on a single tone-step surface and its + turns into an ×.
 */
export function FaqAccordionItem({ question, answer, isOpen, onToggle }: FaqAccordionItemProps) {
  const reducedMotion = useHydrationSafeReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <div
      className={cn(
        "rounded-2xl transition-colors duration-300",
        isOpen ? "bg-card" : "hover:bg-card/60",
      )}
    >
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-6 rounded-2xl px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light sm:px-6"
      >
        <span className="font-heading text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: EASE }}
          className={cn(
            "mt-0.5 shrink-0 transition-colors duration-300",
            isOpen ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <Plus className="h-5 w-5" strokeWidth={2} aria-hidden />
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
        transition={{ duration: reducedMotion ? 0 : 0.35, ease: EASE }}
        inert={!isOpen}
        className="overflow-hidden"
      >
        <p className="max-w-2xl px-5 pb-6 text-base leading-relaxed text-foreground/80 sm:px-6">{answer}</p>
      </motion.div>
    </div>
  );
}
