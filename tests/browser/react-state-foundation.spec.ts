import { expect, test } from '@playwright/test';

const route = '/react-state-foundation';

test('serves hydration-stable state and ID markup from production SSR', async ({ page }) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="react-state-server-probe"');
  expect(markup).toContain('data-hydrated="false"');
  expect(markup).toContain('state-probe-explicit');
  expect(markup).toContain('state-probe-');
});

test('hydrates the local client boundary without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(route);
  await expect(page.getByTestId('react-state-client-probe')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
});

test('composes uncontrolled functional updates and suppresses unchanged requests', async ({
  page,
}) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Increment uncontrolled twice' }).click();
  await expect(page.getByRole('status', { name: 'Uncontrolled value' })).toHaveText('3');
  await expect(page.getByRole('status', { name: 'Uncontrolled change count' })).toHaveText('2');
  await expect(page.getByRole('status', { name: 'Latest uncontrolled change' })).toHaveText('3');

  await page.getByRole('button', { name: 'Request unchanged uncontrolled' }).click();
  await expect(page.getByRole('status', { name: 'Uncontrolled change count' })).toHaveText('2');
});

test('keeps controlled state owner-driven while emitting the requested value', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Request controlled increment' }).click();
  await expect(page.getByRole('status', { name: 'Controlled value', exact: true })).toHaveText('5');
  await expect(
    page.getByRole('status', { name: 'Requested controlled value', exact: true }),
  ).toHaveText('6');
});

test('keeps callback identity stable while invoking the latest committed callback', async ({
  page,
}) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Update callback version' }).click();
  await expect(page.getByRole('status', { name: 'Callback identity stable' })).toHaveText('true');
  await page.getByRole('button', { name: 'Invoke committed callback' }).click();
  await expect(page.getByRole('status', { name: 'Callback result' })).toHaveText('Version 2');
});

test('preserves generated IDs through hydration and explicit IDs byte-for-byte', async ({
  page,
}) => {
  const response = await page.request.get(route);
  const markup = await response.text();
  const generatedMatch =
    markup.match(/data-testid="generated-id-probe"[^>]*id="([^"]+)"/u) ??
    markup.match(/id="([^"]+)"[^>]*data-testid="generated-id-probe"/u);
  const generatedId = generatedMatch?.[1];
  expect(generatedId).toBeTruthy();
  if (generatedId === undefined) throw new Error('server-generated ID evidence is missing');

  await page.goto(route);
  await expect(page.getByTestId('generated-id-probe')).toHaveAttribute('id', generatedId);
  await expect(page.getByTestId('explicit-id-probe')).toHaveAttribute('id', 'state-probe-explicit');
  await expect(page.getByLabel('Generated identifier')).toBeVisible();
});
