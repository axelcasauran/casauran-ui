import { expect, test } from '@playwright/test';

const route = '/data-engine';

test('imports the data package in production SSR without a client boundary', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="data-server-probe"');
  expect(markup).toContain('server-safe package import from SSR.');
  await page.goto(route);
  await expect(page.getByRole('region', { name: 'Data engine server result' })).toBeVisible();
});

test('renders the deterministic filter sort aggregate page and group projection', async ({
  page,
}) => {
  await page.goto(route);
  await expect(page.getByTestId('data-total')).toHaveText('5');
  await expect(page.getByTestId('data-sum')).toHaveText('410');
  await expect(page.getByTestId('data-projection')).toHaveText(
    '[{"region":"APAC","ids":[3,6],"sum":155},{"region":"EMEA","ids":[5],"sum":95}]',
  );
});

test('keeps the provider-neutral data state serializable', async ({ page }) => {
  await page.goto(route);
  const serialized = await page.getByTestId('data-state').textContent();
  expect(serialized).not.toBeNull();
  expect(JSON.parse(serialized ?? '{}')).toEqual({
    filter: { field: 'active', operator: 'eq', value: true },
    sort: [{ field: 'score', direction: 'desc' }],
    group: [{ field: 'region', aggregates: [{ field: 'score', aggregate: 'sum' }] }],
    aggregates: [{ field: 'score', aggregate: 'sum' }],
    page: { skip: 1, take: 3 },
  });
});
