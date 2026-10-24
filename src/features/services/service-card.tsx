import { cn } from "@/lib/utils";

type ServiceCardProps = {
  title: string;
  categoryLabel: string;
  problemLabel: string;
  buildLabel: string;
  outcomeLabel: string;
  problem: string;
  build: string;
  outcome: string;
  className?: string;
};

/**
 * One service on a single tone-step surface: the problem and what we build as
 * plain label + text, and the outcome set apart at the foot. Hover is the
 * grid's sliding highlight, not the card's own.
 */
export function ServiceCard({
  title,
  categoryLabel,
  problemLabel,
  buildLabel,
  outcomeLabel,
  problem,
  build,
  outcome,
  className,
}: ServiceCardProps) {
  return (
    <article className={cn("flex h-full flex-col rounded-3xl bg-card p-7 md:p-8", className)}>
      <p className="text-sm font-medium text-brand-text">{categoryLabel}</p>
      <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem] md:leading-tight">
        {title}
      </h3>

      <dl className="mt-6 space-y-5">
        <div>
          <dt className="text-sm text-muted-foreground">{problemLabel}</dt>
          <dd className="mt-1.5 text-base leading-relaxed text-foreground/80">{problem}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{buildLabel}</dt>
          <dd className="mt-1.5 text-base leading-relaxed text-foreground/80">{build}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-7">
        <div className="rounded-2xl bg-background/60 p-5">
          <p className="text-sm font-medium text-brand-text">{outcomeLabel}</p>
          <p className="mt-1.5 text-base leading-relaxed text-foreground">{outcome}</p>
        </div>
      </div>
    </article>
  );
}
