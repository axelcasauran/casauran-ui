import { expect, test } from '@playwright/test';

test('visual test host boots', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Casauran UI/ })).toBeVisible();
});
