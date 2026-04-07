import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import IntroOverlay from "@/components/IntroOverlay";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/en",
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider initialLang="en">
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  );
}

describe("Onboarding sequential loading flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Ensure a clean state for localStorage flags
    try {
      localStorage.removeItem("komc_intro_ts");
    } catch {}
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("runs through video skip -> global cursor -> welcome -> go to home -> global cursor sequence", async () => {
    render(
      <Wrapper>
        <GlobalLoadingOverlay />
        <IntroOverlay />
      </Wrapper>
    );

    const skip = screen.getByRole("button", { name: /Skip Intro/i });
    fireEvent.click(skip);

    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    const globalLine1 = document.querySelector("[data-global-cursor-line]");
    expect(globalLine1).toBeTruthy();

    await act(async () => {
      vi.advanceTimersByTime(1300);
    });
    const moveBtn = screen.getByRole("button", { name: /Move to Homepage/i });
    expect(moveBtn).toBeTruthy();

    fireEvent.click(moveBtn);
    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    const globalLine2 = document.querySelector("[data-global-cursor-line]");
    expect(globalLine2).toBeTruthy();

    await act(async () => {
      vi.advanceTimersByTime(1300);
    });
    const moveBtnGone = screen.queryByRole("button", { name: /Move to Homepage/i });
    expect(moveBtnGone).toBeNull();
  }, 15000);
});
