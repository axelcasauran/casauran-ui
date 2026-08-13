import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
});

test('visual test host boots', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Casauran UI/ })).toBeVisible();
});

test('production host serves SSR markup and hydrates a local client boundary', async ({
  page,
  request,
}) => {
  const response = await request.get('/infrastructure');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('Rendered by the production Next.js host.');
  expect(html).toContain('Client count:');

  const runtimeErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/infrastructure');
  await expect(page.getByTestId('server-probe')).toBeVisible();
  await expect(page.getByText('Client count: 0')).toBeVisible();
  await page.getByRole('button', { name: 'Increment probe' }).click();
  await expect(page.getByText('Client count: 1')).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
