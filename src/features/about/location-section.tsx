"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/content/site";
import { projects } from "@/content/projects";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { motion } from "motion/react";

const statKeys = ["projects", "homeBase", "reach"] as const;

export function LocationSection() {
  const t = useTranslations("about.location");

  return (
    <>
      <div className="section-divider mx-auto max-w-4xl opacity-50" aria-hidden />

      <SectionShell containerSize="wide" className="pb-10 md:pb-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <ScrollReveal>
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand-text"
              >
                <MapPin className="h-5 w-5" strokeWidth={1.75} />
              </motion.div>
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

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {statKeys.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl border border-border/60 bg-card/30 px-4 py-4 dark:bg-card/20"
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
