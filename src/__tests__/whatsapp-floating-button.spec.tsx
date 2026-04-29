import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { LanguageProvider } from "@/context/LanguageContext";

let mockPathname = "/en/home";
let footerTop = 1800;
let footerBottom = 2200;

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
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
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: new Proxy(() => null, {
      get: (_target, key: string) => (props: any) =>
        React.createElement(key === "a" ? "a" : "div", props),
      apply: () => (props: any) => <div {...props} />,
    }),
  };
});

function renderFab(lang: "en" | "ar") {
  mockPathname = `/${lang}/home`;
  return render(
    <LanguageProvider initialLang={lang}>
      <WhatsAppFloatingButton />
    </LanguageProvider>
  );
}

describe("WhatsAppFloatingButton", () => {
  beforeEach(() => {
    mockPathname = "/en/home";
    footerTop = 1800;
    footerBottom = 2200;
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 200,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      writable: true,
      value: 900,
    });
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      return window.setTimeout(() => cb(performance.now()), 0);
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      window.clearTimeout(id);
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("1024px"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    document.body.innerHTML = "";
    const footer = document.createElement("footer");
    footer.setAttribute("data-site-footer", "");
    footer.getBoundingClientRect = vi.fn(() => ({
      top: footerTop,
      bottom: footerBottom,
      left: 0,
      right: 0,
      width: 0,
      height: Math.max(footerBottom - footerTop, 0),
      x: 0,
      y: footerTop,
      toJSON: () => ({}),
    })) as any;
    document.body.appendChild(footer);
  });

  it("renders the English WhatsApp link with the updated phone number", async () => {
    renderFab("en");

    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    const link = screen.getByRole("link", { name: /chat on whatsapp/i });
    const href = link.getAttribute("href") || "";
    expect(href).not.toBe("");
    expect(href.startsWith("https://wa.me/971543456591?text=")).toBe(true);
    expect(decodeURIComponent(href.split("?text=")[1] || "")).toContain("Hello, KOMC Team");
  });

  it("renders the Arabic WhatsApp link with localized content", async () => {
    renderFab("ar");

    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    const link = screen.getByRole("link", { name: /الدردشة عبر واتساب/i });
    const href = link.getAttribute("href") || "";
    expect(href).not.toBe("");
    expect(href.startsWith("https://wa.me/971543456591?text=")).toBe(true);
    expect(decodeURIComponent(href.split("?text=")[1] || "")).toContain("مرحبًا فريق خالد عمر");
  });

  it("hides when the footer enters the responsive viewport and reappears above it", async () => {
    renderFab("en");

    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("link", { name: /chat on whatsapp/i })).toBeTruthy();

    footerTop = 700;
    footerBottom = 1200;
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: /chat on whatsapp/i })).toBeNull();
    });

    footerTop = 1600;
    footerBottom = 2200;
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /chat on whatsapp/i })).toBeTruthy();
    });
  });
});
