"use client";

import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectShowcaseCardProps = {
  title: string;
  description: string;
  client: string;
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
  categoryLabel,
  image,
  href,
  linkLabel = "View project",
  className,
  size = "default",
}: ProjectShowcaseCardProps) {
  const titleId = useId();
  const isLarge = size === "large";

  // Screenshot on top at its own 10:7 ratio, words below it: nothing is set over the picture.
  const card = (
    <article
      className={cn(
        "group/card flex h-full w-full flex-col overflow-clip rounded-3xl bg-card transition-colors duration-300",
        className,
      )}
    >
      <div className="relative aspect-[10/7] overflow-clip bg-muted/40">
        <Image
          src={image}
          alt=""
          fill
          loading="lazy"
          fetchPriority="low"
          className="reveal-zoom object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
          sizes={
            isLarge
              ? "(max-width: 1024px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 50vw"
          }
        />
      </div>

      <div className={cn("flex flex-1 flex-col gap-3", isLarge ? "p-7 md:p-8" : "p-6 md:p-7")}>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-brand-text">{categoryLabel}</span>
          <span aria-hidden> · </span>
          {client}
        </p>
        <h3
          id={titleId}
          className={cn(
            "font-heading font-semibold leading-[1.15] tracking-tight text-foreground",
            isLarge ? "text-2xl md:text-[1.75rem]" : "text-xl md:text-2xl",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "leading-relaxed text-muted-foreground",
            isLarge ? "max-w-xl text-base" : "line-clamp-3 text-base",
          )}
        >
          {description}
        </p>
        {href && (
          <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-foreground transition-colors group-hover/card:text-brand-text">
            {linkLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
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
