import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Header from "@/components/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { resetBodyScrollLock } from "@/lib/bodyScrollLock";

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

describe("Header mobile menu scroll lock", () => {
  beforeEach(() => {
    resetBodyScrollLock();
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.touchAction = "";
    document.body.removeAttribute("data-scroll-locked");

    Object.defineProperty(window, "matchMedia", {
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

    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({}),
    }) as any;

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

  it("restores scrolling immediately after the menu closes", () => {
    renderHeader();

    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.getAttribute("data-scroll-locked")).toBe("true");

    fireEvent.click(menuButton);
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.body.style.touchAction).toBe("");
    expect(document.body.hasAttribute("data-scroll-locked")).toBe(false);
  });

  it("keeps scroll lock bookkeeping stable across repeated open and close cycles", () => {
    renderHeader();

    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);
    fireEvent.click(menuButton);
    fireEvent.click(menuButton);
    fireEvent.click(menuButton);

    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.body.style.touchAction).toBe("");
    expect(document.body.hasAttribute("data-scroll-locked")).toBe(false);
  });
});
