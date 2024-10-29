import { test } from "@playwright/test";

import { authenticate } from "./utils";

/**
 * Ensures storageState for Globus ID is cleared before each test.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test("authenticated state", async ({ page }) => {
  await authenticate(page);

  await page.getByRole("link", { name: "Transfer" }).click();
  await page
    .getByRole("button", {
      name: "search for a destination",
    })
    .click();
});
