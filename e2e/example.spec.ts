import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/14Voices/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // Test navigation links exist
  await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /demos/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
});
