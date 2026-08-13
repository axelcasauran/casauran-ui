import { expect, test } from '@playwright/test';

const route = '/overlay-foundation';

test('imports the overlay package in production SSR and hydrates without errors', async ({
  page,
}) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="overlay-server-probe"');
  expect(markup).toContain('server-safe');
  expect(markup).toContain('package import from SSR.');

  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(route);
  await expect(page.getByRole('region', { name: 'Overlay lifecycle probe' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('creates, synchronizes, and destroys a governed portal scope', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Create scoped portal' }).click();
  const host = page.locator('[data-csn-overlay-host]');
  await expect(host).toHaveAttribute('data-theme', 'dark');
  await expect(host).toHaveAttribute('data-density', 'compact');
  await expect(host).toHaveAttribute('dir', 'rtl');
  await expect(page.getByTestId('portal-content')).toHaveText('Portal content');

  await page.getByRole('button', { name: 'Synchronize portal scope' }).click();
  await expect(host).toHaveAttribute('data-theme', 'light');
  await expect(host).toHaveAttribute('data-density', 'comfortable');
  await expect(host).toHaveAttribute('dir', 'ltr');
  await page.getByRole('button', { name: 'Destroy portal' }).click();
  await expect(host).toHaveCount(0);
});

test('dismisses only the top layer for outside pointer and composition-safe Escape', async ({
  page,
}) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Open parent layer' }).click();
  await page.getByRole('button', { name: 'Open child layer' }).click();
  await page.getByRole('button', { name: 'Child first' }).dispatchEvent('keydown', {
    key: 'Escape',
    isComposing: true,
  });
  await expect(page.getByRole('group', { name: 'Child layer' })).toBeVisible();

  await page.getByRole('button', { name: 'Parent first' }).click({ force: true });
  await expect(page.getByRole('group', { name: 'Child layer' })).toHaveCount(0);
  await expect(page.getByRole('group', { name: 'Parent layer' })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Dismiss log' })).toHaveText(
    'child:pointer-outside',
  );

  await page.keyboard.press('Escape');
  await expect(page.getByRole('group', { name: 'Parent layer' })).toHaveCount(0);
  await expect(page.getByRole('status', { name: 'Dismiss log' })).toHaveText('parent:escape-key');
});

test('contains nested Tab focus and restores each scope in order', async ({ page }) => {
  await page.goto(route);
  const parentTrigger = page.getByRole('button', { name: 'Open parent layer' });
  await parentTrigger.click();
  await expect(page.getByRole('button', { name: 'Parent first' })).toBeFocused();
  const childTrigger = page.getByRole('button', { name: 'Open child layer' });
  await childTrigger.click();
  const childFirst = page.getByRole('button', { name: 'Child first' });
  const childLast = page.getByRole('button', { name: 'Child last' });
  await expect(childFirst).toBeFocused();
  await childLast.focus();
  await page.keyboard.press('Tab');
  await expect(childFirst).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(childLast).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(childTrigger).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(parentTrigger).toBeFocused();
});

test('isolates modal background and restores native inert state after nesting', async ({
  page,
}) => {
  await page.goto(route);
  const background = page.getByTestId('background-action');
  const parentTrigger = page.getByTestId('parent-trigger');
  await parentTrigger.click();
  await expect(background).toHaveJSProperty('inert', true);
  await expect(parentTrigger).toHaveJSProperty('inert', true);
  await page.getByRole('button', { name: 'Open child layer' }).click();
  await expect(page.getByRole('button', { name: 'Parent first' })).toHaveJSProperty('inert', true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Parent first' })).toHaveJSProperty('inert', false);
  await page.keyboard.press('Escape');
  await expect(background).toHaveJSProperty('inert', false);
  await expect(parentTrigger).toHaveJSProperty('inert', false);
});
