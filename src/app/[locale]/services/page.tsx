import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata, localeUrl } from "@/lib/metadata";
import { pageBreadcrumbJsonLd, servicesJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { services } from "@/content/services";
import { type Locale } from "@/i18n/routing";
import { ServicesGridSection } from "@/features/services";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.services" });
  return createPageMetadata({
    locale: locale as Locale,
    path: "/services",
    meta: { title: t("title"), description: t("description") },
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tNav = await getTranslations("nav");

  const structuredData = [
    pageBreadcrumbJsonLd({
      locale: locale as Locale,
      homeName: tNav("home"),
      trail: [{ name: tNav("services"), path: "/services" }],
    }),
    servicesJsonLd({
      locale: locale as Locale,
      url: localeUrl(locale as Locale, "/services"),
      items: services.map((service) => ({
        name: t(`items.${service.id}.title`),
        description: t(`items.${service.id}.outcome`),
      })),
    }),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicesGridSection />
    </>
  );
}
