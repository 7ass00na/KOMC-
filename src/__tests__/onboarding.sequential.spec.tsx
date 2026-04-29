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

    await act(async () => {
      vi.advanceTimersByTime(2050); // initial wait to video
    });
    const skip = screen.getByRole("button", { name: /Skip Intro/i });
    fireEvent.click(skip);

    await act(async () => {
      vi.advanceTimersByTime(2050); // secondary wait to welcome
    });
    const moveBtn = screen.getByRole("button", { name: /Go to Home Page/i });
    expect(moveBtn).toBeTruthy();

    fireEvent.click(moveBtn);
    await act(async () => {
      vi.advanceTimersByTime(2050); // final wait to home
    });
    const moveBtnGone = screen.queryByRole("button", { name: /Go to Home Page/i });
    expect(moveBtnGone).toBeNull();
  }, 15000);
});
