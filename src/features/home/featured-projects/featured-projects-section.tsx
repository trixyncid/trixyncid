import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { projects } from "@/content/projects";
import { showcaseProjectIds } from "@/content/showcase";
import { ProjectShowcaseCard } from "@/components/shared/project-showcase-card";
import { ScrollReveal, ScrollStaggerItem } from "@/components/shared/scroll-reveal";
import { HoverEffectGrid } from "@/components/ui/card-hover-effect";
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

  // Projects already shown in the showcase tabs aren't repeated here.
  const featured = projects.filter((p) => p.featured && !showcaseProjectIds.includes(p.id));

  return (
    <SectionShell id="projects" containerSize="wide">
      <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-[2.5rem] md:leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{t("subtitle")}</p>
        </div>
        <Link
          href={`${prefix}/projects`}
          className="shrink-0 text-sm font-medium text-brand-text transition-colors hover:text-foreground"
        >
          {t("viewAll")} →
        </Link>
      </ScrollReveal>

      <HoverEffectGrid className="grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <ScrollStaggerItem key={project.id} className="h-full">
            <ProjectShowcaseCard
              title={tProjects(`${project.id}.title`)}
              description={tProjects(`${project.id}.description`)}
              client={tProjects(`${project.id}.client`)}
              categoryLabel={tPage(categoryLabelKeys[project.category])}
              image={project.image}
              href={`${prefix}/projects/${project.id}`}
              linkLabel={tPage("viewCaseStudy")}
              className="h-full"
            />
          </ScrollStaggerItem>
        ))}
      </HoverEffectGrid>
    </SectionShell>
  );
}
