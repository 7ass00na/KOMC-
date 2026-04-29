import { expect, test } from "@playwright/test";

async function prepareHome(page: any, baseURL: string | undefined, path: string) {
  await page.addInitScript(() => {
    localStorage.setItem("komc_intro_ts", String(Date.now()));
    document.cookie = `komc_intro_ts=${Date.now()}; path=/; samesite=lax`;
  });

  await page.goto((baseURL || "http://localhost:3000") + path, {
    waitUntil: "domcontentloaded",
  });
}

async function assertFabLink(page: any, label: RegExp, expectedSnippet: string) {
  await page.evaluate(() => {
    window.scrollTo(0, 300);
    window.dispatchEvent(new Event("scroll"));
  });

  const link = page.getByRole("link", { name: label });
  await expect(link).toBeVisible({ timeout: 10_000 });

  const href = await link.getAttribute("href");
  expect(href).toBeTruthy();
  expect(href).toContain("https://wa.me/971543456591?text=");
  expect(decodeURIComponent((href || "").split("?text=")[1] || "")).toContain(expectedSnippet);
}

test.describe("WhatsApp floating button", () => {
  test("uses localized WhatsApp links on responsive layouts", async ({
    page,
    baseURL,
  }: any, testInfo: any) => {
    test.skip(testInfo.project.name.startsWith("Desktop "), "Mobile and tablet layouts only.");

    await prepareHome(page, baseURL, "/en/home");
    await assertFabLink(page, /chat on whatsapp/i, "Hello, KOMC Team");

    const arabicPage = await page.context().newPage();
    try {
      await prepareHome(arabicPage, baseURL, "/ar/home");
      await assertFabLink(arabicPage, /الدردشة عبر واتساب/i, "مرحبًا فريق خالد عمر");
    } finally {
      await arabicPage.close();
    }
  });

  test("uses the updated WhatsApp link on desktop", async ({
    page,
    baseURL,
  }: any, testInfo: any) => {
    test.skip(!testInfo.project.name.startsWith("Desktop "), "Desktop browsers only.");

    await prepareHome(page, baseURL, "/en/home");
    await assertFabLink(page, /chat on whatsapp/i, "Hello, KOMC Team");
  });
});
