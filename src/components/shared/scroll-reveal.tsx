import { cn } from "@/lib/utils";

/*
 * Scroll reveals play once as content enters the viewport, then stay shown
 * (see `.reveal` in globals.css and `RevealObserver`). These wrappers only add
 * classes, so they work in server components, and content is always visible
 * in the server HTML.
 */

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Extra delay (seconds) before this block plays its entrance. */
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <div
      className={cn("reveal", className)}
      style={
        delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}

type ScrollStaggerProps = {
  children: React.ReactNode;
  className?: string;
};

/** Children wrapped in `ScrollStaggerItem` reveal one after another as they enter together. */
export function ScrollStagger({ children, className }: ScrollStaggerProps) {
  return <div className={cn("reveal-stagger", className)}>{children}</div>;
}

export function ScrollStaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
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
