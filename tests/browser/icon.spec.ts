import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

const route = '/icon';

interface CoverageRule {
  readonly mode: string;
  readonly attribute?: string;
  readonly values?: readonly string[];
}

const registry = JSON.parse(readFileSync('registry/components/icon.json', 'utf8')) as {
  readonly featureCoverage: Record<string, CoverageRule>;
};

test('serves deterministic Icon markup from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="icon-server-probe"');
  expect(markup).toContain('data-csn-component="icon"');
  expect(markup).toContain('<svg');
  // No component client boundary: the glyph is present in the server response, not added later.
  expect(markup).toContain('data-icon-name="home"');
});

test('keeps decorative, labelled and blank-label icon semantics distinct', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('img', { name: 'Search records' })).toBeVisible();
  await expect(page.getByTestId('decorative-icon')).toHaveAttribute('aria-hidden', 'true');
  // A whitespace-only label names nothing, so it must not publish an unnamed image.
  await expect(page.getByTestId('blank-label-icon')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByTestId('blank-label-icon')).not.toHaveAttribute('role', 'img');
  await expect(page.getByTestId('unknown-icon').locator('svg')).toHaveCount(0);
  // The nested SVG is hidden and unfocusable in every mode, including the labelled one.
  const nested = page.getByTestId('labelled-icon').locator('svg');
  await expect(nested).toHaveAttribute('aria-hidden', 'true');
  await expect(nested).toHaveAttribute('focusable', 'false');
});

test('renders every declared size, tone and flip value from the registry', async ({ page }) => {
  await page.goto(route);
  for (const [feature, rule] of Object.entries(registry.featureCoverage)) {
    if (rule.mode !== 'preview' || rule.attribute === undefined || rule.values === undefined) {
      continue;
    }
    for (const value of rule.values) {
      const rendered = page.locator(`.csn-icon[${rule.attribute}="${value}"]`).first();
      await expect(rendered, `${feature}=${value} must render`).toBeVisible();
    }
  }
});

test('resolves a square box that grows monotonically across the size scale', async ({ page }) => {
  await page.goto(route);
  const scale = page.getByTestId('icon-size-scale').locator('.csn-icon');
  const count = await scale.count();
  expect(count).toBe(7);

  let previous = 0;
  for (let index = 0; index < count; index += 1) {
    const box = await scale.nth(index).boundingBox();
    expect(box).not.toBeNull();
    const { height, width } = box ?? { height: 0, width: 0 };
    expect(Math.abs(width - height), 'icons are square on both axes').toBeLessThanOrEqual(1);
    expect(width).toBeGreaterThan(previous);
    previous = width;
  }
});

test('paints the surrounding colour for the inherit tone and distinct colours per tone', async ({
  page,
}) => {
  await page.goto(route);
  const colourOf = (selector: string) =>
    page
      .locator(selector)
      .first()
      .evaluate((element) => getComputedStyle(element).color);

  // The default tone must follow its context, not the theme's primary text colour. A composed icon
  // that ignored this rendered dark artwork on a solid accent control.
  const inherited = await colourOf('[data-testid="icon-inherit-probe"]');
  const context = await page
    .getByTestId('icon-inherit-sample')
    .evaluate((element) => getComputedStyle(element).color);
  expect(inherited).toBe(context);

  const composed = await colourOf('.csn-button[data-tone="accent"] .csn-icon');
  const label = await page
    .locator('.csn-button[data-tone="accent"]')
    .first()
    .evaluate((element) => getComputedStyle(element).color);
  expect(composed).toBe(label);

  const tones = await Promise.all(
    ['accent', 'muted', 'positive', 'caution', 'critical'].map((tone) =>
      colourOf(`[data-testid="icon-tone-scale"] .csn-icon[data-tone="${tone}"]`),
    ),
  );
  expect(new Set(tones).size).toBe(tones.length);
});

test('applies the component token seam to explicit tones and sizes alike', async ({ page }) => {
  await page.goto(route);
  const overridden = await page
    .locator('.icon-probe__override')
    .evaluate((element) => getComputedStyle(element).color);
  const plain = await page
    .locator('[data-testid="icon-tone-scale"] .csn-icon[data-tone="inherit"]')
    .evaluate((element) => getComputedStyle(element).color);
  expect(overridden).not.toBe(plain);

  // The same override written in the overrides layer must also beat an explicit tone.
  const seamed = await page
    .locator('[data-testid="icon-seam-probe"] .csn-icon')
    .evaluate((element) => getComputedStyle(element).color);
  const accent = await page
    .locator('[data-testid="icon-tone-scale"] .csn-icon[data-tone="accent"]')
    .evaluate((element) => getComputedStyle(element).color);
  expect(seamed).not.toBe(accent);
});

test('mirrors only where flip asks for it and inherits direction otherwise', async ({ page }) => {
  await page.goto(route);
  const transformOf = (flip: string) =>
    page
      .locator(`[data-testid="icon-flip-scale"] .csn-icon[data-flip="${flip}"]`)
      .evaluate((element) => getComputedStyle(element).transform);

  expect(await transformOf('none')).toBe('none');
  expect(await transformOf('horizontal')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  expect(await transformOf('vertical')).toBe('matrix(1, 0, 0, -1, 0, 0)');
  expect(await transformOf('both')).toBe('matrix(-1, 0, 0, -1, 0, 0)');

  // Direction is inherited from the ambient dir; artwork is not mirrored automatically.
  const rtlIcon = page.locator('[dir="rtl"] [data-icon-name="search"]');
  await expect(rtlIcon).toBeVisible();
  expect(await rtlIcon.evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  expect(await rtlIcon.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
});

test('keeps a labelled icon exposed and visible in forced colors', async ({
  browserName,
  page,
}) => {
  await page.goto(route);
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('labelled-icon')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Search records' })).toBeVisible();
  const forced = await page
    .getByTestId('labelled-icon')
    .evaluate((element) => getComputedStyle(element).forcedColorAdjust);
  expect(forced).toBe('auto');
});

test('reflows at a narrow viewport without clipping the matrix', async ({ page }) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await page.goto(route);
  await expect(page.getByTestId('icon-visual-matrix')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('renders the deterministic Icon theme matrix', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByTestId('icon-visual-matrix')).toHaveScreenshot('icon-matrix.png');
});
