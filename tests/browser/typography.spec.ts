import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

const route = '/typography';

interface CoverageRule {
  readonly mode: string;
  readonly attribute?: string;
  readonly values?: readonly string[];
}

const registry = JSON.parse(readFileSync('registry/components/typography.json', 'utf8')) as {
  readonly featureCoverage: Record<string, CoverageRule>;
};

const numeric = (value: string) => Number.parseFloat(value);

test('serves deterministic Typography markup from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();

  expect(markup).toContain('data-testid="typography-server-probe"');
  expect(markup).toContain('data-csn-component="typography"');
  // No component client boundary: the text is in the server response, not added after hydration.
  expect(markup).toContain('Quarterly revenue');
  expect(markup).toContain('data-variant="display"');
  // Content is escaped by React; a code block can never become markup.
  expect(markup).toContain('&lt;script&gt;');
  expect(markup).not.toContain('<script>alert("typography")</script>');
});

test('renders every declared enumerated value from the registry', async ({ page }) => {
  await page.goto(route);
  for (const [feature, rule] of Object.entries(registry.featureCoverage)) {
    if (rule.mode !== 'preview' || rule.attribute === undefined || rule.values === undefined) {
      continue;
    }
    for (const value of rule.values) {
      const rendered = page.locator(`.csn-typography[${rule.attribute}="${value}"]`).first();
      await expect(rendered, `${feature}=${value} must render`).toBeAttached();
    }
  }
});

test('resolves a distinct, monotonic size scale', async ({ page }) => {
  await page.goto(route);
  const scale = page.getByTestId('typography-size-scale').locator('.csn-typography');
  const count = await scale.count();
  expect(count).toBe(7);

  let previous = 0;
  for (let index = 0; index < count; index += 1) {
    const size = await scale.nth(index).evaluate((element) => getComputedStyle(element).fontSize);
    expect(numeric(size)).toBeGreaterThan(previous);
    previous = numeric(size);
  }
});

test('gives every typographic role a distinct resolved type step', async ({ page }) => {
  await page.goto(route);
  const ramp = page.getByTestId('typography-variant-ramp').locator('.csn-typography');
  const resolved = await ramp.evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      return `${style.fontSize}/${style.fontWeight}/${style.fontFamily}/${style.lineHeight}`;
    }),
  );
  // Ten roles are previewed here; each must be visually distinguishable from the others.
  expect(resolved).toHaveLength(10);
  expect(new Set(resolved).size).toBe(resolved.length);

  // The two code roles take the monospace family; prose roles do not.
  const code = await page
    .locator('.csn-typography[data-variant="code"]')
    .first()
    .evaluate((element) => getComputedStyle(element).fontFamily);
  const body = await page
    .locator('.csn-typography[data-variant="body"]')
    .first()
    .evaluate((element) => getComputedStyle(element).fontFamily);
  expect(code).not.toBe(body);
  expect(code.toLowerCase()).toContain('mono');
});

test('resolves an increasing weight scale', async ({ page }) => {
  await page.goto(route);
  const weights = await page
    .getByTestId('typography-weight-scale')
    .locator('.csn-typography')
    .evaluateAll((nodes) => nodes.map((node) => Number(getComputedStyle(node).fontWeight)));
  expect(weights).toEqual([400, 500, 600, 700]);
});

test('paints the surrounding colour for the inherit tone and distinct colours per tone', async ({
  page,
}) => {
  await page.goto(route);

  const inherited = await page
    .getByTestId('typography-inherit-probe')
    .evaluate((element) => getComputedStyle(element).color);
  const context = await page
    .getByTestId('typography-inherit-sample')
    .evaluate((element) => getComputedStyle(element).color);
  expect(inherited).toBe(context);

  // Composed into a solid Button, text must take that control's foreground rather than the
  // theme's primary text colour.
  const composed = await page
    .getByTestId('typography-in-button')
    .evaluate((element) => getComputedStyle(element).color);
  const label = await page
    .locator('.csn-button[data-tone="accent"]')
    .first()
    .evaluate((element) => getComputedStyle(element).color);
  expect(composed).toBe(label);

  const tones = await Promise.all(
    ['default', 'muted', 'accent', 'positive', 'caution', 'critical'].map((tone) =>
      page
        .locator(`[data-testid="typography-tone-scale"] .csn-typography[data-tone="${tone}"]`)
        .evaluate((element) => getComputedStyle(element).color),
    ),
  );
  expect(new Set(tones).size).toBe(tones.length);
});

test('applies the component token seam over the value a role assigned', async ({ page }) => {
  await page.goto(route);
  const overridden = await page.locator('.typography-probe__override').evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.color, size: style.fontSize, weight: style.fontWeight };
  });
  const plain = await page
    .locator('.csn-typography[data-variant="caption"]')
    .first()
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return { color: style.color, size: style.fontSize, weight: style.fontWeight };
    });

  // The override is written in the `overrides` layer, so it beats the role's own assignment.
  expect(overridden.color).not.toBe(plain.color);
  expect(numeric(overridden.size)).toBeGreaterThan(numeric(plain.size));
  expect(Number(overridden.weight)).toBeGreaterThan(Number(plain.weight));
});

test('keeps document structure and visual style separate', async ({ page }) => {
  await page.goto(route);

  // A level-two heading carrying display type is still exactly one level-two heading.
  const bigHeading = page.getByTestId('typography-big-heading');
  await expect(bigHeading).toHaveRole('heading');
  expect(await bigHeading.evaluate((element) => element.tagName)).toBe('H2');
  expect(await bigHeading.evaluate((element) => getComputedStyle(element).fontSize)).toBe(
    await page
      .locator('.csn-typography[data-variant="display"]')
      .first()
      .evaluate((element) => getComputedStyle(element).fontSize),
  );

  // A heading set at caption size keeps its level.
  const smallHeading = page.getByTestId('typography-small-heading');
  expect(await smallHeading.evaluate((element) => element.tagName)).toBe('H3');

  // Title type on a paragraph must not become a heading in the accessibility tree.
  const titled = page.getByTestId('typography-titled-paragraph');
  expect(await titled.evaluate((element) => element.tagName)).toBe('P');
  await expect(titled).not.toHaveAttribute('role');
  await expect(titled).not.toHaveAttribute('aria-level');

  // The probe section publishes exactly one heading per real heading element and no more.
  const semantics = page.getByTestId('typography-semantics-probe');
  await expect(semantics.getByRole('heading')).toHaveCount(1);
});

test('applies spacing to the correct logical sides', async ({ page }) => {
  await page.goto(route);
  const boxOf = (testId: string) =>
    page.getByTestId(testId).evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        blockEnd: style.marginBlockEnd,
        blockStart: style.marginBlockStart,
        inlineEnd: style.marginInlineEnd,
        inlineStart: style.marginInlineStart,
      };
    });

  const shorthand = await boxOf('typography-spacing-shorthand');
  expect(numeric(shorthand.blockStart)).toBeGreaterThan(0);
  expect(shorthand.blockStart).toBe(shorthand.blockEnd);
  expect(numeric(shorthand.inlineStart)).toBe(0);
  expect(numeric(shorthand.inlineEnd)).toBe(0);

  const sides = await boxOf('typography-spacing-sides');
  expect(numeric(sides.blockStart)).toBeGreaterThan(numeric(sides.blockEnd));
  expect(numeric(sides.inlineStart)).toBeGreaterThan(0);
  expect(numeric(sides.inlineEnd)).toBe(0);

  // A zero step is a real value: it beats a margin a consumer reset would otherwise supply.
  const none = await boxOf('typography-spacing-none');
  expect(numeric(none.blockStart)).toBe(0);
  expect(numeric(none.blockEnd)).toBe(0);
});

test('renders code as text with its whitespace preserved and its overflow contained', async ({
  page,
}) => {
  await page.goto(route);
  const block = page.getByTestId('typography-code-block');
  expect(await block.evaluate((element) => getComputedStyle(element).whiteSpace)).toBe('pre-wrap');
  expect(await block.textContent()).toContain('.filter((invoice)');
  // The newlines survive as content rather than being collapsed away.
  expect((await block.textContent())?.split('\n').length).toBeGreaterThan(2);

  // Untrusted content is text, never elements.
  const untrusted = page.getByTestId('typography-untrusted');
  await expect(untrusted.locator('script')).toHaveCount(0);
  expect(await untrusted.textContent()).toContain('<script>');

  // A long line scrolls inside its own block instead of widening the page.
  const long = page.getByTestId('typography-code-long');
  const contained = await long.evaluate(
    (element) =>
      element.scrollWidth <= element.clientWidth + 1 ||
      getComputedStyle(element).overflowX !== 'visible',
  );
  expect(contained).toBe(true);
});

test('inherits direction and follows it with logical alignment', async ({ page }) => {
  await page.goto(route);
  const heading = page.getByTestId('typography-rtl-start');
  expect(await heading.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
  // `start` is logical: in an RTL container it resolves to the right edge.
  expect(await heading.evaluate((element) => getComputedStyle(element).textAlign)).toBe('start');

  const rtlBox = await page.getByTestId('typography-rtl-body').boundingBox();
  const quote = page.getByTestId('typography-rtl-quote');
  const border = await quote.evaluate((element) => {
    const style = getComputedStyle(element);
    return { left: style.borderLeftWidth, right: style.borderRightWidth };
  });
  // The quotation rule is on the inline-start edge, which is the right edge in RTL.
  expect(numeric(border.right)).toBeGreaterThan(0);
  expect(numeric(border.left)).toBe(0);
  expect(rtlBox).not.toBeNull();

  const ltrQuote = await page
    .locator('[data-testid="typography-variant-ramp"] .csn-typography[data-variant="quote"]')
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return { left: style.borderLeftWidth, right: style.borderRightWidth };
    });
  expect(numeric(ltrQuote.left)).toBeGreaterThan(0);
  expect(numeric(ltrQuote.right)).toBe(0);
});

test('nests inline roles inside a prose paragraph', async ({ page }) => {
  await page.goto(route);
  const host = page.getByTestId('typography-nested-host');
  expect(await host.evaluate((element) => element.tagName)).toBe('P');
  const nested = page.getByTestId('typography-nested-code');
  expect(await nested.evaluate((element) => element.tagName)).toBe('CODE');
  // A nested element with the default tone takes the colour of the passage around it.
  expect(await nested.evaluate((element) => getComputedStyle(element).color)).toBe(
    await host.evaluate((element) => getComputedStyle(element).color),
  );
});

test('paints a system foreground and keeps the quotation rule in forced colors', async ({
  browserName,
  page,
}) => {
  await page.goto(route);
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
  await page.emulateMedia({ forcedColors: 'active' });

  const critical = page
    .locator('[data-testid="typography-tone-scale"] .csn-typography[data-tone="critical"]')
    .first();
  const muted = page
    .locator('[data-testid="typography-tone-scale"] .csn-typography[data-tone="muted"]')
    .first();
  // Tones collapse to one system colour by design, which is why no tone is the only signal.
  expect(await critical.evaluate((element) => getComputedStyle(element).color)).toBe(
    await muted.evaluate((element) => getComputedStyle(element).color),
  );

  const quote = page.getByTestId('typography-rtl-quote');
  const width = await quote.evaluate((element) => getComputedStyle(element).borderInlineStartWidth);
  expect(numeric(width)).toBeGreaterThan(0);
});

test('scales text with a user font-size preference rather than pinning pixels', async ({
  page,
}) => {
  await page.goto(route);
  const measure = () =>
    page
      .locator('.csn-typography[data-variant="body"]')
      .first()
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));

  const base = await measure();
  await page.addStyleTag({ content: 'html { font-size: 24px; }' });
  const scaled = await measure();
  expect(scaled).toBeGreaterThan(base);
});

test('reflows at a narrow viewport without clipping the matrix', async ({ page }) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await page.goto(route);
  await expect(page.getByTestId('typography-visual-matrix')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('renders the deterministic Typography theme matrix', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByTestId('typography-visual-matrix')).toHaveScreenshot(
    'typography-matrix.png',
  );
});
