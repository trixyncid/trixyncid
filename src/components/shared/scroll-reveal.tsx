"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealPhase = "static" | "hidden" | "shown";

/**
 * Content is visible in the server HTML (no JS, crawlers, fast LCP). After
 * hydration, only elements still below the viewport are hidden and then
 * revealed as they scroll in — anything already on screen never flashes.
 */
function useRevealPhase(ref: React.RefObject<HTMLElement | null>, amount: number) {
  const [phase, setPhase] = useState<RevealPhase>("static");
  // Only read inside effects, so the server/client mismatch of this hook is harmless.
  const disabled = useReducedMotion() === true;

  useEffect(() => {
    const node = ref.current;
    if (disabled || !node || typeof IntersectionObserver === "undefined") return;

    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          // Already visible (or scrolled past) on load: leave it alone.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            observer.disconnect();
            return;
          }
          setPhase("hidden");
          return;
        }
        if (entry.isIntersecting) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, amount, disabled]);

  return disabled ? "static" : phase;
}

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

export function ScrollReveal({ children, className, delay = 0, amount = 0.15 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const phase = useRevealPhase(ref, amount);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={phase === "hidden" ? { opacity: 0 } : { opacity: 1 }}
      transition={phase === "hidden" ? { duration: 0 } : { duration: 0.28, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type ScrollStaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
};

export function ScrollStagger({ children, className, stagger = 0.05, amount = 0.12 }: ScrollStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const phase = useRevealPhase(ref, amount);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={phase === "hidden" ? "hidden" : "visible"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollStaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, transition: { duration: 0 } },
        visible: { opacity: 1, transition: { duration: 0.28, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

type HeroRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Entrance for above-the-fold hero content. Pure CSS so it runs from first
 * paint without waiting for hydration; reduced-motion users get it instantly.
 */
export function HeroReveal({ children, className, delay = 0 }: HeroRevealProps) {
  return (
    <div className={cn("hero-reveal", className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
