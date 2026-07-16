import { expect, test } from "@playwright/test";

test("signs up, signs out, and signs back in", async ({ page }, testInfo) => {
  const uniquePart = `${testInfo.project.name}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const email = `roadmate-${uniquePart}@example.com`;
  const password = "RoadMate!2026";

  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await page.getByLabel("Email").fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Your trips" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
  const zagrebImage = page
    .getByRole("img", { name: /Zagreb Upper Town/ })
    .first();
  await expect(zagrebImage).toBeVisible();
  await expect
    .poll(() =>
      zagrebImage.evaluate((image) =>
        image instanceof HTMLImageElement ? image.naturalWidth : 0,
      ),
    )
    .toBeGreaterThan(0);

  await page
    .getByRole("article")
    .filter({ hasText: "Zagreb, Ljubljana & Graz" })
    .getByRole("link", { name: "Details" })
    .click();
  await expect(page).toHaveURL(/\/templates\/zagreb-ljubljana-graz$/);
  await expect(
    page.getByRole("heading", { name: "Zagreb, Ljubljana & Graz" }),
  ).toBeVisible();
  await expect(page.getByText("€812")).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Ljubljana riverfront/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Graz historic centre/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Use this template" }).click();
  await expect(page).toHaveURL(/\/trips\/new\?template=zagreb-ljubljana-graz$/);
  const tripTitle = page.getByLabel("Trip name");
  await tripTitle.press("End");
  await tripTitle.press("x");
  await expect(tripTitle).toBeFocused();
  await tripTitle.press("Backspace");
  await page.getByRole("button", { name: "Continue" }).click();
  const firstStop = page.locator("#trip-stop-0");
  await firstStop.press("End");
  await firstStop.press("x");
  await expect(firstStop).toBeFocused();
  await firstStop.press("Backspace");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Save & calculate" }).click();
  await expect(page).toHaveURL(/\/trips\/[0-9a-f-]+$/);
  await expect(
    page.getByRole("heading", { name: "Zagreb, Ljubljana & Graz" }),
  ).toBeVisible();
  await expect(page.getByText(/Your trip is saved/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tolls & vignettes" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "All trips" }).click();
  await expect(
    page
      .getByRole("article")
      .filter({ hasText: "Zagreb, Ljubljana & Graz" })
      .first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/$/);
  await page.goto("/signup");
  await expect(page).toHaveURL(/\/$/);

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
