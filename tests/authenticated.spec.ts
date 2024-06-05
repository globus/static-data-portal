import { test, expect } from "@playwright/test";

test("authenticated state", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", {
      name: "search for a destination",
    })
    .click();
});
