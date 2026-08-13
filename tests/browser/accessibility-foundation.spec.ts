import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/accessibility-foundation');
});

test('serves semantic accessibility markup from the production SSR host', async ({
  page,
  request,
}) => {
  const response = await request.get('/accessibility-foundation');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('Server-rendered semantic and keyboard foundation probe.');
  expect(html).toContain('role="toolbar"');
  expect(html).toContain('aria-live="polite"');
  expect(html).toContain('data-csn-visually-hidden');
  await expect(page.getByTestId('accessibility-server-probe')).toBeVisible();
});

test('exposes native names, roles, states, and one roving tab stop', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'RTL roving focus demo' });
  await expect(toolbar).toMatchAriaSnapshot(`
    - toolbar "RTL roving focus demo":
      - button "Alpha"
      - button "Unavailable" [disabled]
      - button "Beta"
      - button "Gamma"
  `);
  await expect(toolbar.locator('button[tabindex="0"]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
});

test('moves roving focus in RTL, skips disabled items, loops, and announces', async ({ page }) => {
  const alpha = page.getByRole('button', { name: 'Alpha' });
  const beta = page.getByRole('button', { name: 'Beta' });
  const gamma = page.getByRole('button', { name: 'Gamma' });
  const liveRegion = page.getByTestId('live-region');

  await page.keyboard.press('Tab');
  await expect(alpha).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(beta).toBeFocused();
  await expect(beta).toHaveAttribute('tabindex', '0');
  await expect(alpha).toHaveAttribute('tabindex', '-1');
  await expect(liveRegion).toHaveText('Focused Beta');
  await expect(beta).toHaveCSS('outline-style', 'solid');

  await page.keyboard.press('End');
  await expect(gamma).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(alpha).toBeFocused();
  await page.keyboard.press('Home');
  await expect(alpha).toBeFocused();
});

test('does not move focus during IME composition', async ({ page }) => {
  const alpha = page.getByRole('button', { name: 'Alpha' });
  await alpha.focus();
  await alpha.dispatchEvent('keydown', { key: 'ArrowLeft', isComposing: true });
  await expect(alpha).toBeFocused();
  await expect(page.getByRole('button', { name: 'Beta' })).toHaveAttribute('tabindex', '-1');
});

test('finds real tabbable descendants and supports explicit programmatic focus', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Focus last tabbable' }).click();
  await expect(page.getByRole('button', { name: 'Last action' })).toBeFocused();
  await page.getByRole('button', { name: 'Focus programmatic target' }).click();
  await expect(page.getByTestId('live-region')).toHaveAttribute('aria-atomic', 'true');
  await expect(page.locator('#programmatic-target')).toBeFocused();
});

test('keeps visually hidden live text in the accessibility tree and never parses markup', async ({
  page,
}) => {
  const liveRegion = page.getByTestId('live-region');
  await expect(liveRegion).toHaveCSS('inline-size', '1px');
  await expect(liveRegion).toHaveCSS('block-size', '1px');
  await expect(page.getByRole('status')).toHaveCount(1);

  await page.getByRole('button', { name: 'Announce markup-like text' }).click();
  await expect(liveRegion).toHaveText('<img src=x onerror=alert(1)>');
  await expect(liveRegion.locator('img')).toHaveCount(0);
});
