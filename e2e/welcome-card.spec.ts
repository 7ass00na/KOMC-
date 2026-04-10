import { test, expect } from "@playwright/test";

async function assertSticky(page: any, selector: string) {
  const before = await page.locator(selector).boundingBox();
  await page.waitForTimeout(50);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(250);
  const after = await page.locator(selector).boundingBox();
  expect(before && after).toBeTruthy();
  if (before && after) {
    expect(Math.abs(before.y - after.y)).toBeLessThanOrEqual(1);
  }
}

test.describe("Welcome Card — mobile 375x812", () => {
  test.use({ viewport: { width: 375, height: 812 } });
  test("sticky image, independent scroll, text fade", async ({ page, baseURL }: any) => {
    await page.goto((baseURL || "http://localhost:3000") + "/Demo.tsx");
    const stickySel = "[data-intro-overlay] .grid > div:nth-child(1)";
    const paneSel = "[data-intro-overlay] .grid > div:nth-child(2)";
    await assertSticky(page, stickySel);
    const pane = page.locator(paneSel);
    // independent scroll
    await pane.evaluate((el: any) => {
      (el as HTMLElement).scrollTop = (el as HTMLElement).clientHeight * 0.3;
    });
    const scrollTop = await pane.evaluate((el: any) => (el as HTMLElement).scrollTop);
    expect(scrollTop).toBeGreaterThan(0);
    // text fade: opacity var reflected on computed style via inline style consumer
    const textWrap = page.locator(paneSel + " h1");
    const opacity = await textWrap.evaluate((el: any) => {
      return Number(getComputedStyle(el.parentElement!).opacity);
    });
    expect(opacity).toBeLessThan(0.5);
  });
});

test.describe("Welcome Card — tablet 768x1024", () => {
  test.use({ viewport: { width: 768, height: 1024 } });
  test("sticky image, independent scroll, text fade", async ({ page, baseURL }: any) => {
    await page.goto((baseURL || "http://localhost:3000") + "/Demo.tsx");
    const stickySel = "[data-intro-overlay] .grid > div:nth-child(1)";
    const paneSel = "[data-intro-overlay] .grid > div:nth-child(2)";
    await assertSticky(page, stickySel);
    const pane = page.locator(paneSel);
    await pane.evaluate((el: any) => {
      (el as HTMLElement).scrollTop = (el as HTMLElement).clientHeight * 0.3;
    });
    const textWrap = page.locator(paneSel + " h1");
    const opacity = await textWrap.evaluate((el: any) => {
      return Number(getComputedStyle(el.parentElement!).opacity);
    });
    expect(opacity).toBeLessThan(0.5);
  });
});
