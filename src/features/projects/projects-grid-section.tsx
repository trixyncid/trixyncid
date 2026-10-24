"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { projects, type ProjectCategory } from "@/content/projects";
import { ProjectShowcaseCard } from "@/components/shared/project-showcase-card";
import { ScrollReveal, ScrollStaggerItem } from "@/components/shared/scroll-reveal";
import { HoverEffectGrid } from "@/components/ui/card-hover-effect";
import { FilterPills } from "@/components/ui/filter-pills";
import { SectionShell } from "@/components/shared/SectionShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { type Locale } from "@/i18n/routing";

type FilterKey = "all" | ProjectCategory;

const filters: { key: FilterKey; labelKey: string }[] = [
  { key: "all", labelKey: "filterAll" },
  { key: "software", labelKey: "filterSoftware" },
  { key: "enterprise", labelKey: "filterEnterprise" },
  { key: "web", labelKey: "filterWeb" },
];

const categoryLabelKeys = {
  software: "filterSoftware",
  enterprise: "filterEnterprise",
  web: "filterWeb",
} as const;

export function ProjectsGridSection() {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const prefix = `/${locale}`;
  const [active, setActive] = useState<FilterKey>("all");

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <SectionShell containerSize="wide">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        className="mx-auto max-w-3xl"
      />
      <ScrollReveal delay={0.05}>
        <FilterPills
          className="mb-10 justify-center"
          options={filters.map((filter) => ({ key: filter.key, label: t(filter.labelKey) }))}
          active={active}
          onChange={setActive}
        />
      </ScrollReveal>

      <HoverEffectGrid key={active} className="gap-8 md:grid-cols-2">
        {filtered.map((project) => (
          <ScrollStaggerItem key={project.id}>
            <ProjectShowcaseCard
              title={t(`items.${project.id}.title`)}
              description={t(`items.${project.id}.description`)}
              client={t(`items.${project.id}.client`)}
              categoryLabel={t(categoryLabelKeys[project.category])}
              image={project.image}
              href={`${prefix}/projects/${project.id}`}
              linkLabel={t("viewCaseStudy")}
            />
          </ScrollStaggerItem>
        ))}
      </HoverEffectGrid>
    </SectionShell>
  );
}
