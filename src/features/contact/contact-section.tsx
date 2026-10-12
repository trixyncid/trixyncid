"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { track } from "@vercel/analytics";
import {
  contactBudgetRangeKeys,
  contactChannelKeys,
  contactProjectTypeKeys,
  type ContactBudgetRangeKey,
  type ContactProjectTypeKey,
} from "@/content/contact";
import { siteConfig } from "@/content/site";
import { buildContactWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormField, FormInput, FormSelect, FormTextarea } from "@/components/shared/form-controls";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/scroll-reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { cn } from "@/lib/utils";

const channelIcons = {
  email: Mail,
  whatsapp: MessageCircle,
  location: MapPin,
} as const;

const channelLinks: Record<(typeof contactChannelKeys)[number], string | undefined> = {
  email: `mailto:${siteConfig.email}`,
  whatsapp: buildWhatsAppUrl(siteConfig.whatsapp),
  location: undefined,
};

function channelValue(
  channel: (typeof contactChannelKeys)[number],
  t: ReturnType<typeof useTranslations<"contact">>,
) {
  switch (channel) {
    case "email":
      return siteConfig.email;
    case "whatsapp":
      return t("whatsappCta");
    case "location":
      return `${siteConfig.address.city}, ${siteConfig.address.region}`;
  }
}

const nextStepKeys = ["review", "respond", "discover"] as const;

export function ContactSection() {
  const t = useTranslations("contact");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const projectTypeKey = String(data.get("projectType") ?? "systems") as ContactProjectTypeKey;
    const budgetKey = String(data.get("budgetRange") ?? "not-sure") as ContactBudgetRangeKey;
    const message = String(data.get("message") ?? "").trim();

    const whatsappMessage = buildContactWhatsAppMessage({
      intro: t("form.whatsappMessage.intro"),
      fields: [
        { label: t("form.name"), value: name },
        { label: t("form.email"), value: email },
        { label: t("form.company"), value: company },
        { label: t("form.projectType"), value: t(`form.projectTypes.${projectTypeKey}`) },
        { label: t("form.budgetRange"), value: t(`form.budgetRanges.${budgetKey}`) },
        { label: t("form.message"), value: message },
      ],
    });

    const url = buildWhatsAppUrl(siteConfig.whatsapp, whatsappMessage);
    track("contact_form_submit", { projectType: projectTypeKey, budget: budgetKey });
    // Passing "noopener" makes window.open always return null, so open without it
    // to detect blocked popups (common in in-app browsers), then detach the opener.
    const popup = window.open(url, "_blank");
    if (popup) {
      popup.opener = null;
    } else {
      window.location.href = url;
    }
    // Keep the form filled so nothing is lost if WhatsApp didn't open.
    setWhatsappUrl(url);
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

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-16">
          <ScrollStagger className="space-y-6">
            <ScrollStaggerItem>
              <div className="rounded-3xl border border-border/60 bg-popover p-6 md:p-7">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t("channels.eyebrow")}
                </p>
                <h2 className="mt-2 font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {t("channels.title")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t("channels.description")}
                </p>

                <div className="mt-6 grid gap-3">
                  {contactChannelKeys.map((channel) => {
                    const Icon = channelIcons[channel];
                    const href = channelLinks[channel];
                    const value = channelValue(channel, t);

                    return (
                      <div
                        key={channel}
                        className="group rounded-2xl border border-border/50 bg-popover p-4 transition-colors hover:border-brand/20"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand/10">
                            <Icon className="h-4 w-4 text-brand-text" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                              {t(`info.${channel}`)}
                            </p>
                            {href ? (
                              <a
                                href={href}
                                onClick={() => track("contact_click", { channel, location: "contact_page" })}
                                target={channel === "whatsapp" ? "_blank" : undefined}
                                rel={channel === "whatsapp" ? "noopener noreferrer" : undefined}
                                className="mt-1 block text-sm leading-snug font-medium break-words text-foreground transition-colors hover:text-brand-text"
                              >
                                {value}
                              </a>
                            ) : (
                              <p className="mt-1 text-sm leading-snug font-medium break-words text-foreground">
                                {value}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-popover p-5 dark:border-brand/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                  <Clock className="h-4 w-4 text-brand-text" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-heading text-base font-semibold text-foreground">{t("response.title")}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("response.description")}</p>
                </div>
              </div>
            </ScrollStaggerItem>
          </ScrollStagger>

          <ScrollReveal delay={0.08}>
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-popover p-6 md:p-8">
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t("form.eyebrow")}
                </p>
                <h2 className="mt-2 font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {t("form.title")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("form.description")}</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField id="name" label={t("form.name")}>
                      <FormInput id="name" name="name" required autoComplete="name" />
                    </FormField>
                    <FormField id="email" label={t("form.email")}>
                      <FormInput id="email" name="email" type="email" autoComplete="email" />
                    </FormField>
                  </div>

                  <FormField id="company" label={t("form.company")}>
                    <FormInput id="company" name="company" autoComplete="organization" />
                  </FormField>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField id="projectType" label={t("form.projectType")}>
                      <FormSelect id="projectType" name="projectType" defaultValue="systems">
                        {contactProjectTypeKeys.map((key) => (
                          <option key={key} value={key}>
                            {t(`form.projectTypes.${key}`)}
                          </option>
                        ))}
                      </FormSelect>
                    </FormField>

                    <FormField
                      id="budgetRange"
                      label={t("form.budgetRange")}
                      hint={t("form.budgetHint")}
                    >
                      <FormSelect
                        id="budgetRange"
                        name="budgetRange"
                        defaultValue="not-sure"
                        aria-describedby="budgetRange-hint"
                      >
                        {contactBudgetRangeKeys.map((key) => (
                          <option key={key} value={key}>
                            {t(`form.budgetRanges.${key}`)}
                          </option>
                        ))}
                      </FormSelect>
                    </FormField>
                  </div>

                  <FormField id="message" label={t("form.message")}>
                    <FormTextarea id="message" name="message" required rows={5} maxLength={1500} />
                  </FormField>

                  <button
                    type="submit"
                    className={cn(
                      "inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-light",
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t("form.submit")}
                  </button>

                  {/* Always mounted so screen readers announce the message when it appears. */}
                  <div role="status" aria-live="polite" aria-atomic="true">
                    <AnimatePresence mode="wait">
                      {whatsappUrl ? (
                        <motion.p
                          key="success"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="rounded-xl border border-green-600/25 bg-green-500/10 px-4 py-3 text-center text-sm text-green-800 dark:text-green-400"
                        >
                          {t("form.success")}{" "}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline underline-offset-2"
                          >
                            {t("form.successRetry")}
                          </a>
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </SectionShell>

      <div className="section-divider mx-auto max-w-4xl opacity-50" aria-hidden />

      <SectionShell containerSize="narrow" className="pt-10 md:pt-12">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("nextSteps.eyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {t("nextSteps.title")}
            </h2>
          </div>

          <ol className="mt-8 grid list-none gap-4 p-0 md:grid-cols-3">
            {nextStepKeys.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-border/60 bg-popover px-5 py-5 text-center"
              >
                <span className="font-heading text-sm font-semibold tabular-nums text-brand-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-heading text-base font-semibold text-foreground">
                  {t(`nextSteps.items.${step}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`nextSteps.items.${step}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </SectionShell>
    </>
  );
}
