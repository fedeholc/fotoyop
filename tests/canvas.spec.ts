import { test, expect } from '@playwright/test';
import path from 'path';


test('carga de una imagen', async ({ page }) => {
  await page.goto('http://localhost:3012/');
  const canvas = page.locator('#canvas-small');
  const input = page.getByTestId('inputUpload');
  await expect(canvas).not.toBeVisible();
  await expect(input).toBeAttached();
  await input.setInputFiles(path.join(__dirname, 'a.png'));
  await expect(canvas).toBeVisible();
}
);