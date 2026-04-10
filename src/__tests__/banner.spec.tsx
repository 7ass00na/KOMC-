import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NotificationProvider, useNotifications } from "@/context/NotificationContext";
import { vi } from "vitest";

vi.mock("@/context/LanguageContext", () => {
  return {
    useLanguage: () => ({ lang: "en", dir: "ltr", t: (k: string) => k, setLang: () => {} }),
  };
});
import SuccessBanner from "@/components/SuccessBanner";

function Harness() {
  const { showSuccess } = useNotifications();
  return (
    <div>
      <button onClick={() => showSuccess("ok")}>show</button>
      <SuccessBanner />
    </div>
  );
}

describe("SuccessBanner", () => {
  it("shows and dismisses", () => {
    render(<NotificationProvider><Harness /></NotificationProvider>);
    fireEvent.click(screen.getByText("show"));
    expect(screen.getByRole("status")).toBeTruthy();
    const btn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(btn);
    // banner should be removed
    expect(screen.queryByRole("status")).toBeNull();
  });
});
