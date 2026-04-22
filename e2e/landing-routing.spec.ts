import { test, expect } from "@playwright/test";

test.describe("Landing routing", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("routes to locale home and respects intro language switching", async ({ page, baseURL }: any) => {
    await page.addInitScript(() => {
      localStorage.removeItem("komc_intro_ts");
      localStorage.setItem("site_lang", "en");
      document.cookie = "komc_intro_ts=; Max-Age=0; path=/; samesite=lax";
      document.cookie = "site_lang=en; path=/; samesite=lax";
    });

    await page.goto((baseURL || "http://localhost:3000") + "/");
    await expect(page).toHaveURL(/\/en\/home$/);

    await page.getByRole("button", { name: /Skip intro/i }).click();
    await expect(page.locator("[data-intro-overlay]")).toBeVisible();

    const arToggle = page.getByRole("button", { name: /Switch to Arabic/i });
    await arToggle.click();
    await page.getByRole("button", { name: /الذهاب الي الصفحة الرئيسية/i }).click();
    await expect(page).toHaveURL(/\/ar\/home$/);
  });
});
