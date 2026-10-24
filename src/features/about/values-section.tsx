"use client";

import { useTranslations } from "next-intl";
import { valueKeys, valueVisualMeta } from "@/content/about";
import { PillarCard } from "./pillar-card";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";

export function ValuesSection() {
  const t = useTranslations("about.values");

  return (
    <>
      <SectionShell containerSize="wide">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>
        </ScrollReveal>

        <ScrollStagger className="grid gap-4 md:grid-cols-3 md:gap-6">
          {valueKeys.map((key) => {
            const meta = valueVisualMeta[key];
            const Icon = meta.icon;

            return (
              <ScrollStaggerItem key={key} className="h-full">
                <PillarCard
                  title={t(`items.${key}.title`)}
                  description={t(`items.${key}.description`)}
                  icon={Icon}
                  accent={meta.accent}
                  glow={meta.glow}
                  className="min-h-[14rem]"
                />
              </ScrollStaggerItem>
            );
          })}
        </ScrollStagger>
      </SectionShell>
    </>
  );
}
