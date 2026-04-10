import { describe, it, expect } from "vitest";

function subjectFor(lang: "en" | "ar", ts: string) {
  return lang === "ar"
    ? `عميل من موقع خالد عمر (KOMC) يطلب استشارة وتمثيل قانوني - ${ts}`
    : `Customer from Khaled Omar (KOMC) website seeking Consultation & Legal Representation - ${ts}`;
}

describe("contact email subject", () => {
  it("builds EN subject", () => {
    const ts = "2026-04-10T18:55:00.000Z";
    expect(subjectFor("en", ts)).toBe(
      "Customer from Khaled Omar (KOMC) website seeking Consultation & Legal Representation - 2026-04-10T18:55:00.000Z"
    );
  });
  it("builds AR subject", () => {
    const ts = "2026-04-10T18:55:00.000Z";
    expect(subjectFor("ar", ts)).toBe(
      "عميل من موقع خالد عمر (KOMC) يطلب استشارة وتمثيل قانوني - 2026-04-10T18:55:00.000Z"
    );
  });
});
