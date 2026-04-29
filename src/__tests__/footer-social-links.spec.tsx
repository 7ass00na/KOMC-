import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/home",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<any>("framer-motion");
  return {
    ...actual,
    motion: new Proxy(() => null, {
      get: (_target, key: string) => (props: any) =>
        React.createElement(key === "a" ? "a" : "div", props),
      apply: () => (props: any) => <div {...props} />,
    }),
  };
});

function renderFooter() {
  return render(
    <LanguageProvider initialLang="en">
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    </LanguageProvider>
  );
}

describe("Footer social links", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({}),
    }) as any;
  });

  it("renders the requested social links in order with secure targets", () => {
    renderFooter();

    const links = screen.getAllByRole("link").filter((link) =>
      ["facebook", "instagram", "tiktok", "email"].includes(
        link.getAttribute("data-social") || ""
      )
    );

    expect(links.map((link) => link.getAttribute("data-social"))).toEqual([
      "facebook",
      "instagram",
      "tiktok",
      "email",
    ]);

    expect(links[0].getAttribute("href")).toBe(
      "https://www.facebook.com/share/1GpGDQHDdL/"
    );
    expect(links[1].getAttribute("href")).toBe(
      "https://www.instagram.com/komc.23?igsh=MTNtZDF3NXdtdWdoMA=="
    );
    expect(links[2].getAttribute("href")).toBe("https://tiktok.com/@komc.23");
    expect(links[3].getAttribute("href")).toBe("mailto:info@khaledomer.ae");

    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});
