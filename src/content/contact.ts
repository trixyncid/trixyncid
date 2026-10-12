export const contactProjectTypeKeys = [
  "systems",
  "mobile",
  "website",
  "ai-iot",
  "support",
  "other",
] as const;

export type ContactProjectTypeKey = (typeof contactProjectTypeKeys)[number];

export const contactBudgetRangeKeys = [
  "under-10m",
  "10-25m",
  "25-50m",
  "50-100m",
  "above-100m",
  "not-sure",
] as const;

export type ContactBudgetRangeKey = (typeof contactBudgetRangeKeys)[number];

export const contactChannelKeys = ["email", "whatsapp", "location"] as const;

export type ContactChannelKey = (typeof contactChannelKeys)[number];
