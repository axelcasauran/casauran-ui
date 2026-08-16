import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

const route = '/svg-icon';

interface CoverageRule {
  readonly mode: string;
  readonly attribute?: string;
  readonly values?: readonly string[];
}

const registry = JSON.parse(readFileSync('registry/components/svg-icon.json', 'utf8')) as {
  readonly featureCoverage: Record<string, CoverageRule>;
};

test('serves deterministic SVGIcon markup from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="svg-icon-server-probe"');
  expect(markup).toContain('data-csn-component="svg-icon"');
  // No component client boundary: caller-owned artwork is in the server response, not added later.
  expect(markup).toContain('data-icon-name="bolt"');
  expect(markup).toContain('<path');
  // The drawing is data, so no markup from a definition can ever reach the document as elements.
  expect(markup).not.toContain('<script>x()');
});

test('keeps decorative, labelled and blank-label semantics distinct', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('img', { name: 'Signal strength' })).toBeVisible();
  await expect(page.getByTestId('decorative-svg-icon')).toHaveAttribute('aria-hidden', 'true');
  // A whitespace-only label names nothing, so it must not publish an unnamed image.
  await expect(page.getByTestId('blank-label-svg-icon')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByTestId('blank-label-svg-icon')).not.toHaveAttribute('role', 'img');
  // The nested SVG is hidden and unfocusable in every mode, including the labelled one.
  const nested = page.getByTestId('labelled-svg-icon').locator('svg');
  await expect(nested).toHaveAttribute('aria-hidden', 'true');
  await expect(nested).toHaveAttribute('focusable', 'false');
});

test('fails closed for a definition that did not survive validation', async ({ page }) => {
  await page.goto(route);
  const invalid = page.getByTestId('invalid-svg-icon');
  await expect(invalid).toHaveCount(1);
  await expect(invalid.locator('svg')).toHaveCount(0);
  await expect(invalid).not.toHaveAttribute('data-icon-name');
  await expect(invalid).toHaveAttribute('aria-hidden', 'true');
});

test('renders every declared size, tone, flip and variant value from the registry', async ({
  page,
}) => {
  await page.goto(route);
  for (const [feature, rule] of Object.entries(registry.featureCoverage)) {
    if (rule.mode !== 'preview' || rule.attribute === undefined || rule.values === undefined) {
      continue;
    }
    for (const value of rule.values) {
      const rendered = page.locator(`.csn-svg-icon[${rule.attribute}="${value}"]`).first();
      await expect(rendered, `${feature}=${value} must render`).toBeVisible();
    }
  }
});

test('resolves a square box that grows monotonically across the size scale', async ({ page }) => {
  await page.goto(route);
  const scale = page.getByTestId('svg-icon-size-scale').locator('.csn-svg-icon');
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

  // The default tone must follow its context, not the theme's primary text colour.
  const inherited = await colourOf('[data-testid="svg-icon-inherit-probe"]');
  const context = await page
    .getByTestId('svg-icon-inherit-sample')
    .evaluate((element) => getComputedStyle(element).color);
  expect(inherited).toBe(context);

  // Composed into a solid Button, the artwork must take that control's foreground.
  const composed = await colourOf('.csn-button[data-tone="accent"] .csn-svg-icon');
  const label = await page
    .locator('.csn-button[data-tone="accent"]')
    .first()
    .evaluate((element) => getComputedStyle(element).color);
  expect(composed).toBe(label);

  const tones = await Promise.all(
    ['accent', 'muted', 'positive', 'caution', 'critical'].map((tone) =>
      colourOf(`[data-testid="svg-icon-tone-scale"] .csn-svg-icon[data-tone="${tone}"]`),
    ),
  );
  expect(new Set(tones).size).toBe(tones.length);
});

test('applies the component token seam to explicit tones and sizes alike', async ({ page }) => {
  await page.goto(route);
  const overridden = await page
    .locator('.svg-icon-probe__override')
    .evaluate((element) => getComputedStyle(element).color);
  const plain = await page
    .locator('[data-testid="svg-icon-tone-scale"] .csn-svg-icon[data-tone="inherit"]')
    .evaluate((element) => getComputedStyle(element).color);
  expect(overridden).not.toBe(plain);

  // The same override written in the overrides layer must also beat an explicit tone.
  const seamed = await page
    .locator('[data-testid="svg-icon-seam-probe"] .csn-svg-icon')
    .evaluate((element) => getComputedStyle(element).color);
  const accent = await page
    .locator('[data-testid="svg-icon-tone-scale"] .csn-svg-icon[data-tone="accent"]')
    .evaluate((element) => getComputedStyle(element).color);
  expect(seamed).not.toBe(accent);
});

test('mirrors only where flip asks for it and inherits direction otherwise', async ({ page }) => {
  await page.goto(route);
  const transformOf = (flip: string) =>
    page
      .locator(`[data-testid="svg-icon-flip-scale"] .csn-svg-icon[data-flip="${flip}"]`)
      .evaluate((element) => getComputedStyle(element).transform);

  expect(await transformOf('none')).toBe('none');
  expect(await transformOf('horizontal')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  expect(await transformOf('vertical')).toBe('matrix(1, 0, 0, -1, 0, 0)');
  expect(await transformOf('both')).toBe('matrix(-1, 0, 0, -1, 0, 0)');

  // Direction is inherited from the ambient dir; artwork is not mirrored automatically.
  const rtl = page.getByTestId('svg-icon-rtl-probe');
  await expect(rtl).toBeVisible();
  expect(await rtl.evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  expect(await rtl.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
});

test('selects each governed variant and reports a fallback', async ({ page }) => {
  await page.goto(route);
  const scale = page.getByTestId('svg-icon-variant-scale');

  // Each variant is a different drawing, not a restyle of one drawing.
  const solidPaths = await scale.locator('[data-variant="solid"] path').count();
  const duotonePaths = await scale.locator('[data-variant="duotone"] path').count();
  expect(solidPaths).toBe(1);
  expect(duotonePaths).toBe(2);
  await expect(scale.locator('[data-variant="solid"] path')).toHaveAttribute('data-paint', 'fill');
  await expect(scale.locator('[data-variant="outline"] path')).toHaveAttribute(
    'data-paint',
    'stroke',
  );

  // A variant the definition does not ship falls back, and says so rather than failing silently.
  const fallback = page.getByTestId('svg-icon-variant-fallback').locator('.csn-svg-icon');
  await expect(fallback.nth(0)).toHaveAttribute('data-variant', 'solid');
  await expect(fallback.nth(1)).toHaveAttribute('data-variant', 'default');
  await expect(fallback.nth(1)).toBeVisible();
});

test('renders a catalog definition identically through both icon components', async ({ page }) => {
  await page.goto(route);
  const geometryOf = (testId: string) =>
    page
      .getByTestId(testId)
      .locator('path')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('d')));

  expect(await geometryOf('svg-icon-catalog')).toEqual(await geometryOf('svg-icon-catalog-peer'));

  const box = await page.getByTestId('svg-icon-catalog').boundingBox();
  const peer = await page.getByTestId('svg-icon-catalog-peer').boundingBox();
  expect(box?.width).toBe(peer?.width);
  expect(box?.height).toBe(peer?.height);
});

test('paints a filled layer without also stroking it', async ({ page }) => {
  await page.goto(route);
  const filled = page.getByTestId('svg-icon-filled').locator('path[data-paint="fill"]');
  await expect(filled).toHaveAttribute('fill', 'currentColor');
  await expect(filled).toHaveAttribute('stroke', 'none');
  await expect(filled).toHaveAttribute('fill-rule', 'evenodd');
});

test('keeps a labelled drawing exposed and flattens layer opacity in forced colors', async ({
  browserName,
  page,
}) => {
  await page.goto(route);
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByTestId('labelled-svg-icon')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Signal strength' })).toBeVisible();
  const forced = await page
    .getByTestId('labelled-svg-icon')
    .evaluate((element) => getComputedStyle(element).forcedColorAdjust);
  expect(forced).toBe('auto');

  // A receded duotone layer must not disappear against a collapsed two-colour palette.
  const receded = page
    .getByTestId('svg-icon-variant-scale')
    .locator('[data-variant="duotone"] path')
    .first();
  expect(await receded.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
});

test('renders a receded duotone layer below full opacity outside forced colors', async ({
  page,
}) => {
  await page.goto(route);
  const receded = page
    .getByTestId('svg-icon-variant-scale')
    .locator('[data-variant="duotone"] path')
    .first();
  const opacity = await receded.evaluate((element) => Number(getComputedStyle(element).opacity));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
});

test('reflows at a narrow viewport without clipping the matrix', async ({ page }) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await page.goto(route);
  await expect(page.getByTestId('svg-icon-visual-matrix')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('composes into Button slots and icon-only geometry', async ({ page }) => {
  await page.goto(route);
  const panel = page.getByTestId('svg-icon-composition-panel');

  await expect(panel.getByRole('button', { name: 'Run now' })).toBeVisible();
  const iconOnly = panel.getByRole('button', { name: 'Dismiss alert' });
  await expect(iconOnly).toBeVisible();
  // Icon-only actions stay square, and the artwork inside stays decorative.
  const box = await iconOnly.boundingBox();
  expect(Math.abs((box?.width ?? 0) - (box?.height ?? 0))).toBeLessThanOrEqual(1);
  await expect(iconOnly.locator('.csn-svg-icon')).toHaveAttribute('aria-hidden', 'true');
});

test('renders the deterministic SVGIcon theme matrix', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByTestId('svg-icon-visual-matrix')).toHaveScreenshot('svg-icon-matrix.png');
});
