export type ServiceCategory = "software" | "intelligent" | "support";

export type ServiceItem = {
  id: string;
  category: ServiceCategory;
};

export const services: ServiceItem[] = [
  { id: "business-systems", category: "software" },
  { id: "mobile-apps", category: "software" },
  { id: "websites", category: "software" },
  { id: "ai-automation", category: "intelligent" },
  { id: "iot-integration", category: "intelligent" },
  { id: "system-support", category: "support" },
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
