"use client";

import { Children, useRef } from "react";
import { cn } from "@/lib/utils";

type HoverEffectGridProps = {
  children: React.ReactNode;
  className?: string;
};

/** Card grid where each card lifts and tilts toward the pointer on hover. */
export function HoverEffectGrid({ children, className }: HoverEffectGridProps) {
  return (
    <div className={cn("grid", className)}>
      {Children.map(children, (child) => (
        <TiltLift>{child}</TiltLift>
      ))}
    </div>
  );
}

/** Degrees of tilt at the card's edge. */
const MAX_TILT = 5;

/**
 * Hover: the card rises, leans a few degrees toward the cursor in 3D, and a
 * soft shadow opens beneath it. The pointer writes CSS variables on the
 * (untransformed) outer box, so moving the mouse never re-renders React and
 * the tilt eases through the transform transition. Mouse only; reduced
 * motion keeps the shadow and drops the movement.
 */
function TiltLift({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || event.pointerType !== "mouse") return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tilt-x", `${(-y * MAX_TILT * 2).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(x * MAX_TILT * 2).toFixed(2)}deg`);
  };

  const handlePointerLeave = () => {
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group/lift h-full [perspective:1200px]"
    >
      <div
        className={cn(
          "relative h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "[transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]",
          "group-hover/lift:[transform:translateY(-8px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]",
          "motion-reduce:transform-none motion-reduce:group-hover/lift:transform-none",
        )}
      >
        {/* The shadow is its own layer so hovering fades opacity, not box-shadow. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/lift:opacity-100",
            "shadow-[0_28px_56px_-20px_rgba(16,23,38,0.30),0_10px_20px_-12px_rgba(16,23,38,0.18)]",
            "dark:shadow-[0_32px_64px_-24px_rgba(56,102,242,0.42),0_12px_24px_-14px_rgba(0,0,0,0.8)]",
          )}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}
