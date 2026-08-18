import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

const route = '/label';

interface CoverageRule {
  readonly mode: string;
  readonly attribute?: string;
  readonly values?: readonly string[];
}

const registry = JSON.parse(readFileSync('registry/components/label.json', 'utf8')) as {
  readonly featureCoverage: Record<string, CoverageRule>;
};

const numeric = (value: string) => Number.parseFloat(value);

test('serves deterministic Label markup from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();

  expect(markup).toContain('data-testid="label-server-probe"');
  expect(markup).toContain('data-csn-component="label"');
  // No component client boundary: the caption and its association are in the server response.
  expect(markup).toContain('for="probe-email"');
  expect(markup).toContain('Email address');
  expect(markup).toContain('data-requirement="required"');
  // A caption from an untrusted source is escaped by React, never rendered as elements.
  expect(markup).toContain('&lt;img');
  expect(markup).not.toContain('<img src=x');
});

test('renders every declared enumerated value from the registry', async ({ page }) => {
  await page.goto(route);
  for (const [feature, rule] of Object.entries(registry.featureCoverage)) {
    if (rule.mode !== 'preview' || rule.attribute === undefined || rule.values === undefined) {
      continue;
    }
    for (const value of rule.values) {
      const rendered = page.locator(`.csn-label[${rule.attribute}="${value}"]`).first();
      await expect(rendered, `${feature}=${value} must render`).toBeAttached();
    }
  }
});

test('names a text field, a checkbox and a radio through the native association', async ({
  page,
}) => {
  await page.goto(route);

  // The browser derives each control's accessible name from its associated caption.
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Accept the terms' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Contact me by post' })).toBeVisible();
});

test('forwards a native click from the caption to its control', async ({ page }) => {
  await page.goto(route);

  // Clicking the caption focuses the text field, with no component JavaScript involved.
  await page.getByText('Email address', { exact: true }).click();
  await expect(page.getByTestId('label-email-editor')).toBeFocused();

  // And toggles a checkbox, which is also what enlarges its effective activation area.
  const checkbox = page.getByTestId('label-checkbox-editor');
  await expect(checkbox).not.toBeChecked();
  await page.getByTestId('label-checkbox-caption').click();
  await expect(checkbox).toBeChecked();
});

test('names an editor that renders no native control through aria-labelledby', async ({ page }) => {
  await page.goto(route);
  const widget = page.getByTestId('label-widget-editor');

  await expect(widget).toHaveAttribute('aria-labelledby', 'probe-size-label');
  await expect(page.getByRole('combobox', { name: 'Shirt size' })).toBeVisible();
  // The caption publishes an identifier and no association attribute on this path.
  const caption = page.getByTestId('label-widget-caption');
  await expect(caption).toHaveAttribute('id', 'probe-size-label');
  await expect(caption).not.toHaveAttribute('for');
});

test('makes the requirement marker part of the accessible name', async ({ page }) => {
  await page.goto(route);

  // The marker is announced with the caption, which is why it must be a word and not a glyph.
  await expect(page.getByRole('textbox', { name: 'Full name (required)' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Nickname (optional)' })).toBeVisible();

  // It is a convention, not the mechanism: the editor still carries the native requirement.
  await expect(page.locator('#probe-name')).toHaveAttribute('required', '');
  await expect(page.locator('#probe-name')).toHaveAttribute('aria-required', 'true');
});

test('resolves distinct colours for the default, invalid and disabled states', async ({ page }) => {
  await page.goto(route);
  const colourOf = (testId: string) =>
    page.getByTestId(testId).evaluate((element) => getComputedStyle(element).color);

  const base = await colourOf('label-default-state');
  const invalid = await colourOf('label-invalid-state');
  const disabled = await colourOf('label-disabled-state');

  expect(invalid).not.toBe(base);
  expect(disabled).not.toBe(base);
  expect(disabled).not.toBe(invalid);

  // A disabled caption is dimmed and shows the not-allowed cursor.
  const dimmed = await page.getByTestId('label-disabled-state').evaluate((element) => ({
    cursor: getComputedStyle(element).cursor,
    opacity: Number(getComputedStyle(element).opacity),
  }));
  expect(dimmed.opacity).toBeLessThan(1);
  expect(dimmed.cursor).toBe('not-allowed');
});

test('gives disabled presentation precedence while reflecting both states', async ({ page }) => {
  await page.goto(route);
  const both = page.getByTestId('label-both-states');

  await expect(both).toHaveAttribute('data-invalid', 'true');
  await expect(both).toHaveAttribute('data-disabled', 'true');

  // An editor the user cannot change is not presented as a problem to fix.
  const bothColour = await both.evaluate((element) => getComputedStyle(element).color);
  const disabledColour = await page
    .getByTestId('label-disabled-state')
    .evaluate((element) => getComputedStyle(element).color);
  const invalidColour = await page
    .getByTestId('label-invalid-state')
    .evaluate((element) => getComputedStyle(element).color);
  expect(bothColour).toBe(disabledColour);
  expect(bothColour).not.toBe(invalidColour);
});

test('holds one line of height for a deliberately empty caption', async ({ page }) => {
  await page.goto(route);
  const empty = page.getByTestId('label-empty-caption');

  await expect(empty).toHaveAttribute('data-empty', 'true');
  expect(await empty.textContent()).toBe('');
  const box = await empty.boundingBox();
  const lineHeight = await empty.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).lineHeight),
  );
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(lineHeight - 1);
});

test('applies the component token seam over a state colour', async ({ page }) => {
  await page.goto(route);
  const overridden = await page.getByTestId('label-override').evaluate((element) => ({
    colour: getComputedStyle(element).color,
    size: getComputedStyle(element).fontSize,
  }));
  const invalid = await page.getByTestId('label-invalid-state').evaluate((element) => ({
    colour: getComputedStyle(element).color,
    size: getComputedStyle(element).fontSize,
  }));

  // The override is written in the `overrides` layer, so it beats the invalid state's own colour.
  expect(overridden.colour).not.toBe(invalid.colour);
  expect(numeric(overridden.size)).toBeGreaterThan(numeric(invalid.size));
});

test('inherits direction and keeps the marker on the reading side', async ({ page }) => {
  await page.goto(route);
  const caption = page.getByTestId('label-rtl-caption');
  expect(await caption.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');

  const marker = caption.locator('.csn-label__requirement');
  const gap = await marker.evaluate((element) => {
    const style = getComputedStyle(element);
    return { left: style.marginLeft, right: style.marginRight };
  });
  // The gap is a logical inline margin, so in RTL it resolves to the right edge of the marker.
  expect(numeric(gap.right)).toBeGreaterThan(0);
  expect(numeric(gap.left)).toBe(0);

  const ltrGap = await page
    .getByTestId('label-required-caption')
    .locator('.csn-label__requirement')
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return { left: style.marginLeft, right: style.marginRight };
    });
  expect(numeric(ltrGap.left)).toBeGreaterThan(0);
  expect(numeric(ltrGap.right)).toBe(0);
});

test('renders composed caption content and untrusted text as text', async ({ page }) => {
  await page.goto(route);

  const composed = page.getByTestId('label-composed');
  await expect(composed.locator('.csn-typography')).toHaveCount(1);
  // A composed fragment is still part of the control's accessible name.
  await expect(page.getByRole('textbox', { name: 'Product code SKU-000' })).toBeVisible();

  const untrusted = page.getByTestId('label-untrusted');
  await expect(untrusted.locator('img')).toHaveCount(0);
  expect(await untrusted.textContent()).toContain('<img');
});

test('separates the disabled caption in forced colors', async ({ browserName, page }) => {
  await page.goto(route);
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
  await page.emulateMedia({ forcedColors: 'active' });

  const colourOf = (testId: string) =>
    page.getByTestId(testId).evaluate((element) => getComputedStyle(element).color);

  // Colour carries no information here, which is why invalid must never be signalled by it alone.
  expect(await colourOf('label-invalid-state')).toBe(await colourOf('label-default-state'));
  // A system grey is available for disabled, so that distinction survives.
  expect(await colourOf('label-disabled-state')).not.toBe(await colourOf('label-default-state'));
  expect(
    await page
      .getByTestId('label-disabled-state')
      .evaluate((element) => Number(getComputedStyle(element).opacity)),
  ).toBe(1);
});

test('scales the caption with a user font-size preference', async ({ page }) => {
  await page.goto(route);
  const measure = () =>
    page
      .getByTestId('label-default-state')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));

  const base = await measure();
  await page.addStyleTag({ content: 'html { font-size: 24px; }' });
  expect(await measure()).toBeGreaterThan(base);
});

test('reflows at a narrow viewport with a long caption', async ({ page }) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await page.goto(route);
  await expect(page.getByTestId('label-visual-matrix')).toBeVisible();

  // A long caption wraps onto several lines and keeps its marker in the text flow.
  const lines = await page.getByTestId('label-long-caption').evaluate((element) => {
    const style = getComputedStyle(element);
    return element.getBoundingClientRect().height / Number.parseFloat(style.lineHeight);
  });
  expect(lines).toBeGreaterThan(1);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('renders the deterministic Label theme matrix', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByTestId('label-visual-matrix')).toHaveScreenshot('label-matrix.png');
});
