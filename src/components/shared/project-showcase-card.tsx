"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/content/projects";

type ProjectShowcaseCardProps = {
  title: string;
  description: string;
  client: string;
  category: ProjectCategory;
  categoryLabel: string;
  image: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  size?: "default" | "large";
};

export function ProjectShowcaseCard({
  title,
  description,
  client,
  category,
  categoryLabel,
  image,
  href,
  linkLabel = "View project",
  className,
  size = "default",
}: ProjectShowcaseCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const isLarge = size === "large";

  const categoryStyles: Record<ProjectCategory, string> = {
    software: "border-sky-400/30 bg-white/90 text-sky-800 dark:bg-background/80 dark:text-sky-300",
    enterprise: "border-brand-light/30 bg-white/90 text-brand-text dark:bg-background/80",
    web: "border-violet-400/30 bg-white/90 text-violet-800 dark:bg-background/80 dark:text-violet-300",
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--mx", `${x}%`);
    node.style.setProperty("--my", `${y}%`);
  };

  const card = (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group/card relative isolate flex w-full overflow-hidden rounded-3xl border border-border/60 bg-card/30 shadow-sm transition-[border-color,box-shadow,transform] duration-500",
        "hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl hover:shadow-brand/[0.06] dark:hover:shadow-brand/10",
        isLarge
          ? "min-h-[26rem] sm:min-h-[30rem] lg:min-h-[34rem]"
          : "min-h-[22rem] md:min-h-[26rem]",
        className,
      )}
    >
      {/* Theme-aware cursor glow — soft in light mode, no dark blob */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_220px_at_var(--mx,50%)_var(--my,50%),rgba(33,56,184,0.09),transparent_68%)] dark:bg-[radial-gradient(circle_220px_at_var(--mx,50%)_var(--my,50%),rgba(56,102,242,0.16),transparent_68%)]" />
      </div>

      <Image
        src={image}
        alt=""
        fill
        loading="lazy"
        fetchPriority="low"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.05]"
        sizes={
          isLarge
            ? "(max-width: 1024px) 100vw, 50vw"
            : "(max-width: 768px) 100vw, 50vw"
        }
      />

      {/* Legibility scrim — works on photos in both themes */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 dark:from-background/95 dark:via-background/55 dark:to-background/10"
        aria-hidden
      />

      <span
        className={cn(
          "absolute left-5 top-5 z-10 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md",
          categoryStyles[category],
        )}
      >
        {categoryLabel}
      </span>

      <div
        className={cn(
          "relative z-10 mt-auto flex flex-col justify-end",
          isLarge ? "gap-4 p-7 md:p-9 lg:p-10" : "gap-3 p-6 md:p-8",
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/70 dark:text-muted-foreground">
          {client}
        </p>
        <h3
          id={titleId}
          className={cn(
            "font-heading font-semibold leading-[1.15] tracking-tight text-white dark:text-foreground",
            isLarge ? "text-2xl md:text-[1.75rem] lg:text-3xl" : "text-xl md:text-2xl",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "leading-relaxed text-white/80 dark:text-muted-foreground",
            isLarge ? "max-w-xl text-base md:text-[1.0625rem]" : "text-sm md:text-base line-clamp-3",
          )}
        >
          {description}
        </p>
        {href && (
          <span className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-white transition-colors group-hover/card:text-white/80 dark:text-foreground dark:group-hover/card:text-foreground/80">
            {linkLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
          </span>
        )}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} aria-labelledby={titleId} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
