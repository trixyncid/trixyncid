import { cn } from "@/lib/utils";

/**
 * A rail beside long-form content (About story, FAQ) that draws itself as you
 * scroll, with a glowing tip — CSS scroll-driven animation (`.scroll-rail*` in
 * globals.css), no client JS. Decorative; hidden on phones where there's no
 * gutter for it.
 */
export function TracingBeam({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("scroll-rail relative mx-auto h-full w-full max-w-4xl", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-10 hidden w-0.5 [container-type:size] md:block lg:-left-16"
      >
        <div className="absolute inset-0 bg-border [mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)]" />
        <div className="scroll-rail-fill absolute inset-0 origin-top rounded-full bg-gradient-to-b from-brand-light via-brand-light to-brand shadow-[0_0_12px_rgba(56,102,242,0.5)]" />
        <div className="scroll-rail-tip absolute -left-[5px] -top-1.5 h-3 w-3 rounded-full bg-brand-light shadow-[0_0_16px_4px_rgba(56,102,242,0.6)]" />
        {/* Start node */}
        <div className="absolute -left-[7px] top-0 h-4 w-4 rounded-full border-2 border-brand-light bg-background" />
      </div>
      {children}
    </div>
  );
}
