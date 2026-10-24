"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

type FrameDriverProps = {
  /** Stop requesting frames entirely (off-screen, overlay open). */
  active: boolean;
  /** Target frame rate; read every frame so it can change without re-rendering. */
  getFps: () => number;
  /** Called once if the device can't keep up (sustained < ~22 fps). */
  onSlow?: () => void;
};

const WARMUP_MS = 1000;
const SAMPLE_FRAMES = 45;
const SLOW_FRAME_MS = 45;
/** A gap this long is a main-thread stall (hydration, a rebuild, GC), not a slow GPU. */
const STALL_FRAME_MS = 250;
/** Consecutive slow sample windows (several seconds) before giving up on the scene. */
const SLOW_WINDOWS = 3;

/**
 * Drives a `frameloop="demand"` canvas at a capped frame rate. Decorative
 * scenes don't need 120 Hz on ProMotion displays — capping saves GPU and
 * battery while staying smooth. Also watches real frame timing so weak GPUs
 * can bail out to the lightweight fallback instead of making the page janky.
 */
export function FrameDriver({ active, getFps, onSlow }: FrameDriverProps) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    let last = 0;
    let previous = 0;
    const startedAt = performance.now();
    let samples = 0;
    let sampleTotal = 0;
    let slowWindows = 0;
    let reported = false;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);

      const gap = now - previous;
      if (onSlow && !reported && previous && gap < STALL_FRAME_MS && now - startedAt > WARMUP_MS && !document.hidden) {
        sampleTotal += gap;
        samples += 1;
        if (samples >= SAMPLE_FRAMES) {
          // Only sustained slowness counts; one bad stretch resets once frames recover.
          slowWindows = sampleTotal / samples > SLOW_FRAME_MS ? slowWindows + 1 : 0;
          if (slowWindows >= SLOW_WINDOWS) {
            reported = true;
            onSlow();
          }
          samples = 0;
          sampleTotal = 0;
        }
      }
      previous = now;

      const interval = 1000 / getFps();
      // Small tolerance so 60 fps targets don't drop frames on 60 Hz screens.
      if (now - last >= interval - 2) {
        last = now;
        invalidate();
      }
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [active, getFps, invalidate, onSlow]);

  return null;
}
