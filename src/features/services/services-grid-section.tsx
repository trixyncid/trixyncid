"use client";

import { useMemo, useState } from "react";
import {
  Cpu,
  Globe,
  LayoutGrid,
  LifeBuoy,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Timeline } from "@/components/ui/timeline";
import { AnimatePresence, motion } from "motion/react";
import {
  processStepKeys,
  serviceCategoryKeys,
  serviceFilterKeys,
  serviceVisualMeta,
  servicesForFilter,
  type ServiceFilterKey,
} from "@/content/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { cn } from "@/lib/utils";
import { ServiceCard } from "./service-card";

const iconMap = {
  workflow: Workflow,
  smartphone: Smartphone,
  globe: Globe,
  sparkles: Sparkles,
  cpu: Cpu,
  lifebuoy: LifeBuoy,
} as const;

const filterIcons: Record<ServiceFilterKey, typeof LayoutGrid> = {
  all: LayoutGrid,
  software: Workflow,
  intelligent: Sparkles,
  support: LifeBuoy,
};

function filterLabelKey(filter: ServiceFilterKey) {
  return filter === "all" ? "categories.all" : serviceCategoryKeys[filter];
}

export function ServicesGridSection() {
  const t = useTranslations("services");

  const [activeFilter, setActiveFilter] = useState<ServiceFilterKey>("all");

  const visibleServices = useMemo(
    () => servicesForFilter(activeFilter),
    [activeFilter],
  );

  const timelineData = processStepKeys.map((step) => ({
    title: t(`process.steps.${step}.title`),
    content: (
      <div className="rounded-2xl border border-border/60 bg-card/30 p-5 dark:bg-card/20 md:p-6">
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {t(`process.steps.${step}.description`)}
        </p>
      </div>
    ),
  }));

  return (
    <>
      <SectionShell containerSize="wide" className="pb-10 md:pb-14">
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto max-w-3xl"
        />

        <ScrollReveal delay={0.06} className="mt-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {serviceFilterKeys.map((filter) => {
              const isActive = activeFilter === filter;
              const Icon = filterIcons[filter];

              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "border-brand/35 bg-brand/10 text-foreground shadow-[0_4px_20px_rgba(33,56,184,0.12)]"
                      : "border-border/60 bg-card/30 text-muted-foreground hover:border-brand/20 hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-brand-text" />
                  {t(filterLabelKey(filter))}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeFilter}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8"
          >
            {visibleServices.map((service, index) => {
              const Icon = iconMap[service.icon];
              const meta = serviceVisualMeta[service.id];

              return (
                <ServiceCard
                  key={service.id}
                  index={index}
                  title={t(`items.${service.id}.title`)}
                  categoryLabel={t(serviceCategoryKeys[service.category])}
                  problemLabel={t("labels.problem")}
                  buildLabel={t("labels.build")}
                  outcomeLabel={t("labels.outcome")}
                  problem={t(`items.${service.id}.problem`)}
                  build={t(`items.${service.id}.build`)}
                  outcome={t(`items.${service.id}.outcome`)}
                  icon={Icon}
                  accent={meta.accent}
                  glow={meta.glow}
                  iconBg={meta.iconBg}
                  className="h-full"
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </SectionShell>

      <div className="section-divider mx-auto max-w-4xl opacity-50" aria-hidden />

      <SectionShell containerSize="wide" className="pt-10 md:pt-14">
        <ScrollReveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("process.eyebrow")}
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("process.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("process.subtitle")}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="[&_.max-w-7xl]:!px-0 [&>div]:!bg-transparent">
            <Timeline data={timelineData} />
          </div>
        </ScrollReveal>
      </SectionShell>
    </>
  );
}
