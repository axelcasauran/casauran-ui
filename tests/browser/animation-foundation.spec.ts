import { expect, test } from '@playwright/test';

const route = '/animation-foundation';

test('imports the animation package in production SSR and hydrates without errors', async ({
  page,
}) => {
  const response = await page.request.get(route);
  expect(response.ok()).toBe(true);
  const markup = await response.text();
  expect(markup).toContain('data-testid="animation-server-probe"');
  expect(markup).toContain('data-duration="120"');
  expect(markup).toContain('data-phase="entering"');
  expect(markup).toContain('server-safe package import from SSR.');

  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(route);
  await expect(page.getByRole('region', { name: 'Animation lifecycle probe' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('finishes token-resolved WAAPI playback in its final state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);
  await page.getByRole('button', { name: 'Play motion' }).click();
  await expect(page.getByTestId('playback-status')).toHaveText('finished');
  await expect(page.getByTestId('motion-target')).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 24, 0)',
  );
});

test('observes reducedMotion changes and finishes without delay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  await expect(page.getByTestId('reduced-motion')).toHaveText('true');
  await page.getByRole('button', { name: 'Play motion' }).click();
  await expect(page.getByTestId('playback-status')).toHaveText('finished');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByTestId('reduced-motion')).toHaveText('false');
});

test('settles AbortSignal cancellation deterministically', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Start abortable motion' }).click();
  await expect(page.getByTestId('playback-status')).toHaveText('running');
  await page.getByRole('button', { name: 'Abort motion' }).click();
  await expect(page.getByTestId('playback-status')).toHaveText('cancelled');
});

test('keeps interrupted replacement cleanup token-safe', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Interrupt motion' }).click();
  await expect(page.getByTestId('interruption-status')).toHaveText('cancelled:finished:0');
});

test('ignores stale presence completion revisions', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Exercise presence revisions' }).click();
  await expect(page.getByTestId('presence-status')).toHaveText('exiting:2|unmounted:2');
});
