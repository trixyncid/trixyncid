/**
 * Home showcase tabs: one per service, each proven by a real project's
 * screenshot and result. The AI tab shows the robot scene instead.
 */
export const showcaseTabs = [
  { id: "business-systems", projectId: "sejahtera-bersama-erp" },
  { id: "mobile-apps", projectId: "kms-connect" },
  { id: "websites", projectId: "pgi-tower" },
  { id: "ai-automation", projectId: null },
] as const;

export type ShowcaseTabId = (typeof showcaseTabs)[number]["id"];

export const showcaseProjectIds: string[] = showcaseTabs.flatMap((tab) => (tab.projectId ? [tab.projectId] : []));
