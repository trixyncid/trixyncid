"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Timeline } from "@/components/ui/timeline";
import { FilterPills } from "@/components/ui/filter-pills";
import { HoverEffectGrid } from "@/components/ui/card-hover-effect";
import {
  processStepKeys,
  serviceCategoryKeys,
  serviceFilterKeys,
  servicesForFilter,
  type ServiceFilterKey,
} from "@/content/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { ServiceCard } from "./service-card";

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
      <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
        {t(`process.steps.${step}.description`)}
      </p>
    ),
  }));

  return (
    <>
      <SectionShell containerSize="wide" className="pb-10 md:pb-14">
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto max-w-3xl"
        />

        <ScrollReveal delay={0.06} className="mt-2">
          <FilterPills
            className="justify-center"
            options={serviceFilterKeys.map((filter) => ({ key: filter, label: t(filterLabelKey(filter)) }))}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </ScrollReveal>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <HoverEffectGrid className="gap-6 lg:grid-cols-2 lg:gap-8">
              {visibleServices.map((service) => (
                <div key={service.id} className="reveal h-full">
                  <ServiceCard
                    title={t(`items.${service.id}.title`)}
                    categoryLabel={t(serviceCategoryKeys[service.category])}
                    problemLabel={t("labels.problem")}
                    buildLabel={t("labels.build")}
                    outcomeLabel={t("labels.outcome")}
                    problem={t(`items.${service.id}.problem`)}
                    build={t(`items.${service.id}.build`)}
                    outcome={t(`items.${service.id}.outcome`)}
                  />
                </div>
              ))}
            </HoverEffectGrid>
          </motion.div>
        </AnimatePresence>
      </SectionShell>

      <SectionShell containerSize="wide" className="pt-10 md:pt-14">
        {/* Desktop: the heading holds its place on the left while the steps scroll past on the right. */}
        <div className="grid gap-4 lg:grid-cols-[4fr_8fr] lg:gap-12">
          <ScrollReveal className="max-w-2xl lg:sticky lg:top-32 lg:self-start lg:pt-24">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-[2.5rem] md:leading-tight">
              {t("process.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{t("process.subtitle")}</p>
          </ScrollReveal>
          <div className="[&_.max-w-7xl]:!px-0 [&>div]:!bg-transparent [&>div]:md:!px-0">
            <Timeline data={timelineData} />
          </div>
        </div>
      </SectionShell>
    </>
  );
}
