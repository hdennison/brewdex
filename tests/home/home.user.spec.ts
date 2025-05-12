import { test, expect } from "@playwright/test";
import { documents } from "../fixtures/api";

const newDocument = {
  name: "New document",
  contributor: "Pepe",
  attachment: "test-file.pdf",
};

const fileToUpload = "./tests/fixtures/test-file.pdf";

// Testing only happy path
test.describe("user interaction", () => {
  test("user can add a new document", async ({ page }) => {
    await page.route("http://localhost:8080/documents", async (route) => {
      const json = documents;
      await route.fulfill({ json });
    });

    await page.goto("/");

    // Open modal
    await page.getByRole("button", { name: "Add a new document" }).click();

    // Fill fields
    await page.getByLabel("Document Name").fill(newDocument.name);
    await page.getByLabel("Contributor 1").fill(newDocument.contributor);

    await page.getByLabel("Attachment 1").setInputFiles(fileToUpload);

    // Submit
    await page.getByRole("button", { name: "Add Document" }).click();

    // New document should be visible
    await expect(
      page.getByTestId("documents-table").getByText(newDocument.name)
    ).toBeVisible();
    await expect(page.getByText("Created: now")).toBeVisible();
    await expect(page.getByText("Version: 0.0.1")).toBeVisible();
    await expect(page.getByText(newDocument.contributor)).toBeVisible();
    await expect(page.getByText(newDocument.attachment)).toBeVisible();
  });
});
