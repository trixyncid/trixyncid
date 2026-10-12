"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const subscribe = () => () => {};

/**
 * Defers prefers-reduced-motion until after hydration so SSR markup matches the
 * first client paint (motion wrappers stay consistent during hydration).
 */
export function useHydrationSafeReducedMotion() {
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return hydrated && prefersReduced;
}
