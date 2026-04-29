import { describe, it, expect } from "vitest";

function subjectFor(lang: "en" | "ar", ts: string) {
  return lang === "ar"
    ? `طلب استشارة جديد من موقع KOMC - ${ts}`
    : `New consultation request from the KOMC website - ${ts}`;
}

describe("contact email subject", () => {
  it("builds EN subject", () => {
    const ts = "2026-04-10T18:55:00.000Z";
    expect(subjectFor("en", ts)).toBe(
      "New consultation request from the KOMC website - 2026-04-10T18:55:00.000Z"
    );
  });
  it("builds AR subject", () => {
    const ts = "2026-04-10T18:55:00.000Z";
    expect(subjectFor("ar", ts)).toBe(
      "طلب استشارة جديد من موقع KOMC - 2026-04-10T18:55:00.000Z"
    );
  });
});
