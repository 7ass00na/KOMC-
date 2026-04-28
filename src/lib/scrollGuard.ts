import { resetBodyScrollLock } from "@/lib/bodyScrollLock";

export function ensureBodyScrollable() {
  try {
    if (typeof document === "undefined") return;
    const hasOverlay = !!document.querySelector(".intro-video, [data-intro-overlay]");
    if (!hasOverlay) {
      resetBodyScrollLock();
      if (document.body.getAttribute("data-intro-state") === "transitioning") {
        document.body.setAttribute("data-intro-state", "ready");
      }
      return true;
    }
  } catch {}
  return false;
}
