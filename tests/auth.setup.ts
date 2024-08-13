import { test as setup } from "@playwright/test";
import "dotenv/config";

const AUTH_FILE = "playwright/.auth/user.json";

const USERNAME = process.env.TEST_GLOBUS_ID_USERNAME;
const PASSWORD = process.env.TEST_GLOBUS_ID_PASSWORD;

setup("authenticate", async ({ page }) => {
  if (!USERNAME || !PASSWORD) {
    throw Error(
      "TEST_GLOBUS_ID_USERNAME and TEST_GLOBUS_ID_PASSWORD are required for this test.",
    );
  }
  await page.goto("/");

  const url = new URL(page.url());
  const redirect = new URL("/transfer", url.origin).toString();

  await page.getByRole("button", { name: "Sign In" }).click();

  /**
   * Globus Auth – Log In (Account Select)
   */
  await page.getByText("Globus ID to sign in").click();
  /**
   * Globus ID – Log In
   */
  await page.getByRole("textbox", { name: "username" }).fill(USERNAME);
  await page.getByRole("textbox", { name: "password" }).fill(PASSWORD);

  await page.getByRole("button", { name: "Log In" }).click();

  /**
   * Account for cases where the provided username and password combination
   * has not been used for the configured application.
   * **THIS WILL AUTO-APPROVE CONSENT**
   */
  const consentRequired = await Promise.race([
    page
      .getByRole("button", { name: "Allow" })
      .waitFor()
      .then(() => true),
    page.waitForURL(redirect).then(() => false),
  ]);

  if (consentRequired) {
    /**
     * If the authenticated account needs to consent, do it!
     */
    await page.getByRole("button", { name: "Allow" }).click();
  }
  /**
   * Wait for the OAuth handshake to complete (and token exchange)
   */
  await page.waitForURL(redirect);
  await page.getByRole("button", {
    name: process.env.TEST_GLOBUS_ID_USERNAME,
  });
  // End of authentication steps.

  await page.context().storageState({ path: AUTH_FILE });
});
