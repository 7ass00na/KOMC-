import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
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
      name: "Tablet 768x1024",
      use: { ...devices["iPad Mini"] },
    },
  ],
});

