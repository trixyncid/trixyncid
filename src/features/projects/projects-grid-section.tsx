"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { projects, type ProjectCategory } from "@/content/projects";
import { ProjectShowcaseCard } from "@/components/shared/project-showcase-card";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

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
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        className="mx-auto max-w-3xl"
      />
      <ScrollReveal delay={0.05}>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              aria-pressed={active === filter.key}
              onClick={() => setActive(filter.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active === filter.key
                  ? "bg-brand text-primary-foreground"
                  : "border border-border/60 text-muted-foreground hover:border-brand-light hover:text-foreground",
              )}
            >
              {t(filter.labelKey)}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <ScrollStagger key={active} className="grid gap-8 md:grid-cols-2">
        {filtered.map((project) => (
          <ScrollStaggerItem key={project.id}>
            <ProjectShowcaseCard
              title={t(`items.${project.id}.title`)}
              description={t(`items.${project.id}.description`)}
              client={t(`items.${project.id}.client`)}
              category={project.category}
              categoryLabel={t(categoryLabelKeys[project.category])}
              image={project.image}
              href={`${prefix}/projects/${project.id}`}
              linkLabel={t("viewCaseStudy")}
            />
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>
    </SectionShell>
  );
}
