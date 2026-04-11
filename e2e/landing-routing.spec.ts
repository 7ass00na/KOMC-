import { test, expect } from "@playwright/test";

test.describe("Landing routing", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("keeps root URL during intro then routes to /ar/home or /en/home", async ({ page, baseURL }: any) => {
    await page.goto((baseURL || "http://localhost:3000") + "/en/home");
    await page.waitForTimeout(250);
    expect(new URL(page.url()).pathname).toBe("/");

    const arToggle = page.getByRole("button", { name: /Switch to Arabic/i });
    if (await arToggle.count()) {
      await arToggle.click();
    }
    await page.getByRole("button", { name: /الذهاب الي الصفحة الرئيسية/i }).click();
    await page.waitForTimeout(100);
    expect(new URL(page.url()).pathname).toBe("/ar/home");

    await page.goBack();
    await page.waitForTimeout(100);
    expect(new URL(page.url()).pathname).toBe("/");
  });
});
