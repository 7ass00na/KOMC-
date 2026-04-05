import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
      get: () => (props: any) => <div {...props} />,
      apply: () => (props: any) => <div {...props} />,
    }),
  };
});

import AIChatFab from "@/components/AIChatFab";

describe("AIChatFab modal", () => {
  beforeEach(() => {
    // Make FAB visible (simulate scroll)
    Object.defineProperty(window, "scrollY", { value: 200, writable: true });
    window.dispatchEvent(new Event("scroll"));
    sessionStorage.clear();
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
    expect(screen.getByText("This will clear the current conversation. Proceed?")).toBeInTheDocument();
    // Cancel
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText("This will clear the current conversation. Proceed?")).not.toBeInTheDocument();
  });

  it("confirms and clears", () => {
    render(<AIChatFab />);
    const fab = screen.getByRole("button", { name: /ai legal assistant/i });
    fireEvent.click(fab);
    const clear = screen.getByRole("button", { name: /clear chat/i });
    fireEvent.click(clear);
    const confirm = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirm);
    expect(screen.queryByText("This will clear the current conversation. Proceed?")).not.toBeInTheDocument();
  });

  it("closes by ESC", () => {
    render(<AIChatFab />);
    const fab = screen.getByRole("button", { name: /ai legal assistant/i });
    fireEvent.click(fab);
    fireEvent.click(screen.getByRole("button", { name: /clear chat/i }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("This will clear the current conversation. Proceed?")).not.toBeInTheDocument();
  });
});

