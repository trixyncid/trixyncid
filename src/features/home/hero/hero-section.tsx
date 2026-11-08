"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { HeroHeadline } from "./hero-headline";
import { HeroVisual } from "./hero-visual";
import { HeroReveal } from "@/components/shared/scroll-reveal";
import { type Locale } from "@/i18n/routing";

function HeroBackdrop() {
  return (
    <div
      className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(33,56,184,0.16),transparent_62%),radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(33,56,184,0.14),transparent_65%),radial-gradient(ellipse_50%_40%_at_20%_60%,rgba(56,102,242,0.05),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(33,56,184,0.22),transparent_62%),radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(33,56,184,0.2),transparent_65%),radial-gradient(ellipse_50%_40%_at_20%_60%,rgba(56,102,242,0.08),transparent_55%)]"
      aria-hidden
    />
  );
}

export function HeroSection() {
  const t = useTranslations("home.hero");
  const locale = useLocale() as Locale;
  const prefix = `/${locale}`;

  return (
    <section className="relative -mt-20 overflow-x-clip pb-[min(76vw,21rem)] pt-[calc(var(--site-header-height)+3rem)] md:pt-[calc(var(--site-header-height)+4rem)] lg:pb-12">
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_92%)]">
        <HeroBackdrop />
        <div className="grain-overlay absolute inset-0 opacity-40 max-md:hidden" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroVisual />
        <div className="relative z-10 max-w-2xl">
          <HeroHeadline>{t("headline")}</HeroHeadline>

          <HeroReveal delay={0.08}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-foreground/80 md:text-lg">
              {t("subheadline")}
            </p>
          </HeroReveal>

          <HeroReveal delay={0.16}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href={`${prefix}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-pop px-6 py-3 text-sm font-medium text-pop-ink transition-[background-color,scale] duration-150 hover:bg-pop-light active:scale-[0.97]"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href={`${prefix}/projects`}
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground/90 transition-[border-color,color,scale] duration-150 hover:border-foreground/30 hover:text-foreground active:scale-[0.97]"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </HeroReveal>
        </div>
      </div>
    </section>
  );
}
