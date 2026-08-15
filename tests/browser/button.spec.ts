import { expect, test } from '@playwright/test';

const route = '/button';

test('serves native Button markup from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="button-server-probe"');
  expect(markup).toContain('data-csn-component="button"');
  expect(markup).toContain('<button');
  expect(markup).toContain('aria-pressed="true"');
});

test('hydrates the local client boundary without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(route);
  await expect(page.getByTestId('button-client-probe')).toBeVisible();
  expect(errors).toEqual([]);
});

test('supports native pointer and keyboard activation with pressed semantics', async ({ page }) => {
  await page.goto(route);
  const uncontrolled = page.getByTestId('uncontrolled-toggle');
  await expect(uncontrolled).toHaveRole('button');
  await expect(uncontrolled).toHaveAccessibleName('Uncontrolled pin');
  await expect(uncontrolled).toHaveAttribute('aria-pressed', 'false');

  await uncontrolled.click();
  await expect(uncontrolled).toHaveAttribute('aria-pressed', 'true');
  await uncontrolled.press('Enter');
  await expect(uncontrolled).toHaveAttribute('aria-pressed', 'false');
  await uncontrolled.press('Space');
  await expect(uncontrolled).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('controlled-toggle').click();
  await expect(page.getByTestId('controlled-toggle')).toHaveAttribute('aria-pressed', 'true');
});

test('honors click cancellation and native disabled behavior', async ({ page }) => {
  await page.goto(route);
  await page.getByTestId('cancelled-toggle').click();
  await expect(page.getByTestId('cancelled-toggle')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('disabled-button')).toBeDisabled();
  await expect(page.getByTestId('disabled-button')).toHaveAttribute('data-disabled', '');
});

test('preserves native form submission and forwarded focus', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Submit form' }).click();
  await expect(page.getByRole('status', { name: 'Submit count' })).toHaveText('1');

  await page.getByRole('button', { name: 'Focus through ref' }).click();
  await expect(page.getByRole('button', { name: 'Focus target' })).toBeFocused();
  await expect(page.getByRole('status', { name: 'Focus count' })).toHaveText('1');
});

test('exposes icon-only names, RTL direction, density, and focus visibility', async ({ page }) => {
  await page.goto(route);
  const iconOnly = page.getByRole('button', { name: 'إضافة' });
  await expect(iconOnly).toHaveAttribute('data-icon-only', '');
  await expect(iconOnly).toHaveCSS('direction', 'rtl');

  const target = page.getByRole('button', { name: 'Focus target' });
  await target.focus();
  await expect(target).toBeFocused();
  expect(await target.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe(
    'none',
  );

  const compact = page.locator('[data-density="compact"] .csn-button').first();
  const comfortable = page.locator('[data-density="comfortable"] .csn-button').first();
  const compactPadding = Number.parseFloat(
    await compact.evaluate((el) => getComputedStyle(el).paddingInlineStart),
  );
  const comfortablePadding = Number.parseFloat(
    await comfortable.evaluate((el) => getComputedStyle(el).paddingInlineStart),
  );
  expect(compactPadding).toBeLessThan(comfortablePadding);

  const targetBox = await page.getByTestId('uncontrolled-toggle').boundingBox();
  expect(targetBox?.height).toBeGreaterThanOrEqual(44);

  const override = page.getByTestId('token-override');
  expect(await override.evaluate((element) => getComputedStyle(element).color)).not.toBe(
    await page
      .getByRole('button', { name: 'Small' })
      .evaluate((element) => getComputedStyle(element).color),
  );
});

test('supports touch activation and narrow reflow', async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 320, height: 720 },
  });
  const page = await context.newPage();
  await page.goto(route);
  const toggle = page.getByTestId('uncontrolled-toggle');
  await toggle.tap();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  const longAction = page.getByRole('button', {
    name: 'Long localized action that may wrap safely',
  });
  expect(await longAction.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
  await context.close();
});

test('renders a monotonic control size scale with square icon-only geometry', async ({ page }) => {
  await page.goto(route);

  const heights: number[] = [];
  for (const size of ['xs', 'sm', 'md', 'lg'] as const) {
    const iconOnly = page.getByTestId(`icon-only-${size}`);
    const box = await iconOnly.boundingBox();
    expect(box).not.toBeNull();
    // Icon-only actions must stay square at every size, not only at the default size.
    expect(Math.abs((box?.width ?? 0) - (box?.height ?? 0))).toBeLessThanOrEqual(1);
    heights.push(box?.height ?? 0);
  }

  for (let index = 1; index < heights.length; index += 1) {
    const previous = heights[index - 1] ?? 0;
    const current = heights[index] ?? 0;
    expect(current).toBeGreaterThan(previous);
  }
});

test('paints readable text for transparent appearances on every tone', async ({ page }) => {
  await page.goto(route);
  const colorOf = (testId: string) =>
    page.getByTestId(testId).evaluate((element) => getComputedStyle(element).color);
  const backgroundOf = (testId: string) =>
    page.getByTestId(testId).evaluate((element) => getComputedStyle(element).backgroundColor);

  // A transparent appearance must use the tone's text colour, not its pale control surface.
  const softText = await colorOf('neutral-soft');
  const softSurface = await backgroundOf('neutral-soft');
  for (const appearance of ['outline', 'ghost', 'link'] as const) {
    const text = await colorOf(`neutral-${appearance}`);
    expect(text).toBe(softText);
    expect(text).not.toBe(softSurface);
    expect(await backgroundOf(`neutral-${appearance}`)).toBe('rgba(0, 0, 0, 0)');
  }
});

test('composes the canonical Icon without a second interactive element', async ({ page }) => {
  await page.goto(route);
  const composition = page.getByTestId('button-icon-composition');

  const addRecord = composition.getByRole('button', { name: 'Add record' });
  await expect(addRecord).toBeVisible();
  await expect(addRecord).toHaveAccessibleName('Add record');
  expect(await composition.locator('button').count()).toBe(3);
  expect(await composition.locator('.csn-icon').count()).toBe(3);
  expect(await composition.getByRole('img').count()).toBe(0);

  const searchAction = page.getByTestId('icon-only-md');
  await expect(searchAction).toHaveAccessibleName('Search md');
});

test('honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  await expect(page.getByTestId('uncontrolled-toggle')).toHaveCSS('transition-duration', '0s');
});

test('uses system colors in forced-colors mode', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto(route);
  const button = page.getByTestId('uncontrolled-toggle');
  await expect(button).toBeVisible();
  expect(await button.evaluate((element) => getComputedStyle(element).borderTopStyle)).not.toBe(
    'none',
  );
});

test('renders the deterministic Button theme matrix', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByTestId('button-visual-matrix')).toHaveScreenshot('button-matrix.png');
});
