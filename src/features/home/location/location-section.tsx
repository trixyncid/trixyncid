"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/content/site";
import { projects } from "@/content/projects";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";

const locationStatKeys = ["projects", "homeBase", "reach"] as const;

export function LocationSection() {
  const t = useTranslations("home.location");

  return (
    <SectionShell id="location" className="pb-8 md:pb-10">
      <div className="grid gap-10 border-t border-border/50 pt-14 md:grid-cols-[1fr_1.2fr] md:gap-16 md:pt-16">
        <ScrollReveal>
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/60">
              <MapPin className="h-4 w-4 text-brand-light" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("eyebrow")}
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {t("title")}
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <p className="max-w-xl text-base leading-[1.75] text-muted-foreground">{t("description")}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {locationStatKeys.map((key) => (
              <div key={key}>
                <p className="font-heading text-2xl font-semibold text-foreground">
                  {t(`stats.${key}.value`, { count: projects.length })}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t(`stats.${key}.label`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground/80">
            {siteConfig.address.city}, {siteConfig.address.region}, {siteConfig.address.country}
          </p>
        </ScrollReveal>
      </div>
    </SectionShell>
  );
}
