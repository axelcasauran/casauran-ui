import { expect, test } from '@playwright/test';

test.describe('drag-drop foundation', () => {
  test('renders deterministic session and collision state through production SSR', async ({
    page,
    request,
  }) => {
    const response = await request.get('/drag-drop');
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain('server-safe package import from production SSR.');
    expect(html).toContain('server-target');

    await page.goto('/drag-drop');
    await expect(page.getByTestId('drag-drop-server-probe')).toContainText('production SSR');
    await expect(page.getByTestId('drag-drop-server-target')).toHaveText('server-target');
    await expect(page.getByTestId('drag-drop-server-completion')).toHaveText('dropped');
  });

  test('uses primary pointer capture, threshold activation, target resolution, and drop', async ({
    page,
  }) => {
    await page.goto('/drag-drop');
    const source = page.getByTestId('drag-source');
    const target = page.getByTestId('drag-drop-zone');
    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();
    expect(sourceBox).not.toBeNull();
    expect(targetBox).not.toBeNull();
    if (sourceBox === null || targetBox === null) return;
    const start = { x: sourceBox.x + sourceBox.width / 2, y: sourceBox.y + sourceBox.height / 2 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 2, start.y + 2);
    await expect(page.getByTestId('drag-phase')).toHaveText('pending');
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
    await expect(page.getByTestId('drag-phase')).toHaveText('dragging');
    await expect(page.getByTestId('drag-target')).toHaveText('drop-zone');
    await page.mouse.up();
    await expect(page.getByTestId('drag-completion')).toHaveText('pointer:drop-zone');
  });

  test('supports a keyboard alternative for drop and explicit cancellation', async ({ page }) => {
    await page.goto('/drag-drop');
    const source = page.getByTestId('drag-source');
    await source.focus();
    await source.press('Space');
    await expect(page.getByTestId('drag-phase')).toHaveText('dragging');
    await source.press('ArrowRight');
    await source.press('ArrowRight');
    await source.press('ArrowRight');
    await expect(page.getByTestId('drag-target')).toHaveText('drop-zone');
    await source.press('Enter');
    await expect(page.getByTestId('drag-completion')).toHaveText('keyboard:drop-zone');

    await source.press('Space');
    await source.press('Escape');
    await expect(page.getByTestId('drag-completion')).toHaveText('keyboard:cancelled');
    await expect(source).toBeFocused();
  });

  test('receives touch Pointer Events without a mouse-only path', async ({ page }) => {
    await page.goto('/drag-drop');
    await page.getByTestId('drag-touch-probe').evaluate((element) => {
      element.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          pointerId: 41,
          pointerType: 'touch',
          isPrimary: true,
          button: 0,
        }),
      );
    });
    await expect(page.getByTestId('drag-touch-type')).toHaveText('touch');
  });

  test('performs bounded edge autoscroll and cleans up the active capture lifecycle', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto('/drag-drop');
    const sourceBox = await page.getByTestId('drag-source').boundingBox();
    const viewportBox = await page.getByTestId('drag-scroll-viewport').boundingBox();
    expect(sourceBox).not.toBeNull();
    expect(viewportBox).not.toBeNull();
    if (sourceBox === null || viewportBox === null) return;
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      viewportBox.x + viewportBox.width / 2,
      viewportBox.y + viewportBox.height - 2,
    );
    await expect
      .poll(async () => Number(await page.getByTestId('drag-scroll-top').textContent()))
      .toBeGreaterThan(0);
    await page.mouse.up();
    await page.goto('/');
    expect(pageErrors).toEqual([]);
  });
});
