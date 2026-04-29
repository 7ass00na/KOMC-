import { expect, test } from "@playwright/test";

async function prepareHome(page: any, baseURL: string | undefined, path: string) {
  await page.addInitScript(() => {
    localStorage.setItem("komc_intro_ts", String(Date.now()));
    document.cookie = `komc_intro_ts=${Date.now()}; path=/; samesite=lax`;
  });

  await page.goto((baseURL || "http://localhost:3000") + path, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("header[data-header-ready='true']")).toBeVisible();
}

async function assertMenuCloseRestoresScroll(page: any) {
  const menuButton = page.getByRole("button", { name: /menu/i });
  await expect(menuButton).toBeVisible();

  const beforeY = await page.evaluate(() => window.scrollY);
  await menuButton.click();
  await expect(page.getByRole("dialog", { name: /mobile menu/i })).toBeVisible();

  await menuButton.click();
  await expect(page.getByRole("dialog", { name: /mobile menu/i })).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect
    .poll(async () => page.evaluate(() => window.scrollY), { timeout: 4000 })
    .toBeGreaterThan(beforeY);

  const lockState = await page.evaluate(() => ({
    bodyOverflow: document.body.style.overflow,
    htmlOverflow: document.documentElement.style.overflow,
    touchAction: document.body.style.touchAction,
    locked: document.body.getAttribute("data-scroll-locked"),
  }));

  expect(lockState.bodyOverflow).toBe("");
  expect(lockState.htmlOverflow).toBe("");
  expect(lockState.touchAction).toBe("");
  expect(lockState.locked).toBeNull();
}

test.describe("Header mobile scroll recovery", () => {
  test.describe("phone view", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("restores scrolling on phone view after closing the hamburger menu", async ({
      page,
      baseURL,
    }: any) => {
      await prepareHome(page, baseURL, "/en/home");
      await assertMenuCloseRestoresScroll(page);
    });
  });

  test.describe("tablet view", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test("restores scrolling on tablet view after closing the hamburger menu", async ({
      page,
      baseURL,
    }: any) => {
      await prepareHome(page, baseURL, "/en/home");
      await assertMenuCloseRestoresScroll(page);
    });
  });
});
