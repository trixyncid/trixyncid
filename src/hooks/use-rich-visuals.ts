"use client";

import { useSyncExternalStore } from "react";

const DOWNGRADE_KEY = "trixync:lite-visuals";
const listeners = new Set<() => void>();
let cached: boolean | null = null;

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** True when WebGL is backed by a CPU rasterizer (no usable GPU). */
function hasSoftwareWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return true;
  }
}

function detect(): boolean {
  try {
    if (sessionStorage.getItem(DOWNGRADE_KEY) === "1") return false;
  } catch {
    /* storage blocked — fall through to the hardware checks */
  }

  const nav = navigator as NavigatorHints;
  // Phones and tablets: decorative WebGL costs battery and scroll smoothness.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
  if ((nav.deviceMemory ?? 8) <= 4) return false;
  return !hasSoftwareWebGL();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (cached === null) cached = detect();
  return cached;
}

/**
 * Whether this device should get the WebGL scenes. False on the server, on
 * phones/tablets, low-memory or low-core machines, Data Saver, reduced motion,
 * software-rendered WebGL, or after a scene reported it was running slowly.
 */
export function useRichVisuals() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Called by a scene that can't hold its frame rate: switch to the lite visuals for the session. */
export function downgradeVisuals() {
  try {
    sessionStorage.setItem(DOWNGRADE_KEY, "1");
  } catch {
    /* ignore */
  }
  cached = false;
  listeners.forEach((listener) => listener());
}
