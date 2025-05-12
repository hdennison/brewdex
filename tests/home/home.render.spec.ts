import { test, expect, type Page } from "@playwright/test";
import { documents } from "../fixtures/api";

/*
  The whole UI is already tested with Vitest.

  Here, usually we can do screenshots in the different viewports we want to run the app.
  In this particular case, the font we are using is 'system-ui' so it will vary between diferent OS.
  That means that running the tests in different environments can lead to potential false errrors as
  the font will render slightly different.
  There are many ways to solve this, but for now, I'm just asserting visibility.
*/

test.describe("on page load", () => {
  test("has correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Brewdex/);
  });

  test("renders heading", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Documents",
    });

    await expect(heading).toBeInViewport();
  });

  test("renders sorting select", async ({ page }) => {
    await page.goto("/");
    const select = page.getByLabel("Sort by:");

    await expect(select).toBeInViewport();
  });

  test("renders layout controls", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: '"Switch to list view"' })
    ).toBeInViewport();
    await expect(
      page.getByRole("button", { name: '"Switch to grid view"' })
    ).toBeInViewport();
  });

  test("renders table of documents", async ({ page }) => {
    await page.route("http://localhost:8080/documents", async (route) => {
      const json = documents;
      await route.fulfill({ json });
    });

    await page.goto("/");

    const table = page.getByTestId("documents-table");

    const headers = table.locator("thead th");
    await expect(headers).toHaveText(["Name", "Contributors", "Attachments"]);

    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(3);

    const expectedTitles = ["Alpha", "Gamma"];
    const rowsLen = expectedTitles.length - 1; // the last row is not a document, is the "add button"'

    for (let i = 0; i < rowsLen; i++) {
      const nameCell = rows.nth(i).locator("td").first();
      await expect(nameCell).toContainText(expectedTitles[i]);
    }
  });
});
