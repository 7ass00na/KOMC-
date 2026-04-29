import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "Mobile 375x812",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "Mobile Android Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Tablet 768x1024",
      use: { ...devices["iPad Mini"] },
    },
    {
      name: "Desktop Chrome",
      testMatch: [
        "**/contact-page-metadata.spec.ts",
        "**/header-mobile-scroll.spec.ts",
        "**/landing-routing.spec.ts",
        "**/social-links.spec.ts",
        "**/welcome-card.spec.ts",
        "**/whatsapp-floating-button.spec.ts",
      ],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Desktop Firefox",
      testMatch: [
        "**/contact-page-metadata.spec.ts",
        "**/header-mobile-scroll.spec.ts",
        "**/landing-routing.spec.ts",
        "**/social-links.spec.ts",
        "**/welcome-card.spec.ts",
        "**/whatsapp-floating-button.spec.ts",
      ],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Desktop Safari",
      testMatch: [
        "**/contact-page-metadata.spec.ts",
        "**/header-mobile-scroll.spec.ts",
        "**/landing-routing.spec.ts",
        "**/social-links.spec.ts",
        "**/welcome-card.spec.ts",
        "**/whatsapp-floating-button.spec.ts",
      ],
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
