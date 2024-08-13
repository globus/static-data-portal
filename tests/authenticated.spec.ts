import { test } from "@playwright/test";

test("authenticated state", async ({ page }) => {
  await page.goto("/transfer");

  await page
    .getByRole("button", {
      name: "search for a destination",
    })
    .click();
});
