import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { pageBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { type Locale } from "@/i18n/routing";
import { StorySection, ValuesSection, LocationSection } from "@/features/about";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return createPageMetadata({
    locale: locale as Locale,
    path: "/about",
    meta: { title: t("title"), description: t("description") },
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const breadcrumb = pageBreadcrumbJsonLd({
    locale: locale as Locale,
    homeName: tNav("home"),
    trail: [{ name: tNav("about"), path: "/about" }],
  });

  return (
    <>
      <JsonLd data={breadcrumb} />
      <StorySection />
      <ValuesSection />
      <LocationSection />
    </>
  );
}
