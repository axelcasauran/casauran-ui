import { expect, test } from '@playwright/test';

test.describe('date-math foundation', () => {
  test('renders the compiled package through production SSR', async ({ page, request }) => {
    const response = await request.get('/date-math');
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain('server-safe package import from SSR.');
    expect(html).toContain('2024');

    await page.goto('/date-math');
    await expect(page.getByTestId('date-math-server-probe')).toHaveText(
      'server-safe package import from SSR.',
    );
  });

  test('calculates calendar and inclusive range values deterministically', async ({ page }) => {
    await page.goto('/date-math');
    await expect(page.getByTestId('date-math-month-end')).toHaveText(
      JSON.stringify({ year: 2024, month: 2, day: 29 }),
    );
    await expect(page.getByTestId('date-math-range-length')).toHaveText('3');
    await expect(page.getByTestId('date-math-iso-week')).toHaveText('2020-W53-5');
  });

  test('resolves the DST gap and overlap with explicit policy', async ({ page }) => {
    await page.goto('/date-math');
    await expect(page.getByTestId('date-math-gap')).toHaveText(String(Date.UTC(2026, 2, 8, 7, 30)));
    await expect(page.getByTestId('date-math-gap-earlier')).toHaveText(
      String(Date.UTC(2026, 2, 8, 6, 30)),
    );
    await expect(page.getByTestId('date-math-overlap')).toHaveText(
      String(Date.UTC(2026, 10, 1, 5, 30)),
    );
    await expect(page.getByTestId('date-math-overlap-later')).toHaveText(
      String(Date.UTC(2026, 10, 1, 6, 30)),
    );
  });
});
