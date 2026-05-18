import { test as setup } from "@playwright/test";

setup("visit sites and quit", async () => {
  // 1. Grab the URL from the command line environment variable
  const targetUrl = process.env.BASE_URL_STANDARD;

  if (!targetUrl) {
    throw new Error("BASE_URL_STANDARD environment variable is missing!");
  }

  // 2. Dynamically import cloakbrowser
  const { launch } = await import("cloakbrowser");

  const browser = await launch({
    headless: true,
    slowMo: 2000,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: "test-results/setup-videos/",
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  // 3. Visit the two specific sites using the environment variable
  // Using the URL constructor ensures paths are joined correctly regardless of trailing slashes
  await page.goto(new URL("dataverse/unc", targetUrl).toString());
  await page.goto(
    new URL(
      "dataset.xhtml?persistentId=doi:10.33563/FK2/QEAPZL",
      targetUrl,
    ).toString(),
  );

  // 4. Navigate back to the homepage
  await page.goto(targetUrl);

  // 5. Close context (saves video) and browser
  await context.close();
  await browser.close();
});
