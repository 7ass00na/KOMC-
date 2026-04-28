import { expect, test } from "@playwright/test";

async function prepareHome(page: any, baseURL: string | undefined) {
  await page.addInitScript(() => {
    localStorage.setItem("komc_intro_ts", String(Date.now()));
    document.cookie = `komc_intro_ts=${Date.now()}; path=/; samesite=lax`;
  });

  await page.goto((baseURL || "http://localhost:3000") + "/en/home", {
    waitUntil: "domcontentloaded",
  });
}

const expectedLinks = [
  { kind: "facebook", href: "https://www.facebook.com/share/1GpGDQHDdL/" },
  {
    kind: "instagram",
    href: "https://www.instagram.com/komc.23?igsh=MTNtZDF3NXdtdWdoMA==",
  },
  { kind: "tiktok", href: "https://tiktok.com/@komc.23" },
  { kind: "email", href: "mailto:info.komc23@gmail.com" },
];

test.describe("Social links", () => {
  test("renders footer social links in the requested order on desktop", async ({
    browser,
    baseURL,
  }: any, testInfo: any) => {
    test.skip(testInfo.project.name !== "Mobile 375x812", "Desktop validation runs once.");

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      isMobile: false,
    });
    const page = await context.newPage();

    try {
      await prepareHome(page, baseURL);
      const footerLinks = page.locator("footer [data-social]");
      await expect(footerLinks).toHaveCount(4);

      for (const [index, expected] of expectedLinks.entries()) {
        const link = footerLinks.nth(index);
        await expect(link).toHaveAttribute("data-social", expected.kind);
        await expect(link).toHaveAttribute("href", expected.href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    } finally {
      await context.close();
    }
  });

  test("renders header mobile social links in the requested order", async ({
    page,
    baseURL,
  }: any) => {
    await prepareHome(page, baseURL);

    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
    await page.getByRole("button", { name: /menu/i }).click();
    const mobileLinks = page.locator('[role="dialog"] [data-social]');
    await expect(mobileLinks).toHaveCount(4);

    for (const [index, expected] of expectedLinks.entries()) {
      const link = mobileLinks.nth(index);
      await expect(link).toHaveAttribute("data-social", expected.kind);
      await expect(link).toHaveAttribute("href", expected.href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
