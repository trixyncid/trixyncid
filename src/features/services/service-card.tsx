"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  index?: number;
  title: string;
  categoryLabel: string;
  problemLabel: string;
  buildLabel: string;
  outcomeLabel: string;
  problem: string;
  build: string;
  outcome: string;
  icon: LucideIcon;
  accent: string;
  glow: string;
  iconBg: string;
  className?: string;
};

export function ServiceCard({
  index = 0,
  title,
  categoryLabel,
  problemLabel,
  buildLabel,
  outcomeLabel,
  problem,
  build,
  outcome,
  icon: Icon,
  accent,
  glow,
  iconBg,
  className,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <motion.article
      ref={cardRef}
      layout="position"
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-500 md:p-7",
        "hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_12px_40px_rgba(33,56,184,0.08)] dark:bg-card/25 dark:hover:shadow-[0_12px_40px_rgba(56,102,242,0.12)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-4 left-0 w-0.5 rounded-full bg-brand/0 transition-colors duration-500 group-hover:bg-brand/70"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 240px at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 68%)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/50",
              iconBg,
            )}
          >
            <Icon className={cn("h-5 w-5", accent)} strokeWidth={1.75} />
          </motion.div>
          <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {categoryLabel}
          </span>
        </div>

        <div>
          <span className="font-heading text-sm font-semibold tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-1 font-heading text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
            {title}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 dark:bg-muted/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {problemLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{problem}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 dark:bg-muted/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {buildLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{build}</p>
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-brand/15 bg-brand/[0.04] p-4 dark:border-brand/25 dark:bg-brand/[0.08]">
          <p className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", accent)}>
            {outcomeLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground md:text-[0.9375rem]">{outcome}</p>
        </div>
      </div>
    </motion.article>
  );
}
