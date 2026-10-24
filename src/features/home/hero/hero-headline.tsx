import { cn } from "@/lib/utils";

type HeroHeadlineProps = {
  children: React.ReactNode;
  className?: string;
};

/** The page's h1. It is the LCP element, so it paints immediately with no entrance. */
export function HeroHeadline({ children, className }: HeroHeadlineProps) {
  return (
    <h1
      className={cn(
        "max-w-2xl font-heading text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[1.04]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
