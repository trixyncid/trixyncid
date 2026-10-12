import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { projects } from "@/content/projects";
import { ProjectShowcaseCard } from "@/components/shared/project-showcase-card";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { type Locale } from "@/i18n/routing";

export function FeaturedProjectsSection() {
  const t = useTranslations("home.projects");
  const tProjects = useTranslations("projects.items");
  const tPage = useTranslations("projects");
  const locale = useLocale() as Locale;
  const prefix = `/${locale}`;

  const categoryLabelKeys = {
    software: "filterSoftware",
    enterprise: "filterEnterprise",
    web: "filterWeb",
  } as const;

  const featured = projects.filter((p) => p.featured);

  return (
    <SectionShell id="projects" containerSize="wide">
      <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Link
          href={`${prefix}/projects`}
          className="shrink-0 text-sm font-medium text-brand-text transition-colors hover:text-foreground"
        >
          {t("viewAll")} →
        </Link>
      </ScrollReveal>

      <ScrollStagger className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        {featured.map((project) => (
          <ScrollStaggerItem key={project.id} className="h-full">
            <ProjectShowcaseCard
              size="large"
              title={tProjects(`${project.id}.title`)}
              description={tProjects(`${project.id}.description`)}
              client={tProjects(`${project.id}.client`)}
              category={project.category}
              categoryLabel={tPage(categoryLabelKeys[project.category])}
              image={project.image}
              href={`${prefix}/projects/${project.id}`}
              linkLabel={tPage("viewCaseStudy")}
              className="h-full"
            />
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>
    </SectionShell>
  );
}
