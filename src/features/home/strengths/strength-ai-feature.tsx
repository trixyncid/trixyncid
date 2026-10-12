"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Spotlight } from "@/components/ui/spotlight";
import { useHeavyEffects } from "@/hooks/use-heavy-effects";
import { useRichVisuals } from "@/hooks/use-rich-visuals";
import { RobotPoster } from "./robot-poster";
import { cn } from "@/lib/utils";

import type { RobotInteraction } from "./strength-ai-scene.client";

const StrengthAiScene = dynamic(
  () => import("./strength-ai-scene.client").then((m) => m.StrengthAiScene),
  { ssr: false },
);

type StrengthAiFeatureProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function StrengthAiFeature({
  eyebrow,
  title,
  description,
  className,
}: StrengthAiFeatureProps) {
  const reduced = useReducedMotion();
  // Capable desktops get the WebGL robot; everything else the SVG version.
  const richVisuals = useRichVisuals();
  const { ref, ready: sceneReady } = useHeavyEffects({ idleTimeout: 2000 });
  const [hopKey, setHopKey] = useState(0);
  const cardRef = useRef<HTMLElement>(null);
  const interaction = useRef<RobotInteraction>({ x: 0, y: 0, hover: false, pulseAt: -Infinity });
  // Only enter/leave touch React state (for the spotlight); pointer moves write to refs.
  const [hovering, setHovering] = useState(false);
  const interactive = !reduced && richVisuals;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!interactive || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    interaction.current.x = px;
    interaction.current.y = py;
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1400px) rotateX(${(-py * 2.5).toFixed(2)}deg) rotateY(${(px * 3.5).toFixed(2)}deg)`;
    }
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    if (!interactive || event.pointerType !== "mouse") return;
    interaction.current.hover = true;
    setHovering(true);
  };

  const handlePointerLeave = () => {
    interaction.current = { ...interaction.current, x: 0, y: 0, hover: false };
    setHovering(false);
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  // Click / tap: the robot hops, spins, waves, and sends out a pulse.
  const handleClick = () => {
    if (reduced) return;
    interaction.current.pulseAt = performance.now() / 1000;
    if (!richVisuals) setHopKey((key) => key + 1);
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      className={cn(
        "group relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/20 transition-transform duration-300 ease-out will-change-transform md:min-h-0",
        !reduced && "cursor-pointer",
        className,
      )}
    >
      {interactive && (
        <Spotlight
          className={cn(
            "-top-24 left-0 md:-top-20 md:left-16",
            hovering ? "opacity-100" : "opacity-0",
          )}
          fill="#3866F2"
        />
      )}

      <div
        ref={ref}
        className="relative min-h-[14rem] flex-1 overflow-hidden md:min-h-[16rem]"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(33,56,184,0.25),transparent_70%)]"
          aria-hidden
        />
        {richVisuals ? (
          sceneReady && <StrengthAiScene interaction={interaction} />
        ) : (
          <RobotPoster hopKey={hopKey} />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 via-30% to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex flex-col justify-end p-6 md:p-7">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-text">
          {eyebrow}
        </p>
        <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          {description}
        </p>
      </div>
    </article>
  );
}
