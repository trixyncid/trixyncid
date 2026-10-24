"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/content/site";
import { projects } from "@/content/projects";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";

const statKeys = ["projects", "homeBase", "reach"] as const;

export function LocationSection() {
  const t = useTranslations("about.location");

  return (
    <>
      <SectionShell containerSize="wide" className="pb-10 md:pb-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t("title")}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="max-w-xl text-base leading-[1.75] text-muted-foreground">{t("description")}</p>

            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4">
              {statKeys.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl bg-card/60 px-4 py-4"
                >
                  <p className="font-heading text-xl font-semibold text-foreground md:text-2xl">
                    {t(`stats.${key}.value`, { count: projects.length })}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`stats.${key}.label`)}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              {siteConfig.address.city}, {siteConfig.address.region}, {siteConfig.address.country}
            </p>
          </ScrollReveal>
        </div>
      </SectionShell>
    </>
  );
}
