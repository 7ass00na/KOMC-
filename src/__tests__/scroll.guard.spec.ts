import { describe, it, expect, beforeEach } from "vitest";
import { ensureBodyScrollable } from "@/lib/scrollGuard";

describe("ensureBodyScrollable", () => {
  beforeEach(() => {
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-intro-state", "transitioning");
    document.body.innerHTML = "";
  });
  it("unlocks body when no overlay present", () => {
    const res = ensureBodyScrollable();
    expect(res).toBe(true);
    expect(document.body.style.overflow).toBe("");
    expect(document.body.getAttribute("data-intro-state")).toBe("ready");
  });
  it("does not unlock when overlay present", () => {
    const el = document.createElement("div");
    el.className = "intro-video";
    document.body.appendChild(el);
    const res = ensureBodyScrollable();
    expect(res).toBe(false);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.getAttribute("data-intro-state")).toBe("transitioning");
  });
});
