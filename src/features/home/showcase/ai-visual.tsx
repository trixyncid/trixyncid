"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useHeavyEffects } from "@/hooks/use-heavy-effects";
import { useRichVisuals } from "@/hooks/use-rich-visuals";
import { RobotPoster } from "./robot-poster";

import type { RobotInteraction } from "./ai-scene.client";

const AiScene = dynamic(() => import("./ai-scene.client").then((m) => m.AiScene), { ssr: false });

/**
 * The AI companion: the WebGL robot on capable desktops, the SVG robot
 * everywhere else. It leans toward the pointer and hops or pulses on click.
 */
export function AiVisual({ paused = false }: { paused?: boolean }) {
  const reduced = useReducedMotion();
  const richVisuals = useRichVisuals();
  const { ref, ready: sceneReady } = useHeavyEffects({ idleTimeout: 2000 });
  const [hopKey, setHopKey] = useState(0);
  // Pointer moves write to the ref only, so moving the mouse never re-renders React.
  const interaction = useRef<RobotInteraction>({ x: 0, y: 0, hover: false, pulseAt: -Infinity });
  const interactive = !reduced && richVisuals === true;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    interaction.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    interaction.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    interaction.current.hover = true;
  };

  const handlePointerLeave = () => {
    interaction.current = { ...interaction.current, x: 0, y: 0, hover: false };
  };

  const handleClick = () => {
    if (reduced) return;
    interaction.current.pulseAt = performance.now() / 1000;
    if (richVisuals !== true) setHopKey((key) => key + 1);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      className="group absolute inset-0 cursor-pointer motion-reduce:cursor-default"
      aria-hidden
    >
      {richVisuals === true && sceneReady && <AiScene interaction={interaction} paused={paused} />}
      {richVisuals === false && <RobotPoster hopKey={hopKey} />}
    </div>
  );
}
