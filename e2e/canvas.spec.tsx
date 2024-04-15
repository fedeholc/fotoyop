import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

test("carga de una imagen", async ({ page }) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  console.log("env2: ", process.env.BASE_URL!);
  await page.goto(process.env.BASE_URL!);
  const canvas = page.locator("#canvas-small");
  const input = page.getByTestId("inputUpload");
  await expect(canvas).not.toBeVisible();
  await expect(input).toBeAttached();
  await input.setInputFiles(path.join(__dirname, "a.png"));
  await expect(canvas).toBeVisible();
});
