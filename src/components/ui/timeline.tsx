import type React from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

/**
 * Vertical process timeline. The progress line draws itself as you scroll,
 * and each step's dot and title light up as the line reaches them — all CSS
 * scroll-driven animations (`.scroll-rail*` in globals.css), no client JS.
 * Without scroll-timeline support everything shows in its finished state.
 */
export function Timeline({ data }: { data: TimelineEntry[] }) {
  return (
    <div className="w-full bg-transparent font-sans md:px-10">
      <div className="scroll-rail relative mx-auto max-w-7xl pb-12">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-24">
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center md:left-3">
                <div className="scroll-rail-dot h-4 w-4 rounded-full border border-border bg-muted ring-4 ring-background" />
              </div>
              <h3 className="scroll-rail-text hidden text-xl font-bold text-foreground md:block md:pl-20 md:text-2xl">
                {item.title}
              </h3>
            </div>

            <div className="reveal relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="scroll-rail-text mb-4 block text-left text-xl font-bold text-foreground md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-8 w-0.5 [container-type:size]"
        >
          {/* Faint rail */}
          <div className="absolute inset-0 bg-border [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]" />
          {/* Scroll-drawn fill + glowing tip */}
          <div className="scroll-rail-fill absolute inset-0 origin-top rounded-full bg-pop shadow-[0_0_12px_rgba(200,245,90,0.5)]" />
          <div className="scroll-rail-tip absolute -left-[5px] -top-1.5 h-3 w-3 rounded-full bg-pop shadow-[0_0_16px_4px_rgba(200,245,90,0.6)]" />
        </div>
      </div>
    </div>
  );
}
