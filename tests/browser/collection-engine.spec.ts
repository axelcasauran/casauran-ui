import { expect, test } from '@playwright/test';

const route = '/collection-engine';

test('serves the collection package directly from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="collection-server-probe"');
  expect(markup).toContain('Rendered by a Server Component route.');
});

test('preserves deterministic visible-tree order', async ({ page }) => {
  await page.goto(route);
  await expect(
    page.getByRole('list', { name: 'Visible collection keys' }).getByRole('listitem'),
  ).toHaveText(['projects', 'alpha', 'unavailable', 'beta', 'team']);
});

test('exposes deterministic active, selection, and typeahead projections', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByTestId('active-key')).toHaveText('beta');
  await expect(page.getByTestId('selected-keys')).toHaveText('alpha,beta,team');
  await expect(page.getByTestId('typeahead-match')).toHaveText('team');
});
