import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Header from "@/components/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { resetBodyScrollLock } from "@/lib/bodyScrollLock";

const originalFetch = global.fetch;

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
        React.createElement(
          key === "button" ? "button" : key === "a" ? "a" : "div",
          props
        ),
      apply: () => (props: any) => <div {...props} />,
    }),
  };
});

function renderHeader() {
  return render(
    <LanguageProvider initialLang="en">
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </LanguageProvider>
  );
}

function createMockResponse(payload: unknown = {}) {
  return {
    ok: true,
    status: 200,
    headers: { get: () => "application/json" },
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  };
}

function getRenderedSocialLinks() {
  return screen.getAllByRole("link").filter((link) =>
    ["facebook", "instagram", "tiktok", "email"].includes(
      link.getAttribute("data-social") || ""
    )
  );
}

describe("Header social links", () => {
  beforeEach(() => {
    resetBodyScrollLock();
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.touchAction = "";
    document.body.removeAttribute("data-scroll-locked");

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        media: "(max-width: 1024px)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    global.fetch = vi.fn().mockResolvedValue(createMockResponse()) as typeof fetch;

    class ResizeObserverMock {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      writable: true,
      value: ResizeObserverMock,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    resetBodyScrollLock();
  });

  it("renders secure social links in the requested order inside the mobile menu", () => {
    renderHeader();

    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    const links = getRenderedSocialLinks();

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

  it("keeps rendering the social links when header bootstrap fetches fail", () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network unavailable")) as typeof fetch;

    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: /menu/i }));

    const links = getRenderedSocialLinks();

    expect(links).toHaveLength(4);
    expect(links.map((link) => link.getAttribute("data-social"))).toEqual([
      "facebook",
      "instagram",
      "tiktok",
      "email",
    ]);
  });
});
