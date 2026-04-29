import { test, expect } from "@playwright/test";

async function openIntroOverlay(page: any, baseURL: string | undefined) {
  await page.addInitScript(() => {
    localStorage.removeItem("komc_intro_ts");
    document.cookie = "komc_intro_ts=; Max-Age=0; path=/; samesite=lax";
  });
  await page.goto((baseURL || "http://localhost:3000") + "/en/home", {
    waitUntil: "domcontentloaded",
  });
  const dialog = page.getByRole("dialog", { name: /Site introduction/i });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("data-intro-ready", "true");
}

async function assertIntroOverlayBasics(page: any) {
  const dialog = page.getByRole("dialog", { name: /Site introduction/i });
  await expect(dialog.locator("img").first()).toBeVisible();
  const unmuteButton = dialog.getByRole("button", { name: /Unmute/i });
  await expect(unmuteButton).toBeVisible();
  await expect(dialog.getByRole("button", { name: /Skip intro/i })).toBeVisible();

  await unmuteButton.dispatchEvent("click");
  await expect(dialog.getByRole("button", { name: /^Mute$/i })).toBeVisible();
}

test.describe("Intro Overlay — mobile 375x812", () => {
  test.use({ viewport: { width: 375, height: 812 } });
  test("renders intro controls and mute toggle", async ({ page, baseURL }: any) => {
    await openIntroOverlay(page, baseURL);
    await assertIntroOverlayBasics(page);
  });
});

test.describe("Intro Overlay — tablet 768x1024", () => {
  test.use({ viewport: { width: 768, height: 1024 } });
  test("renders intro controls and mute toggle", async ({ page, baseURL }: any) => {
    await openIntroOverlay(page, baseURL);
    await assertIntroOverlayBasics(page);
  });
});
