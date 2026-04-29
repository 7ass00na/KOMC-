import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  lockBodyScroll,
  resetBodyScrollLock,
  unlockBodyScroll,
} from "@/lib/bodyScrollLock";

describe("bodyScrollLock", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.overscrollBehavior = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.touchAction = "";
    document.body.removeAttribute("data-scroll-locked");
    resetBodyScrollLock();
  });

  afterEach(() => {
    resetBodyScrollLock();
  });

  it("locks both the body and the document element for mobile-safe overlays", () => {
    lockBodyScroll();

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.touchAction).toBe("none");
    expect(document.body.getAttribute("data-scroll-locked")).toBe("true");
  });

  it("fully restores scrolling after the last lock is released", () => {
    lockBodyScroll();
    lockBodyScroll();

    unlockBodyScroll();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");

    unlockBodyScroll();
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.body.style.touchAction).toBe("");
    expect(document.body.hasAttribute("data-scroll-locked")).toBe(false);
  });
});
