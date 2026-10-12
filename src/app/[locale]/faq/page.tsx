import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { faqIds } from "@/content/faq";
import { faqJsonLd, pageBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { type Locale } from "@/i18n/routing";
import { FaqSection } from "@/features/faq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.faq" });
  return createPageMetadata({
    locale: locale as Locale,
    path: "/faq",
    meta: { title: t("title"), description: t("description") },
  });
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const tNav = await getTranslations("nav");

  const faqItems = faqIds.map((id) => ({
    question: t(`items.${id}.question`),
    answer: t(`items.${id}.answer`),
  }));

  return (
    <>
      <JsonLd
        data={[
          pageBreadcrumbJsonLd({
            locale: locale as Locale,
            homeName: tNav("home"),
            trail: [{ name: tNav("faq"), path: "/faq" }],
          }),
          faqJsonLd(faqItems),
        ]}
      />
      <FaqSection />
    </>
  );
}
