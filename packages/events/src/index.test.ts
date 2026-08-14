import { describe, expect, it, vi } from 'vitest';

import { composeEventHandlers } from './index.js';

describe('composeEventHandlers', () => {
  it('runs consumer intent before owner behavior', () => {
    const order: string[] = [];
    const handler = composeEventHandlers(
      () => order.push('consumer'),
      () => order.push('owner'),
    );

    handler({ defaultPrevented: false });
    expect(order).toEqual(['consumer', 'owner']);
  });

  it('honors consumer cancellation', () => {
    const owner = vi.fn();
    const event = { defaultPrevented: false };
    const handler = composeEventHandlers(() => {
      event.defaultPrevented = true;
    }, owner);

    handler(event);
    expect(owner).not.toHaveBeenCalled();
  });
});
