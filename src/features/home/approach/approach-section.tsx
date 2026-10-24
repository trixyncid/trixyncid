"use client";

import { useTranslations } from "next-intl";
import { Timeline } from "@/components/ui/timeline";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";

const stepKeys = ["bottleneck", "design", "build", "support"] as const;

export function ApproachSection() {
  const t = useTranslations("home.approach");

  const data = stepKeys.map((key) => ({
    title: t(`steps.${key}.title`),
    content: (
      <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
        {t(`steps.${key}.description`)}
      </p>
    ),
  }));

  return (
    <SectionShell id="approach">
      {/* Desktop: the heading holds its place on the left while the steps scroll past on the right. */}
      <div className="grid gap-4 lg:grid-cols-[4fr_8fr] lg:gap-12">
        <ScrollReveal className="max-w-2xl lg:sticky lg:top-32 lg:self-start lg:pt-24">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-[2.5rem] md:leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{t("subtitle")}</p>
        </ScrollReveal>
        <div className="[&_.max-w-7xl]:!px-0 [&>div]:!bg-transparent [&>div]:md:!px-0">
          <Timeline data={data} />
        </div>
      </div>
    </SectionShell>
  );
}
