"use client";

import { useSyncExternalStore } from "react";

const DOWNGRADE_KEY = "trixync:lite-visuals";
const listeners = new Set<() => void>();
let cached: boolean | null = null;

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

const GPU_PROBE_KEY = "trixync:gpu-probe";

/**
 * True when WebGL is backed by a CPU rasterizer (no usable GPU). Creating a
 * context is slow on such machines, so the answer is cached: a GPU is
 * remembered across visits, but "software" only for this session, since a
 * context can fail for passing reasons (driver reset, GPU busy, sleep/wake).
 */
function hasSoftwareWebGL() {
  try {
    if (localStorage.getItem(GPU_PROBE_KEY) === "hardware") return false;
    if (sessionStorage.getItem(GPU_PROBE_KEY) === "software") return true;
  } catch {
    /* storage blocked — probe below */
  }

  let software = true;
  try {
    const canvas = document.createElement("canvas");
    // Browsers refuse this flag for software/blocklisted GPUs — a cheap early no.
    const options = { failIfMajorPerformanceCaveat: true };
    const gl = (canvas.getContext("webgl2", options) ??
      canvas.getContext("webgl", options)) as WebGLRenderingContext | null;
    if (gl) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    software = true;
  }

  try {
    if (software) {
      sessionStorage.setItem(GPU_PROBE_KEY, "software");
      // Drop a "software" verdict older builds stored permanently.
      localStorage.removeItem(GPU_PROBE_KEY);
    } else {
      localStorage.setItem(GPU_PROBE_KEY, "hardware");
    }
  } catch {
    /* ignore */
  }
  return software;
}

/** Cheap checks that need no WebGL context. */
function passesHardwareHints(): boolean {
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
  return true;
}

let probeScheduled = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean | null {
  if (cached !== null) return cached;
  if (!passesHardwareHints()) {
    cached = false;
    return cached;
  }
  // The GPU probe creates a WebGL context, which can take ~1s on machines
  // without a GPU — so it runs when the browser is idle, never during hydration.
  if (!probeScheduled) {
    probeScheduled = true;
    const run = () => {
      cached = !hasSoftwareWebGL();
      emit();
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2500 });
    else setTimeout(run, 1200);
  }
  return null;
}

/**
 * Whether this device should get the WebGL scenes: `true` / `false`, or `null`
 * while still deciding (server render, or the GPU probe hasn't run yet) — render
 * neither version then, so capable machines don't flash the fallback first.
 * False on phones/tablets, low-memory or low-core machines, Data Saver,
 * reduced motion, software-rendered WebGL, or after a scene ran slowly.
 */
export function useRichVisuals(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Called by a scene that can't hold its frame rate: switch to the lite visuals for the session. */
export function downgradeVisuals() {
  try {
    sessionStorage.setItem(DOWNGRADE_KEY, "1");
  } catch {
    /* ignore */
  }
  cached = false;
  emit();
}
