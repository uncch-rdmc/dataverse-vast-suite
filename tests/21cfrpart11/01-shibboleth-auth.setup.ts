import { test as setup, expect } from "@playwright/test";
import * as userData from "../../sensitive-data/user.json";
import fs from "fs";

const authFile = "playwright/.auth/21cfr-user.json.json";

setup("authenticate only if needed", async ({ page }) => {
  if (fs.existsSync(authFile)) {
    await page
      .context()
      .addCookies(JSON.parse(fs.readFileSync(authFile)).cookies);
  }

  await page.goto("/");

  const loginButton = page.getByRole("link", { name: "Log In", exact: true });

  if (await loginButton.isHidden()) {
    console.log("Already logged in. Skipping 2FA.");
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
  await expect(page).toHaveURL(/dataverse.xhtml/);

  // 4. Save the fresh session
  await page.context().storageState({ path: authFile });
});
