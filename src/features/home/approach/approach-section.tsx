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
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {t(`steps.${key}.description`)}
      </p>
    ),
  }));

  return (
    <SectionShell id="approach">
      <ScrollReveal className="mb-4 max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{t("title")}</h2>
        <p className="mt-3 text-base text-muted-foreground">{t("subtitle")}</p>
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <div className="[&_.max-w-7xl]:!px-0 [&>div]:!bg-transparent">
          <Timeline data={data} />
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
