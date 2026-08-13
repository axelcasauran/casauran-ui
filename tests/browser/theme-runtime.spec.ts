import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.goto('/theme-runtime');
});

test('applies light, dark, density, and detached portal scopes', async ({ page }) => {
  const light = page.getByTestId('light-comfortable');
  const dark = page.getByTestId('dark-compact');
  const portal = page.getByTestId('portal-scope');

  await expect(dark).toHaveAttribute('data-density', 'compact');
  await expect(light).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(light).toHaveCSS('color', 'rgb(15, 23, 42)');
  await expect(light).toHaveCSS('padding-inline-start', '12px');
  await expect(page.getByTestId('override-target')).toHaveCSS(
    'background-color',
    'rgb(220, 38, 38)',
  );
  await expect(dark).toHaveCSS('background-color', 'rgb(51, 65, 85)');
  await expect(dark).toHaveCSS('color', 'rgb(248, 250, 252)');
  await expect(dark).toHaveCSS('padding-inline-start', '8px');
  await expect(portal).toHaveCSS('background-color', 'rgb(51, 65, 85)');
});

test('switches theme attributes without a client theme provider', async ({ page }) => {
  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'light');
  await root.evaluate((element) => {
    element.setAttribute('data-theme', 'dark');
  });
  await expect(root).toHaveCSS('background-color', 'rgb(15, 23, 42)');
  await expect(root).toHaveCSS('color', 'rgb(248, 250, 252)');
});

test('uses logical spacing under dir rtl', async ({ page }) => {
  const marker = page.getByTestId('logical-marker');
  await expect(page.getByTestId('rtl-probe')).toHaveAttribute('dir', 'rtl');
  await expect(marker).toHaveCSS('margin-right', '12px');
});

test('honors prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
    true,
  );
  await expect(page.getByTestId('motion-target')).toHaveCSS('transition-duration', '0s');
});

test('honors forced-colors with system assignments', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'forced-colors emulation is exercised in Chromium');
  await page.emulateMedia({ forcedColors: 'active' });
  expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
  const focusRing = await page
    .getByTestId('light-comfortable')
    .evaluate((element) => getComputedStyle(element).getPropertyValue('--csn-focus-ring').trim());
  expect(focusRing).toBe('Highlight');
});

test('renders the deterministic theme matrix', async ({ page }) => {
  await expect(page.getByTestId('theme-matrix')).toHaveScreenshot('theme-runtime-matrix.png');
});
