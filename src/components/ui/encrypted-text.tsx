"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type EncryptedTextProps = {
  text: string;
  className?: string;
  revealDelayMs?: number;
  charset?: string;
  flipDelayMs?: number;
  encryptedClassName?: string;
  revealedClassName?: string;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length);
  return charset.charAt(index);
}

/** Deterministic scramble — identical on server and client for hydration. */
function deterministicScramble(text: string, charset: string): string[] {
  return text.split("").map((char, index) => {
    if (char === " ") return " ";
    return charset[(char.charCodeAt(0) + index * 17) % charset.length]!;
  });
}

export function EncryptedText({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
}: EncryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const [revealCount, setRevealCount] = useState(0);
  const [scrambleChars, setScrambleChars] = useState(() =>
    text ? deterministicScramble(text, charset) : [],
  );

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const lastFlipTimeRef = useRef(0);

  useEffect(() => {
    if (!isInView || !text) return;

    startTimeRef.current = performance.now();
    // Backdate the last flip so the first frame re-scrambles (and resets) immediately.
    lastFlipTimeRef.current = startTimeRef.current - flipDelayMs;

    let isCancelled = false;
    let currentScramble = deterministicScramble(text, charset);

    const update = (now: number) => {
      if (isCancelled) return;

      const elapsedMs = now - startTimeRef.current;
      const currentRevealCount = Math.min(
        text.length,
        Math.floor(elapsedMs / Math.max(1, revealDelayMs)),
      );

      const timeSinceLastFlip = now - lastFlipTimeRef.current;
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        currentScramble = currentScramble.map((char, index) => {
          if (index < currentRevealCount || text[index] === " ") return char;
          return generateRandomCharacter(charset);
        });
        lastFlipTimeRef.current = now;
        setScrambleChars([...currentScramble]);
      }

      setRevealCount(currentRevealCount);

      if (currentRevealCount < text.length) {
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      isCancelled = true;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView, text, revealDelayMs, charset, flipDelayMs]);

  if (!text) return null;

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      aria-label={text}
      role="text"
      suppressHydrationWarning
    >
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount;
        const displayChar = isRevealed ? char : scrambleChars[index] ?? "#";

        return (
          <span
            key={index}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {displayChar}
          </span>
        );
      })}
    </motion.span>
  );
}
