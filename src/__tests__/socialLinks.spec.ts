import { describe, expect, it } from "vitest";
import { SOCIAL_LINKS } from "@/lib/socialLinks";

describe("SOCIAL_LINKS", () => {
  it("uses the requested social order and targets", () => {
    expect(SOCIAL_LINKS.map((item) => item.kind)).toEqual([
      "facebook",
      "instagram",
      "tiktok",
      "email",
    ]);

    expect(SOCIAL_LINKS[0].href).toBe("https://www.facebook.com/share/1GpGDQHDdL/");
    expect(SOCIAL_LINKS[1].href).toBe(
      "https://www.instagram.com/komc.23?igsh=MTNtZDF3NXdtdWdoMA=="
    );
    expect(SOCIAL_LINKS[2].href).toBe("https://tiktok.com/@komc.23");
    expect(SOCIAL_LINKS[3].href).toBe("mailto:info@khaledomer.ae");
  });
});
