import { expect, test } from '@playwright/test';

test.describe('internationalization foundation', () => {
  test('renders the compiled package through production SSR', async ({ page, request }) => {
    const response = await request.get('/internationalization');
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain('server-safe package import from SSR.');
    expect(html).toContain('Bonjour, Ari.');

    await page.goto('/internationalization');
    await expect(page.getByTestId('i18n-server-probe')).toHaveText(
      'server-safe package import from SSR.',
    );
  });

  test('applies locale fallback and RTL while keeping untrusted messages as text', async ({
    page,
  }) => {
    await page.goto('/internationalization');
    await expect(page.getByLabel('Internationalization server result')).toHaveAttribute(
      'dir',
      'rtl',
    );
    await expect(page.getByTestId('i18n-direction')).toHaveText('rtl');
    await expect(page.getByTestId('i18n-message')).toHaveText('Bonjour, Ari.');
    await expect(page.getByTestId('i18n-message-locale')).toHaveText('fr');
    await expect(page.getByTestId('i18n-unsafe')).toHaveText('<img src=x onerror=alert(1)>');
    await expect(page.getByTestId('i18n-unsafe').locator('img')).toHaveCount(0);
    await expect(page.getByTestId('i18n-chain')).toContainText('zh-Hant-TW');
  });

  test('formats plurals, numbers, dates, and collation deterministically', async ({ page }) => {
    await page.goto('/internationalization');
    await expect(page.getByTestId('i18n-plural')).toHaveText('two:second');
    await expect(page.getByTestId('i18n-number')).toContainText('1.234,50');
    await expect(page.getByTestId('i18n-number-parts')).toContainText('currency');
    await expect(page.getByTestId('i18n-date')).toHaveText('02/01/2026');
    await expect(page.getByTestId('i18n-date-parts')).toContainText('year');
    await expect(page.getByTestId('i18n-collation')).toHaveText('-1');
  });
});
