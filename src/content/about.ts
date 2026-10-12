import { Handshake, Server, Users } from "lucide-react";

export const storyBeatKeys = ["insight", "problem", "build"] as const;

export type StoryBeatKey = (typeof storyBeatKeys)[number];

export const valueKeys = ["production", "collaboration", "partnership"] as const;

export type ValueKey = (typeof valueKeys)[number];

export const valueVisualMeta: Record<
  ValueKey,
  { accent: string; glow: string; icon: typeof Server }
> = {
  production: {
    accent: "text-sky-600 dark:text-sky-300",
    glow: "rgba(56, 189, 248, 0.14)",
    icon: Server,
  },
  collaboration: {
    accent: "text-brand-text",
    glow: "rgba(56, 102, 242, 0.16)",
    icon: Users,
  },
  partnership: {
    accent: "text-violet-600 dark:text-violet-300",
    glow: "rgba(139, 92, 246, 0.14)",
    icon: Handshake,
  },
};
