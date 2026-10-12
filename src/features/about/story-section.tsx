"use client";

import { useTranslations } from "next-intl";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { storyBeatKeys } from "@/content/about";
import { AboutStoryBeat } from "@/features/about/about-story-beat";
import { PageHeader } from "@/components/shared/PageHeader";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";

export function StorySection() {
  const t = useTranslations("about");

  return (
    <SectionShell containerSize="wide" className="pb-10 md:pb-14">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        className="mx-auto max-w-3xl"
      />

      <ScrollReveal delay={0.08} className="relative mt-4 md:mt-6">
        <TracingBeam className="max-w-3xl px-1 md:px-0">
          <div className="space-y-4 md:space-y-5">
            {storyBeatKeys.map((key, index) => (
              <AboutStoryBeat
                key={key}
                index={index}
                title={t(`story.beats.${key}.title`)}
                text={t(`story.beats.${key}.text`)}
              />
            ))}
          </div>
        </TracingBeam>
      </ScrollReveal>
    </SectionShell>
  );
}
