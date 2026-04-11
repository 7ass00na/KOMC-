import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WelcomingMessage from "@/components/WelcomingMessage";

vi.mock("@/lib/welcomeLabels", async () => {
  const actual: any = await vi.importActual("@/lib/welcomeLabels");
  return { ...actual, track: vi.fn() };
});

describe("welcome routing + loading", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches EN welcome loading when clicking Explore Our Services", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const user = userEvent.setup();
    render(
      <WelcomingMessage
        lang="en"
        labels={{ variant: "A", welcomeType: "new_visitor", locale: "en" } as any}
        labelsReady={true}
        onPrimary={() => {}}
        onChangeLang={() => {}}
      />
    );
    await user.click(screen.getByRole("link", { name: /Explore Our Services/i }));
    expect(dispatchSpy).toHaveBeenCalled();
    const evt = dispatchSpy.mock.calls.find((c) => (c[0] as any)?.type === "site-loading")?.[0] as any;
    expect(evt?.detail?.welcome).toBe(true);
    expect(evt?.detail?.lang).toBe("en");
  });

  it("renders Arabic visitor label translation for new_visitor", () => {
    render(
      <WelcomingMessage
        lang="ar"
        labels={{ variant: "A", welcomeType: "new_visitor", locale: "ar" } as any}
        labelsReady={true}
        onPrimary={() => {}}
        onChangeLang={() => {}}
      />
    );
    expect(screen.getByText(/مرحبًا بكم/)).toBeTruthy();
    expect(screen.getByText(/بالزائر الجديد/)).toBeTruthy();
  });
});
