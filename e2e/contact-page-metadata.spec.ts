import { expect, test } from "@playwright/test";

const expectedTitle = "KOMC || Legal & Maritime Consultancy || Across the UAE";

async function preparePage(page: any, url: string) {
  await page.addInitScript(() => {
    localStorage.setItem("komc_intro_ts", String(Date.now()));
    document.cookie = `komc_intro_ts=${Date.now()}; path=/; samesite=lax`;
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
}

test.describe("Contact page metadata and consultation image", () => {
  test("renders the updated title and optimized consultation image on the English contact page", async ({
    page,
    baseURL,
  }: any) => {
    await preparePage(page, `${baseURL || "http://localhost:3000"}/en/contact-us`);

    await expect(page).toHaveTitle(expectedTitle);

    const consultationImage = page.getByAltText(
      "Professional legal consultation meeting at KOMC"
    );
    await expect(consultationImage).toBeVisible();
    await expect(consultationImage).toHaveAttribute(
      "src",
      /consultation-hero\.jpg/
    );
  });

  test("renders the updated title and optimized consultation image on the Arabic contact page", async ({
    page,
    baseURL,
  }: any) => {
    await preparePage(page, `${baseURL || "http://localhost:3000"}/ar/contact-us`);

    await expect(page).toHaveTitle(expectedTitle);

    const consultationImage = page.getByAltText(
      "اجتماع استشارة قانونية احترافية في KOMC"
    );
    await expect(consultationImage).toBeVisible();
    await expect(consultationImage).toHaveAttribute(
      "src",
      /consultation-hero\.jpg/
    );
  });
});
