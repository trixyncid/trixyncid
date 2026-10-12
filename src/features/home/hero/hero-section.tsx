"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { HeroHeadline } from "./hero-headline";
import { HeroReveal } from "@/components/shared/scroll-reveal";
import { useDeferredMount } from "@/hooks/use-deferred-mount";
import { useRichVisuals } from "@/hooks/use-rich-visuals";
import { type Locale } from "@/i18n/routing";

const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then((m) => m.BackgroundBeams),
  { ssr: false },
);

const HeroScene = dynamic(() => import("./hero-scene.client").then((m) => m.HeroScene), {
  ssr: false,
});

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
  const reducedMotion = useReducedMotion();
  // WebGL + animated beams only on capable desktops; phones, tablets and
  // low-power machines get the static gradient backdrop.
  const richVisuals = useRichVisuals();
  const effectsReady = useDeferredMount({
    timeout: 3000,
    disabled: reducedMotion === true,
  });

  return (
    <section className="relative -mt-20 min-h-[85svh] overflow-visible pb-20 pt-[calc(var(--site-header-height)+3rem)] md:pb-28 md:pt-[calc(var(--site-header-height)+4rem)]">
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_92%)]">
        <HeroBackdrop />
        {effectsReady && richVisuals && (
          <>
            <BackgroundBeams className="absolute inset-0 h-full w-full opacity-25 dark:opacity-40" />
            <HeroScene />
          </>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_22%,black_44%,black_100%)] dark:from-background/75 dark:via-background/25"
          aria-hidden
        />
        <div className="grain-overlay absolute inset-0 opacity-40 max-md:hidden" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <HeroReveal delay={0}>
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("eyebrow")}
            </p>
          </HeroReveal>

          {/* The headline is the LCP element, so it paints immediately with no fade. */}
          <HeroHeadline line1={t("headline")} line2={t("headlineHighlight")} />

          <HeroReveal delay={0.08}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
              {t("subheadline")}
            </p>
          </HeroReveal>

          <HeroReveal delay={0.16}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href={`${prefix}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-light"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href={`${prefix}/projects`}
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-foreground/30 hover:text-foreground"
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
