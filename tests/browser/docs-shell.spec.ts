import { expect, test } from '@playwright/test';

const docsUrl = 'http://localhost:3100';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
});

test('documentation shell serves production SSR, deep links, and registry metadata', async ({
  page,
  request,
}) => {
  const response = await request.get(`${docsUrl}/components/button`);
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('Button is Casauran UI');
  expect(html).toContain('Skip to documentation');
  expect(html).toContain('id="api"');

  const indexResponse = await request.get(`${docsUrl}/docs-index.json`);
  expect(indexResponse.ok()).toBe(true);
  const index = (await indexResponse.json()) as {
    schemaVersion: number;
    source: string;
    documents: Array<{ stageId: string; href: string }>;
  };
  expect(index.schemaVersion).toBe(1);
  expect(index.source).toBe('.agent/stages/index.json');
  expect(index.documents).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ stageId: '1.01', href: '/components/button' }),
      expect.objectContaining({ stageId: '1.02', href: '/components/icon' }),
    ]),
  );

  const runtimeErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto(`${docsUrl}/components/button#api`);
  await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible();
  await expect(page.locator('#api')).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Button 1.01' }).first()).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('navigation', { name: 'Documentation' }).first()).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'On this page' })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test('skip navigation and application controls have durable keyboard semantics', async ({
  browserName,
  page,
}) => {
  await page.goto(docsUrl);
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to documentation' });
  if (browserName !== 'webkit') await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('group', { name: 'Documentation presentation' })).toBeVisible();
  await expect(page.getByRole('note', { name: 'Stage boundary' })).toBeVisible();
});

test('presentation controls remain a narrow hydration boundary and shell is deterministic', async ({
  page,
}) => {
  await page.goto(docsUrl);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Use dark presentation' }).click();
  await page.getByRole('button', { name: 'Use compact density' }).click();
  await page.getByRole('button', { name: 'Toggle text direction' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page).toHaveScreenshot('docs-shell-dark-compact-rtl.png', { fullPage: true });
});

test('mobile navigation and reflow remain keyboard and touch accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(docsUrl);
  await expect(page.locator('.docs-sidebar')).toBeHidden();
  const mobileNavigation = page.getByText('Browse documentation', { exact: true });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.click();
  await expect(page.getByRole('navigation', { name: 'Documentation' })).toBeVisible();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await expect(page).toHaveScreenshot('docs-shell-mobile.png', { fullPage: true });
});
