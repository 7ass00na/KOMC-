import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WelcomingMessage from "@/components/WelcomingMessage";
import type { WelcomeLabels } from "@/lib/welcomeLabels";

const base: WelcomeLabels = {
  welcomeType: "new_visitor",
  userRole: "consumer",
  actionRequired: "cta_home",
  variant: "A",
  lang: "en",
};

describe("WelcomingMessage i18n and dir", () => {
  it("renders EN content LTR", () => {
    render(<WelcomingMessage lang="en" labels={{ ...base, lang: "en" }} onPrimary={() => {}} />);
    const btn = screen.getByRole("button", { name: /Go to Home Page/i });
    expect(!!btn).toBe(true);
    const logo = screen.getByAltText(/Logo|Main Logo/i);
    expect(!!logo).toBe(true);
  });

  it("renders AR content RTL", () => {
    render(<WelcomingMessage lang="ar" labels={{ ...base, lang: "ar" }} onPrimary={() => {}} />);
    const btn = screen.getByRole("button", { name: /الذهاب الي الصفحة الرئيسية/i });
    expect(!!btn).toBe(true);
    const dirNode = document.querySelector('[dir="rtl"]') as HTMLElement | null;
    expect(!!dirNode).toBe(true);
  });
});
