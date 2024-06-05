import { test, expect } from "@playwright/test";

import _STATIC from "../static.json";

test.use({ storageState: { cookies: [], origins: [] } });

test("supports 'title'", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(_STATIC.data.attributes.content.title);
});

test("supports 'tagline'", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText(_STATIC.data.attributes.content.tagline),
  ).toBeVisible();
});

test("supports 'privacy_policy'", async ({ page }) => {
  await page.goto("/privacy-policy");

  await expect(
    page.getByText(_STATIC.data.attributes.content.privacy_policy),
  ).toBeVisible();
});

test("supports 'terms_of_service'", async ({ page }) => {
  await page.goto("/terms-and-conditions");

  await expect(
    page.getByText(_STATIC.data.attributes.content.terms_of_service),
  ).toBeVisible();
});
