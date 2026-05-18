import { test as setup, expect } from "@playwright/test";
import * as userData from "../../sensitive-data/user.json";
import fs from "fs";

const authFile = "playwright/.auth/standard-user.json";

setup("authenticate only if needed", async () => {
  // 1. Dynamically import cloakbrowser here
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

  // ... rest of your code remains exactly the same

  // // 3. Manually start tracing (since your config has trace: "on")
  // await context.tracing.start({
  //   screenshots: true,
  //   snapshots: true,
  //   sources: true,
  // });

  const page = await context.newPage();

  if (fs.existsSync(authFile)) {
    await context.addCookies(JSON.parse(fs.readFileSync(authFile)).cookies);
  }

  // 4. Use the baseURL defined in your config
  // await page.goto("https://dataverse-staging.rdmc.unc.edu/");

  await page.goto("https://dataverse-staging.rdmc.unc.edu/dataverse/unc");
  await page.goto(
    "https://dataverse-staging.rdmc.unc.edu/dataset.xhtml?persistentId=doi:10.33563/FK2/QEAPZL",
  );

  const loginButton = page.getByRole("link", { name: "Log In", exact: true });

  if (await loginButton.isHidden()) {
    console.log("Already logged in. Skipping 2FA.");

    // Stop tracing and close context/browser cleanly
    await context.tracing.stop({ path: "test-results/setup-trace.zip" });
    await context.close(); // Required to finalize video saving
    await browser.close();
    return;
  }

  console.log("Not logged in. Proceeding with authentication.");
  await loginButton.click({ force: true });
  await page
    .locator("#idpSelectSelector")
    .selectOption("https://sso.unc.edu/idp");
  await page.getByRole("button", { name: "Continue" }).click({ force: true });
  await page.locator("#username").fill(userData.username);
  await page.locator("#nextBtn").click();
  await page.locator("#password").fill(userData.password);
  await page.locator("#submitBtn").click();

  await expect(page).toHaveURL(/duosecurity/);
  await page.getByText("Yes").click();
  await expect(page).toHaveURL(/dataverse\.xhtml/);

  // 5. Save the fresh session
  await context.storageState({ path: authFile });

  // 6. Stop tracing and save the zip file
  await context.tracing.stop({ path: "test-results/setup-trace.zip" });

  // 7. Close context (saves video) and browser
  await context.close();
  await browser.close();
});
