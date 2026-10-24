"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { getProject } from "@/content/projects";
import { showcaseTabs } from "@/content/showcase";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { AiVisual } from "./ai-visual";

/** "UD Sejahtera Bersama · Distribution" → "UD Sejahtera Bersama" */
function clientName(client: string) {
  return client.split(" · ")[0] ?? client;
}

/**
 * What we build, told by scrolling (after GitHub's homepage and Aceternity's
 * Sticky Scroll Reveal). Desktop: the services scroll past on the left beside a
 * progress rail, while one pinned frame on the right cross-fades to the project
 * proving whichever service is crossing the middle of the screen. Phones: each
 * service is followed by its own picture.
 */
export function ShowcaseSection() {
  const t = useTranslations("home.showcase");
  const tServices = useTranslations("services.items");
  const tProjects = useTranslations("projects.items");
  const tPage = useTranslations("projects");
  const locale = useLocale() as Locale;
  const prefix = `/${locale}`;
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The step crossing the horizontal middle of the viewport is the active one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    stepRefs.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  function visualFor(index: number, { inFrame }: { inFrame: boolean }) {
    const tab = showcaseTabs[index]!;
    const project = tab.projectId ? getProject(tab.projectId) : undefined;
    if (project) {
      return (
        <Image
          src={project.image}
          alt={tProjects(`${project.id}.title`)}
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-top"
        />
      );
    }
    // The robot only renders while its step is the one on show.
    return <AiVisual paused={inFrame && active !== index} />;
  }

  return (
    <SectionShell id="showcase" className="scroll-mt-24">
      <ScrollReveal className="max-w-2xl">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-[2.5rem] md:leading-tight">
          {t("title")}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{t("subtitle")}</p>
      </ScrollReveal>

      <div className="mt-12 grid gap-16 lg:mt-4 lg:grid-cols-[5fr_7fr] lg:gap-14">
        {/* Steps, with a rail that fills as the section scrolls (`.scroll-rail*` in globals.css). */}
        <div className="scroll-rail relative lg:pl-10">
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-0.5 [container-type:size] lg:block">
            <div className="absolute inset-0 bg-border [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]" />
            <div className="scroll-rail-fill absolute inset-0 origin-top rounded-full bg-brand-light" />
            <div className="scroll-rail-tip absolute -left-[5px] -top-1.5 h-3 w-3 rounded-full bg-brand-light" />
          </div>

          {showcaseTabs.map((tab, index) => {
            const project = tab.projectId ? getProject(tab.projectId) : undefined;
            const isActive = index === active;
            return (
              <div
                key={tab.id}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                className={cn(
                  "relative transition-opacity duration-500 lg:flex lg:min-h-[75vh] lg:flex-col lg:justify-center",
                  index > 0 && "max-lg:mt-16",
                  !isActive && "lg:opacity-35",
                )}
              >
                <ScrollReveal>
                  {/* Phones and tablets: each service opens with its own picture. */}
                  <div className="relative mb-6 aspect-[10/7] overflow-clip rounded-3xl bg-card lg:hidden">
                    {visualFor(index, { inFrame: false })}
                  </div>
                  <h3 className="relative font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {/* The step's marker on the rail, level with its title. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -left-[45px] top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full ring-4 ring-background transition-colors duration-500 lg:block",
                        isActive ? "bg-brand-light" : "bg-muted-foreground/40",
                      )}
                    />
                    {tServices(`${tab.id}.title`)}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-foreground/80 md:text-lg">
                    {tServices(`${tab.id}.build`)}
                  </p>

                  <div className="mt-6 rounded-2xl bg-card p-5 md:p-6">
                    <p className="text-sm font-medium text-brand-text">
                      {project
                        ? t("resultFor", { client: clientName(tProjects(`${project.id}.client`)) })
                        : t("whatChanges")}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-foreground">
                      {project ? tProjects(`${project.id}.outcome`) : tServices(`${tab.id}.outcome`)}
                    </p>
                  </div>

                  <Link
                    href={project ? `${prefix}/projects/${project.id}` : `${prefix}/services`}
                    className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand-text"
                  >
                    {project ? tPage("viewCaseStudy") : t("allServices")}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </Link>
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        {/* Desktop: one frame, pinned in the middle of the screen, cross-fading between projects. */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative aspect-[10/7] w-full overflow-clip rounded-3xl bg-card">
              {showcaseTabs.map((tab, index) => (
                <div
                  key={tab.id}
                  aria-hidden={index !== active}
                  className={cn(
                    "absolute inset-0 transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    index === active ? "scale-100 opacity-100" : "pointer-events-none scale-[1.03] opacity-0",
                  )}
                >
                  {visualFor(index, { inFrame: true })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
