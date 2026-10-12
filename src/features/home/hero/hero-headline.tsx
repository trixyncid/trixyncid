"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useDeferredMount } from "@/hooks/use-deferred-mount";
import { cn } from "@/lib/utils";

const EncryptedHeadline = dynamic(
  () => import("@/components/ui/encrypted-text").then((m) => m.EncryptedText),
  { ssr: false },
);

type HeroHeadlineProps = {
  line1: string;
  line2: string;
  className?: string;
};

export function HeroHeadline({ line1, line2, className }: HeroHeadlineProps) {
  const reducedMotion = useReducedMotion();
  const enhanceReady = useDeferredMount({
    timeout: 3500,
    disabled: reducedMotion === true,
  });

  return (
    <h1
      className={cn(
        "max-w-3xl font-heading text-[2.125rem] font-semibold leading-[1.12] tracking-[-0.025em] text-foreground sm:text-[2.75rem] sm:leading-[1.08] lg:text-[3.5rem]",
        className,
      )}
    >
      <span className="block">{line1}</span>
      <span className="mt-3 block min-h-[1.15em] font-normal tracking-[-0.02em] text-muted-foreground sm:mt-4 lg:text-[3.25rem]">
        {reducedMotion || !enhanceReady ? (
          line2
        ) : (
          <>
            <span className="sr-only">{line2}</span>
            <EncryptedHeadline
            text={line2}
            revealDelayMs={45}
            flipDelayMs={40}
            className="text-foreground/60"
            encryptedClassName="text-brand-light/35"
            revealedClassName="text-foreground/60"
          />
          </>
        )}
      </span>
    </h1>
  );
}
