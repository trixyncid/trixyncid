export type ServiceCategory = "software" | "intelligent" | "support";

export type ServiceItem = {
  id: string;
  category: ServiceCategory;
  icon: "workflow" | "smartphone" | "globe" | "sparkles" | "cpu" | "lifebuoy";
};

export const services: ServiceItem[] = [
  { id: "business-systems", category: "software", icon: "workflow" },
  { id: "mobile-apps", category: "software", icon: "smartphone" },
  { id: "websites", category: "software", icon: "globe" },
  { id: "ai-automation", category: "intelligent", icon: "sparkles" },
  { id: "iot-integration", category: "intelligent", icon: "cpu" },
  { id: "system-support", category: "support", icon: "lifebuoy" },
];

export const serviceCategoryKeys: Record<ServiceCategory, string> = {
  software: "categorySoftware",
  intelligent: "categoryIntelligent",
  support: "categorySupport",
};

export const serviceFilterKeys = ["all", "software", "intelligent", "support"] as const;

export type ServiceFilterKey = (typeof serviceFilterKeys)[number];

export const processStepKeys = ["discover", "design", "deliver", "support"] as const;

export type ProcessStepKey = (typeof processStepKeys)[number];

export function servicesForFilter(filter: ServiceFilterKey): ServiceItem[] {
  if (filter === "all") return [...services];
  return services.filter((service) => service.category === filter);
}

export const serviceVisualMeta: Record<
  ServiceItem["id"],
  { accent: string; glow: string; iconBg: string }
> = {
  "business-systems": {
    accent: "text-brand dark:text-brand-light",
    glow: "rgba(56, 102, 242, 0.12)",
    iconBg: "bg-brand/10 dark:bg-brand/15",
  },
  "mobile-apps": {
    accent: "text-sky-600 dark:text-sky-400",
    glow: "rgba(56, 189, 248, 0.12)",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/15",
  },
  websites: {
    accent: "text-indigo-600 dark:text-indigo-400",
    glow: "rgba(99, 102, 241, 0.12)",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/15",
  },
  "ai-automation": {
    accent: "text-violet-600 dark:text-violet-400",
    glow: "rgba(139, 92, 246, 0.12)",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/15",
  },
  "iot-integration": {
    accent: "text-emerald-600 dark:text-emerald-400",
    glow: "rgba(52, 211, 153, 0.12)",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
  },
  "system-support": {
    accent: "text-amber-600 dark:text-amber-400",
    glow: "rgba(245, 158, 11, 0.12)",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
  },
};
