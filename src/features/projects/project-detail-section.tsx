"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectItem } from "@/content/projects";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const categoryLabelKeys = {
  software: "filterSoftware",
  enterprise: "filterEnterprise",
  web: "filterWeb",
} as const;

const categoryStyles = {
  software: "border-sky-400/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  enterprise: "border-brand-light/30 bg-brand/10 text-brand-text",
  web: "border-violet-400/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
} as const;

type ProjectDetailSectionProps = {
  project: ProjectItem;
};

export function ProjectDetailSection({ project }: ProjectDetailSectionProps) {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const prefix = `/${locale}`;
  const ns = `items.${project.id}` as const;

  const blocks = [
    { key: "problem" as const, label: t("caseStudy.problem") },
    { key: "approach" as const, label: t("caseStudy.approach") },
    { key: "solution" as const, label: t("caseStudy.solution") },
  ];

  return (
    <SectionShell containerSize="wide">
      <ScrollReveal>
        <Link
          href={`${prefix}/projects`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("caseStudy.back")}
        </Link>
      </ScrollReveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:items-start">
        <ScrollReveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-muted/20 shadow-sm">
            <Image
              src={project.image}
              alt={t(`${ns}.title`)}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                  categoryStyles[project.category],
                )}
              >
                {t(categoryLabelKeys[project.category])}
              </span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t(`${ns}.client`)}
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl md:leading-tight">
                {t(`${ns}.title`)}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {t(`${ns}.description`)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-light"
                >
                  {t("caseStudy.visitSite")}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand/30"
                >
                  {t("caseStudy.viewCode")}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="section-divider mx-auto my-14 max-w-4xl opacity-50 md:my-16" aria-hidden />

      <ScrollReveal className="mb-8 max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t("caseStudy.title")}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("caseStudy.subtitle")}</p>
      </ScrollReveal>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {blocks.map((block, index) => (
          <ScrollReveal key={block.key} delay={index * 0.06}>
            <article className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/40 p-6 dark:bg-card/25 md:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-text">
                {block.label}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90 md:text-[0.9375rem]">
                {t(`${ns}.${block.key}`)}
              </p>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal className="mt-8 md:mt-10">
        <div className="rounded-3xl border border-brand/15 bg-brand/[0.04] p-6 dark:border-brand/25 dark:bg-brand/[0.08] md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-text">
            {t("caseStudy.outcome")}
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
            {t(`${ns}.outcome`)}
          </p>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
