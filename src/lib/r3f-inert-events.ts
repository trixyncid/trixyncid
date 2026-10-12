import { events as createPointerEvents, type RootStore } from "@react-three/fiber";

/** Decorative canvases don't need pointer routing — avoids r3f connect(null) crashes. */
export function inertCanvasEvents(store: RootStore) {
  const events = createPointerEvents(store);

  return {
    ...events,
    enabled: false,
    connect() {
      // No-op: hero/spotlight canvases are visual-only.
    },
  };
}
