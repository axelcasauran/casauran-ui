import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';

const docsUrl = 'http://localhost:3100';
const repositoryRoot = process.cwd();

interface CoverageRule {
  readonly mode: string;
  /** The topic that owns the feature; the route its previews live on. */
  readonly anchor?: string;
  readonly attribute?: string;
  readonly values?: readonly string[];
}

interface ComponentRegistryEntry {
  readonly slug: string;
  readonly featureCoverage?: Readonly<Record<string, CoverageRule>>;
}

const registryEntry = (slug: string): ComponentRegistryEntry =>
  JSON.parse(
    readFileSync(path.join(repositoryRoot, `registry/components/${slug}.json`), 'utf8'),
  ) as ComponentRegistryEntry;

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
  // Every published section anchor from the single-page era still resolves on the overview and
  // links to the topic that now owns it (F0.19 deep-link continuity).
  expect(html).toContain('id="api"');
  expect(html).toContain('/components/button/api');

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

test('every enumerated feature value declared in the registry renders on the topic that owns it', async ({
  page,
}) => {
  // ADR-023: a value can be named in the API table and still paint nothing. The registry declares
  // the value set, the attribute that reflects it, and the topic that owns it, so each is checked
  // against real markup on its own route.
  const { featureCoverage } = registryEntry('button');
  const enumerated = Object.entries(featureCoverage ?? {}).filter(
    ([, rule]) => rule.mode === 'preview' && rule.attribute !== undefined && rule.values,
  );
  expect(enumerated.length).toBeGreaterThan(0);

  for (const [feature, rule] of enumerated) {
    await page.goto(`${docsUrl}/components/button/${String(rule.anchor)}`);
    for (const value of rule.values ?? []) {
      const rendered = page.locator(`[${String(rule.attribute)}="${value}"]`);
      expect(await rendered.count(), `${feature}=${value} must be previewed`).toBeGreaterThan(0);
      await expect(rendered.first()).toBeVisible();
    }
  }
});

test('component topics are generated, navigable, and keyboard reachable', async ({ page }) => {
  await page.goto(`${docsUrl}/components/button`);

  const topicNavigation = page.getByRole('list', { name: 'Button topics' }).first();
  await expect(topicNavigation).toBeVisible();
  expect(await topicNavigation.getByRole('link').count()).toBeGreaterThan(10);

  await page.goto(`${docsUrl}/components/button/appearance`);
  await expect(page.getByRole('heading', { level: 1, name: 'Appearance and tone' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  expect(await page.getByRole('main').locator('h1').count()).toBe(1);
  await expect(
    page.getByRole('link', { name: 'Appearance and tone', exact: true }).first(),
  ).toHaveAttribute('aria-current', 'page');

  // Paging between topics keeps the model order.
  await page
    .getByRole('navigation', { name: 'Topic navigation' })
    .getByText('Sizes and shapes')
    .click();
  await expect(page).toHaveURL(`${docsUrl}/components/button/sizes`);
  await expect(page.getByRole('heading', { level: 1, name: 'Sizes and shapes' })).toBeVisible();
});

test('examples are interactive and publish the source that renders them', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await page.goto(`${docsUrl}/components/button/events`);

  const toggle = page.getByRole('button', { name: 'Pin record' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  // The example cancels its own toggle until the second control unlocks it, so the live preview
  // demonstrates cancellation rather than describing it.
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Cancelling toggles' }).click();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('tab', { name: 'View source' }).first().click();
  const source = page.getByRole('tabpanel').filter({ hasText: 'export function' }).first();
  await expect(source).toBeVisible();
  await expect(source).toContainText('CancellableActivationExample');
  await expect(source).toContainText('preventDefault');
  expect(runtimeErrors).toEqual([]);
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
