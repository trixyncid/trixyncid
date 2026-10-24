import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { type Locale } from "@/i18n/routing";
import { homeFaqIds } from "@/content/faq";
import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  HeroSection,
  ShowcaseSection,
  ApproachSection,
  FeaturedProjectsSection,
  HomeFaqSection,
} from "@/features/home";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  return createPageMetadata({
    locale: locale as Locale,
    path: "/",
    meta: { title: t("title"), description: t("description") },
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tFaq = await getTranslations("faq.items");

  return (
    <div className="relative">
      <JsonLd
        data={faqJsonLd(
          homeFaqIds.map((id) => ({ question: tFaq(`${id}.question`), answer: tFaq(`${id}.answer`) })),
        )}
      />
      <HeroSection />
      <ShowcaseSection />
      <ApproachSection />
      <FeaturedProjectsSection />
      <HomeFaqSection />
    </div>
  );
}
