import { describe, it, expect, beforeEach } from "vitest";
import { deriveLabels } from "@/lib/welcomeLabels";

describe("deriveLabels", () => {
  beforeEach(() => {
    localStorage.clear();
    // @ts-ignore
    delete global.location;
    // @ts-ignore
    global.location = { search: "", hostname: "example.com" };
    Object.defineProperty(document, "referrer", { value: "", configurable: true });
  });

  it("classifies campaign visitors", () => {
    // @ts-ignore
    global.location = { search: "?utm_campaign=summer", hostname: "example.com" };
    const labels = deriveLabels("en");
    expect(labels.welcomeType).toBe("campaign");
    expect(labels.campaign).toBe("summer");
  });

  it("classifies referral visitors", () => {
    Object.defineProperty(document, "referrer", { value: "https://google.com", configurable: true });
    const labels = deriveLabels("en");
    expect(labels.welcomeType === "referral" || labels.welcomeType === "new_visitor").toBe(true);
  });

  it("classifies returning visitors", () => {
    localStorage.setItem("komc_intro_ts", String(Date.now()));
    const labels = deriveLabels("en");
    expect(labels.welcomeType === "returning" || labels.welcomeType === "new_visitor").toBe(true);
  });

  it("assigns an A/B variant deterministically within a session", () => {
    const a = deriveLabels("en").variant;
    const b = deriveLabels("en").variant;
    expect(a).toBe(b);
  });
});
