import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { siteConfig } from "@/content/site";
import { getProject, projectIds } from "@/content/projects";
import { ProjectDetailSection } from "@/features/projects/project-detail-section";
import { createPageMetadata, notFoundMetadata } from "@/lib/metadata";
import { pageBreadcrumbJsonLd, projectPageJsonLd } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projectIds.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);

  if (!project) {
    const tCommon = await getTranslations({ locale, namespace: "common" });
    return notFoundMetadata(tCommon("notFound.title"));
  }

  const t = await getTranslations({ locale, namespace: `projects.items.${slug}` });

  return createPageMetadata({
    locale: locale as Locale,
    path: `/projects/${slug}`,
    meta: {
      title: `${t("title")} — Trixync`,
      description: t("description"),
    },
    image: `${siteConfig.url}${project.image}`,
    imageAlt: t("title"),
    openGraphType: "article",
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: `projects.items.${slug}` });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const pageUrl = `${siteConfig.url}/${locale}/projects/${slug}`;

  const structuredData = [
    pageBreadcrumbJsonLd({
      locale: locale as Locale,
      homeName: tNav("home"),
      trail: [
        { name: tNav("projects"), path: "/projects" },
        { name: t("title"), path: `/projects/${slug}` },
      ],
    }),
    projectPageJsonLd({
      locale: locale as Locale,
      name: t("title"),
      description: t("description"),
      url: pageUrl,
      image: project.image,
      keywords: project.tags,
    }),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <ProjectDetailSection project={project} />
    </>
  );
}
