"use client";

import { useTranslations } from "next-intl";
import { storyBeatKeys } from "@/content/about";
import { AboutStoryBeat } from "@/features/about/about-story-beat";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionShell } from "@/components/shared/SectionShell";

export function StorySection() {
  const t = useTranslations("about");

  return (
    <SectionShell containerSize="wide" className="pb-10 md:pb-14">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        className="mx-auto max-w-3xl"
      />

      <div className="relative mt-4 md:mt-6">
        <div className="mx-auto max-w-3xl px-1 md:px-0">
          <div className="space-y-4 md:space-y-5">
            {storyBeatKeys.map((key, index) => (
              <div key={key} className="reveal">
                <AboutStoryBeat
                  index={index}
                  title={t(`story.beats.${key}.title`)}
                  text={t(`story.beats.${key}.text`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
