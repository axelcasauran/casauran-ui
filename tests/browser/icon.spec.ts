import { expect, test } from '@playwright/test';

const route = '/icon';

test('serves deterministic Icon markup from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="icon-server-probe"');
  expect(markup).toContain('data-csn-component="icon"');
  expect(markup).toContain('<svg');
});

test('keeps decorative and labelled icon semantics distinct', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('img', { name: 'Search records' })).toBeVisible();
  await expect(page.getByTestId('decorative-icon')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByTestId('unknown-icon').locator('svg')).toHaveCount(0);
});

test('supports size, flip, RTL, theme override, and forced colors', async ({
  browserName,
  page,
}) => {
  await page.goto(route);
  const flipped = page.locator('[data-flip="horizontal"]').first();
  expect(await flipped.evaluate((element) => getComputedStyle(element).transform)).not.toBe('none');
  await expect(page.locator('[dir="rtl"] [data-icon-name="search"]')).toBeVisible();
  const override = page.locator('.icon-probe__override');
  expect(await override.evaluate((element) => getComputedStyle(element).color)).not.toBe(
    await page
      .locator('[data-icon-name="home"]')
      .first()
      .evaluate((element) => getComputedStyle(element).color),
  );
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('labelled-icon')).toBeVisible();
});

test('renders the deterministic Icon theme matrix', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByTestId('icon-visual-matrix')).toHaveScreenshot('icon-matrix.png');
});
