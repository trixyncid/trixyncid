"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useDeferredMount } from "@/hooks/use-deferred-mount";
import { useRichVisuals } from "@/hooks/use-rich-visuals";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("./hero-scene.client").then((m) => m.HeroScene), {
  ssr: false,
});

/** Matches the poster's `duration-700` fade. */
const POSTER_FADE_MS = 700;

/**
 * Image-first hero visual (the GitHub-globe approach): every device paints a
 * pre-rendered poster of the sync core immediately; capable desktops then load
 * the live WebGL scene in the background and cross-fade to it. The poster is a
 * render of the scene's first frame, and the scene holds that exact pose until
 * the fade is over, so the hand-over is invisible. Scrolling away fades,
 * shrinks and lowers the whole visual via a CSS scroll timeline.
 */
export function HeroVisual() {
  const reduced = useReducedMotion();
  const richVisuals = useRichVisuals();
  const effectsReady = useDeferredMount({ timeout: 3000, disabled: reduced === true });
  const [live, setLive] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!live) return;
    const id = window.setTimeout(() => setStarted(true), POSTER_FADE_MS);
    return () => window.clearTimeout(id);
  }, [live]);

  return (
    <div
      aria-hidden
      className={cn(
        "hero-visual pointer-events-none absolute aspect-square",
        // Phones/tablets: centred below the call-to-action (GitHub-style), never
        // behind the copy. Desktop: its own column to the right of the text.
        "left-1/2 top-full w-[min(112vw,34rem)] -translate-x-1/2 -translate-y-[14%]",
        "lg:left-auto lg:right-[-2%] lg:top-1/2 lg:w-[min(48vw,42rem)] lg:translate-x-0 lg:-translate-y-1/2",
      )}
    >
      {/* Scroll-away (fade, shrink, lower) is a CSS scroll-driven animation. */}
      <div className="hero-visual-scroll absolute inset-0">
      <div className={cn("absolute inset-0 transition-opacity duration-700", live && "opacity-0")}>
        <Image
          src="/hero/sync-core-frame0-dark.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 42rem, 100vw"
          loading="eager"
          fetchPriority="high"
          className="hidden object-contain dark:block"
        />
        <Image
          src="/hero/sync-core-frame0-light.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 42rem, 100vw"
          loading="eager"
          fetchPriority="high"
          className="object-contain dark:hidden"
        />
      </div>
      {richVisuals === true && effectsReady && (
        <HeroScene
          onReady={() => setLive(true)}
          started={started}
          className={cn("transition-opacity duration-700", live ? "opacity-100" : "opacity-0")}
        />
      )}
      </div>
    </div>
  );
}
