import { cn } from "@/lib/utils";

type AboutStoryBeatProps = {
  index: number;
  title: string;
  text: string;
};

export function AboutStoryBeat({ index, title, text }: AboutStoryBeatProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/30 p-6 dark:bg-card/20 md:p-7",
        "transition-[border-color,box-shadow] duration-300 hover:border-brand/25 hover:shadow-[0_8px_32px_rgba(33,56,184,0.06)] dark:hover:shadow-[0_8px_32px_rgba(56,102,242,0.1)]",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex items-start gap-4 md:gap-5">
        <span className="mt-0.5 shrink-0 font-heading text-sm font-semibold tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-brand-text">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] md:leading-7">
            {text}
          </p>
        </div>
      </div>
    </article>
  );
}
