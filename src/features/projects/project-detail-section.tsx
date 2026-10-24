import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { projects, type ProjectItem } from "@/content/projects";
import { HeroReveal, ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { Timeline } from "@/components/ui/timeline";
import { HoverEffectGrid } from "@/components/ui/card-hover-effect";
import { type Locale } from "@/i18n/routing";

const categoryLabelKeys = {
  software: "filterSoftware",
  enterprise: "filterEnterprise",
  web: "filterWeb",
} as const;

/** "PT Mitra Laju Interocean · Logistics" → ["PT Mitra Laju Interocean", "Logistics"] */
function splitClient(client: string) {
  const [name, industry] = client.split(" · ");
  return { name: name ?? client, industry: industry ?? "" };
}

/**
 * The outcome as a statement whose words brighten line by line as it scrolls
 * into the reading zone (`.word-reveal` in globals.css). The full sentence is
 * plain text in the HTML; languages written without spaces split per character.
 */
function RevealStatement({ text }: { text: string }) {
  const parts = /\s/.test(text) ? text.split(/(\s+)/) : Array.from(text);
  return (
    <p className="word-reveal max-w-4xl font-heading text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-4xl md:leading-[1.2]">
      {parts.map((part, index) => (/^\s+$/.test(part) ? part : <span key={index}>{part}</span>))}
    </p>
  );
}

type ProjectDetailSectionProps = {
  project: ProjectItem;
};

/**
 * A case study: the facts up front, the product large (it settles to full
 * size and drifts as it scrolls), the story on the site's scroll rail, the
 * outcome as a statement, then the next case study. All motion is CSS, so
 * every word is in the server HTML for search and answer engines.
 */
export function ProjectDetailSection({ project }: ProjectDetailSectionProps) {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const prefix = `/${locale}`;
  const ns = `items.${project.id}` as const;
  const client = splitClient(t(`${ns}.client`));

  const next = projects[(projects.findIndex((p) => p.id === project.id) + 1) % projects.length]!;

  const facts = [
    { label: t("caseStudy.client"), value: client.name },
    { label: t("caseStudy.industry"), value: client.industry },
    { label: t("caseStudy.category"), value: t(categoryLabelKeys[project.category]) },
    { label: t("caseStudy.stack"), value: project.tags.join(" · ") },
  ].filter((fact) => fact.value);

  const story = (["problem", "approach", "solution"] as const).map((key) => ({
    title: t(`caseStudy.${key}`),
    content: (
      <p className="text-base leading-relaxed text-foreground/80 md:text-lg">{t(`${ns}.${key}`)}</p>
    ),
  }));

  return (
    <article>
      <SectionShell containerSize="wide" className="pb-0 md:pb-0">
        <HeroReveal>
          <Link
            href={`${prefix}/projects`}
            className="group/back inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover/back:-translate-x-0.5" />
            {t("caseStudy.back")}
          </Link>
        </HeroReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
          <div>
            <HeroReveal delay={0.04}>
              <p className="text-sm font-medium text-brand-text">{t(categoryLabelKeys[project.category])}</p>
            </HeroReveal>
            {/* The page title paints at once; no entrance on the h1. */}
            <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground md:text-6xl">
              {t(`${ns}.title`)}
            </h1>
            <HeroReveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">{t(`${ns}.description`)}</p>
            </HeroReveal>
            {project.liveUrl && (
              <HeroReveal delay={0.16}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-[background-color,scale] duration-150 hover:bg-brand-light active:scale-[0.97]"
                >
                  {t("caseStudy.visitSite")}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </HeroReveal>
            )}
          </div>

          <HeroReveal delay={0.12}>
            <dl className="grid gap-x-8 gap-y-5 rounded-3xl bg-card p-6 sm:grid-cols-2 md:p-7">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                  <dd className="mt-1 text-base font-medium text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </HeroReveal>
        </div>

        {/* The product, large: settles to full size and drifts inside its frame as it scrolls. */}
        <div className="case-media relative mt-12 aspect-[10/7] overflow-clip rounded-3xl bg-card md:mt-16 lg:aspect-[16/9]">
          <div className="case-media-img absolute inset-x-0 -inset-y-[5%]">
            <Image
              src={project.image}
              alt={`${t(`${ns}.title`)}: ${t(`${ns}.description`)}`}
              fill
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell containerSize="wide">
        <div className="grid gap-4 lg:grid-cols-[4fr_8fr] lg:gap-12">
          <ScrollReveal className="max-w-2xl lg:sticky lg:top-32 lg:self-start lg:pt-24">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-[2.5rem] md:leading-tight">
              {t("caseStudy.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{t("caseStudy.subtitle")}</p>
          </ScrollReveal>
          <div className="[&_.max-w-7xl]:!px-0 [&>div]:!bg-transparent [&>div]:md:!px-0">
            <Timeline data={story} />
          </div>
        </div>
      </SectionShell>

      <SectionShell containerSize="wide">
        <h2 className="text-sm font-medium text-brand-text">{t("caseStudy.outcome")}</h2>
        <div className="mt-5">
          <RevealStatement text={t(`${ns}.outcome`)} />
        </div>
      </SectionShell>

      <SectionShell containerSize="wide" className="pt-0 md:pt-0">
        <ScrollReveal>
          <h2 className="text-sm font-medium text-muted-foreground">{t("caseStudy.next")}</h2>
        </ScrollReveal>
        <HoverEffectGrid className="mt-5">
          <ScrollReveal className="h-full">
            <Link
              href={`${prefix}/projects/${next.id}`}
              className="group/next grid h-full overflow-clip rounded-3xl bg-card md:grid-cols-[5fr_7fr]"
            >
              <div className="flex flex-col justify-center gap-3 p-7 md:p-10">
                <p className="text-sm text-muted-foreground">{t(`items.${next.id}.client`)}</p>
                <p className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-4xl md:leading-tight">
                  {t(`items.${next.id}.title`)}
                </p>
                <p className="text-base leading-relaxed text-foreground/80">{t(`items.${next.id}.description`)}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover/next:text-brand-text">
                  {t("viewCaseStudy")}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/next:-translate-y-0.5 group-hover/next:translate-x-0.5" />
                </span>
              </div>
              <div className="relative aspect-[10/7] md:aspect-auto">
                <Image
                  src={next.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover/next:scale-[1.03]"
                />
              </div>
            </Link>
          </ScrollReveal>
        </HoverEffectGrid>
      </SectionShell>
    </article>
  );
}
