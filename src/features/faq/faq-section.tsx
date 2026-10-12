"use client";

import { useMemo, useState } from "react";
import { Building2, Cpu, LifeBuoy, Route } from "lucide-react";
import { useTranslations } from "next-intl";
import { TracingBeam } from "@/components/ui/tracing-beam";
import {
  faqCategoryKeys,
  faqIdsForCategory,
  type FaqCategoryKey,
  type FaqId,
} from "@/content/faq";
import { FaqAccordionItem } from "@/features/faq/faq-accordion-item";
import { PageHeader } from "@/components/shared/PageHeader";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

const categoryIcons = {
  studio: Building2,
  process: Route,
  technical: Cpu,
  support: LifeBuoy,
} as const;

export function FaqSection() {
  const t = useTranslations("faq");

  const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>("all");
  const [openId, setOpenId] = useState<FaqId | null>("what-is-trixync");

  const visibleIds = useMemo(
    () => faqIdsForCategory(activeCategory),
    [activeCategory],
  );

  function handleCategoryChange(category: FaqCategoryKey) {
    setActiveCategory(category);
    const nextIds = faqIdsForCategory(category);
    setOpenId(nextIds[0] ?? null);
  }

  return (
    <>
      <SectionShell containerSize="wide" className="pb-10 md:pb-14">
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto max-w-3xl"
        />

        <ScrollReveal delay={0.06} className="relative mt-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {faqCategoryKeys.map((category) => {
              const isActive = activeCategory === category;
              const Icon = category === "all" ? null : categoryIcons[category];

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "border-brand/35 bg-brand/10 text-foreground shadow-[0_4px_20px_rgba(33,56,184,0.12)]"
                      : "border-border/60 bg-card/30 text-muted-foreground hover:border-brand/20 hover:text-foreground",
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-brand-text" />}
                  {t(`categories.${category}`)}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="relative mt-12 md:mt-14">
          <TracingBeam className="max-w-3xl px-1 md:px-0">
            <LayoutGroup>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeCategory}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3 md:space-y-4"
                >
                  {visibleIds.map((id, index) => (
                    <FaqAccordionItem
                      key={id}
                      index={index}
                      question={t(`items.${id}.question`)}
                      answer={t(`items.${id}.answer`)}
                      isOpen={openId === id}
                      onToggle={() => setOpenId((current) => (current === id ? null : id))}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </LayoutGroup>
          </TracingBeam>
        </ScrollReveal>
      </SectionShell>
    </>
  );
}
