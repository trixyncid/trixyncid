"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StrengthPillarCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  glow: string;
  className?: string;
};

export function StrengthPillarCard({
  title,
  description,
  icon: Icon,
  accent,
  glow,
  className,
}: StrengthPillarCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  // Writes CSS variables directly — no React re-render per mouse move.
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const node = cardRef.current;
    if (!node || event.pointerType !== "mouse") return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    node.style.setProperty("--tx", `${(event.clientX - (rect.left + rect.width / 2)) / 32}px`);
    node.style.setProperty("--ty", `${(event.clientY - (rect.top + rect.height / 2)) / 32}px`);
  };

  const handlePointerLeave = () => {
    const node = cardRef.current;
    if (!node) return;
    node.style.setProperty("--tx", "0px");
    node.style.setProperty("--ty", "0px");
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ "--glow": glow } as React.CSSProperties}
      className={cn(
        "group relative flex h-full min-h-[15rem] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/20",
        // Hover tilt + spotlight only for real mice; reduced motion keeps it still.
        "transition-transform duration-150 ease-out [@media(hover:hover)]:hover:[transform:translate3d(var(--tx,0px),var(--ty,0px),0)] motion-reduce:!transform-none",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden [@media(hover:hover)]:block"
        style={{
          background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col p-5 md:p-6">
        <div
          className={cn(
            "mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-background/40 md:backdrop-blur-sm",
            accent,
            "transition-transform duration-200 motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-3",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <h3 className="font-heading text-base font-semibold tracking-tight text-foreground md:text-[1.0625rem]">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div
          className={cn(
            "mt-4 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-light/70 to-transparent transition-transform duration-500 group-hover:scale-x-100",
          )}
          aria-hidden
        />
      </div>
    </article>
  );
}
