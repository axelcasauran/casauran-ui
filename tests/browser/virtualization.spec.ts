import { expect, test } from '@playwright/test';

test.describe('virtualization foundation', () => {
  test('renders deterministic 1D and 2D windows through production SSR', async ({
    page,
    request,
  }) => {
    const response = await request.get('/virtualization');
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain('server-safe package import from SSR.');
    expect(html).toContain('0,3,4,5,6,7,8,9');

    await page.goto('/virtualization');
    await expect(page.getByTestId('virtual-axis-window')).toHaveText('0,3,4,5,6,7,8,9');
    await expect(page.getByTestId('virtual-axis-total')).toHaveText('2500');
    await expect(page.getByTestId('virtual-grid-window')).toHaveText('2-3:2-3');
  });

  test('measures dynamic rows and applies stable scroll anchoring', async ({ page }) => {
    await page.goto('/virtualization');
    await expect(page.getByTestId('virtual-scroll-adjustment')).toHaveText('30');
    await expect(page.getByTestId('virtual-viewport')).toHaveJSProperty('scrollTop', 150);
  });

  test('keeps a focused pinned item mounted while the viewport moves', async ({ page }) => {
    await page.goto('/virtualization');
    const pinned = page.getByTestId('virtual-row-0');
    await pinned.focus();
    await expect(pinned).toBeFocused();
    await page.getByTestId('virtual-viewport').evaluate((element) => {
      element.scrollTop = 600;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    await expect(pinned).toBeAttached();
    await expect(pinned).toBeFocused();
    await expect(page.getByTestId('virtual-row-20')).toBeAttached();
  });
});
