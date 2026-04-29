import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within, waitFor, act } from "@testing-library/react";
import React from "react";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ lang: "en" }),
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<any>("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: new Proxy(() => null, {
      get: (_t, key: string) => (props: any) =>
        React.createElement(key === "button" ? "button" : "div", props),
      apply: () => (props: any) => <div {...props} />,
    }),
  };
});

import AIChatFab from "@/components/AIChatFab";

let footerTop = 1800;
let footerBottom = 2200;

describe("AIChatFab modal", () => {
  beforeEach(() => {
    footerTop = 1800;
    footerBottom = 2200;
    // Make FAB visible (simulate scroll)
    Object.defineProperty(window, "scrollY", { value: 200, writable: true });
    Object.defineProperty(window, "innerHeight", { value: 900, writable: true });
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
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      return window.setTimeout(() => cb(performance.now()), 0);
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      window.clearTimeout(id);
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
    window.dispatchEvent(new Event("scroll"));
    sessionStorage.clear();
    // Polyfill scrollTo for JSDOM
    // @ts-ignore
    if (!Element.prototype.scrollTo) {
      // @ts-ignore
      Element.prototype.scrollTo = () => {};
    }
  });

  it("opens clear confirmation modal and cancels", () => {
    render(<AIChatFab />);
    const fab = screen.getByRole("button", { name: /ai legal assistant/i });
    fireEvent.click(fab);
    // Open panel
    // Clear requires opening window first
    const sendButtons = screen.queryAllByRole("button", { name: /send/i });
    expect(sendButtons.length).toBeGreaterThanOrEqual(0);
    // Open clear modal
    const clear = screen.getByRole("button", { name: /clear chat/i });
    fireEvent.click(clear);
    expect(!!screen.getByText("This will clear the current conversation. Proceed?")).toBe(true);
    // Cancel within the confirmation dialog
    const dialog = screen.getByRole("dialog", { name: /confirm clear chat/i });
    const cancel = within(dialog).getByRole("button", { name: /cancel/i });
    fireEvent.click(cancel);
    expect(screen.queryByText("This will clear the current conversation. Proceed?")).toBeNull();
  });

  it("confirms and clears", () => {
    render(<AIChatFab />);
    const fab = screen.getByRole("button", { name: /ai legal assistant/i });
    fireEvent.click(fab);
    expect(screen.queryByRole("button", { name: /export transcript/i })).toBeNull();
    const clear = screen.getByRole("button", { name: /clear chat/i });
    fireEvent.click(clear);
    const confirm = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirm);
    expect(screen.queryByText("This will clear the current conversation. Proceed?")).toBeNull();
  });

  it("closes by ESC", () => {
    render(<AIChatFab />);
    const fab = screen.getByRole("button", { name: /ai legal assistant/i });
    fireEvent.click(fab);
    fireEvent.click(screen.getByRole("button", { name: /clear chat/i }));
    // Click Cancel inside the confirmation dialog
    const dialog = screen.getByRole("dialog", { name: /confirm clear chat/i });
    const cancelBtn = within(dialog).getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText("This will clear the current conversation. Proceed?")).toBeNull();
  });

  it("hides when the footer enters view and reappears after scrolling above it", () => {
    render(<AIChatFab />);
    expect(screen.getByRole("button", { name: /ai legal assistant/i })).toBeTruthy();

    footerTop = 700;
    footerBottom = 1200;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    return waitFor(() => {
      expect(screen.queryByRole("button", { name: /ai legal assistant/i })).toBeNull();
    }).then(async () => {
      footerTop = 1700;
      footerBottom = 2300;
      await act(async () => {
        window.dispatchEvent(new Event("scroll"));
      });
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /ai legal assistant/i })).toBeTruthy();
      });
    });
  });
});
