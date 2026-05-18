import { defineConfig, devices } from "@playwright/test";
const process = (globalThis as any).process;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 90000,
  /* Run tests in files in sequence */
  workers: 1,
  fullyParallel: false,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: true,

    launchOptions: {
      slowMo: 2000,
    },

    // Sets the default viewport size for all tests
    viewport: { width: 1920, height: 1080 },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",

    /* Always collect video and screenshots, even when tests pass. See https://playwright.dev/docs/video-and-screenshots */
    video: {
      mode: "on",
      size: { width: 1920, height: 1080 },
    },

    screenshot: {
      mode: "on",
      fullPage: true,
    },
  },

  /* Configure the output directory for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",

  /* Configure projects for major browsers */
  projects: [
    /* =========================================================
       1. 21 CFR Part 11 Suite (No stealth needed)
       ========================================================= */
    {
      name: "setup-21cfr",
      testMatch: /21cfrpart11\/.*\.setup\.ts/,
      use: {
        baseURL: process.env.BASE_URL_21CFR, // <-- Add this here
      },
    },
    {
      name: "21cfrpart11",
      testMatch: /21cfrpart11\/.*\.spec\.ts/, // Only run specs in this folder
      use: {
        browserName: "chromium",
        channel: "chrome",
        baseURL: process.env.BASE_URL_21CFR, // <-- 21CFR Base URL
        storageState: "playwright/.auth/21cfr-user.json", // Separate auth file
      },
      dependencies: ["setup-21cfr"],
    },

    /* =========================================================
       2. Standard Suite (Uses Cloakbrowser in setup)
       ========================================================= */
    {
      name: "setup-standard",
      testMatch: /standard\/.*\.setup\.ts/,
      use: {
        baseURL: process.env.BASE_URL_STANDARD,
      },
    },
    {
      name: "standard",
      testMatch: /standard\/.*\.spec\.ts/, // Only run specs in this folder
      use: {
        browserName: "chromium",
        channel: "chrome",
        baseURL: process.env.BASE_URL_STANDARD, // <-- Standard Base URL
        storageState: "playwright/.auth/standard-user.json", // Separate auth file
      },
      dependencies: ["setup-standard"],
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
