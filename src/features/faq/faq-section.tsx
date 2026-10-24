"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FilterPills } from "@/components/ui/filter-pills";
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
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

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
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto max-w-3xl"
        />

        <ScrollReveal delay={0.06} className="relative mt-2">
          <FilterPills
            className="justify-center"
            options={faqCategoryKeys.map((category) => ({ key: category, label: t(`categories.${category}`) }))}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </ScrollReveal>

        {/* Scroll progress rail beside the list. */}
        <TracingBeam className="mt-10 max-w-3xl md:mt-12">
          <LayoutGroup>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeCategory}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-1"
              >
                {visibleIds.map((id) => (
                  <div key={id} className="reveal">
                    <FaqAccordionItem
                      question={t(`items.${id}.question`)}
                      answer={t(`items.${id}.answer`)}
                      isOpen={openId === id}
                      onToggle={() => setOpenId((current) => (current === id ? null : id))}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </LayoutGroup>
        </TracingBeam>
      </SectionShell>
    </>
  );
}
