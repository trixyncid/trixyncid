import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  animate?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  animate = true,
}: PageHeaderProps) {
  const content = (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl md:leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );

  if (!animate) return content;

  return <ScrollReveal>{content}</ScrollReveal>;
}
