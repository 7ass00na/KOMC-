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

async function scrollViewport(page: any, top: number) {
  await page.evaluate((nextTop) => {
    window.scrollTo(0, nextTop);
    window.dispatchEvent(new Event("scroll"));
  }, top);
}

test.describe("Responsive floating actions", () => {
  test("hide initially, appear after scroll, hide near footer, and reappear above the footer", async ({
    page,
    baseURL,
  }: any, testInfo: any) => {
    test.skip(testInfo.project.name.startsWith("Desktop "), "Responsive mobile and tablet layouts only.");

    await prepareHome(page, baseURL);

    const whatsappFab = page.getByRole("link", { name: /chat on whatsapp/i });
    const chatFab = page.getByRole("button", { name: /ai legal assistant/i });
    const footer = page.locator("[data-site-footer]");

    await expect(whatsappFab).toBeHidden();
    await expect(chatFab).toBeHidden();

    await scrollViewport(page, 500);
    await expect(whatsappFab).toBeVisible();
    await expect(chatFab).toBeVisible();

    await footer.scrollIntoViewIfNeeded();
    await expect(whatsappFab).toBeHidden();
    await expect(chatFab).toBeHidden();

    await scrollViewport(page, 280);
    await expect(whatsappFab).toBeVisible();
    await expect(chatFab).toBeVisible();
  });
});
