import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { faqIds, homeFaqIds } from "@/content/faq";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { type Locale } from "@/i18n/routing";
import { HomeFaqList } from "./home-faq-list";

/**
 * The questions people ask first. Desktop: heading and the link to every
 * answer on the left, the accordion on the right. Closed answers stay in the
 * HTML, so crawlers and answer engines still read all of them.
 */
export function HomeFaqSection() {
  const t = useTranslations("home.faq");
  const tFaq = useTranslations("faq.items");
  const locale = useLocale() as Locale;

  const items = homeFaqIds.map((id) => ({
    id,
    question: tFaq(`${id}.question`),
    answer: tFaq(`${id}.answer`),
  }));

  return (
    <SectionShell id="faq">
      <div className="grid gap-8 lg:grid-cols-[4fr_8fr] lg:gap-12">
        <ScrollReveal className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-[2.5rem] md:leading-tight">
            {t("title")}
          </h2>
          <Link
            href={`/${locale}/faq`}
            className="mt-5 inline-block text-sm font-semibold text-brand-text transition-colors hover:text-foreground"
          >
            {t("all", { count: faqIds.length })} →
          </Link>
        </ScrollReveal>

        <HomeFaqList items={items} />
      </div>
    </SectionShell>
  );
}
