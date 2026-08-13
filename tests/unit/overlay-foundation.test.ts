import { describe, expect, it } from 'vitest';

import {
  createDismissableLayerManager,
  createFocusScopeManager,
  createModalIsolationManager,
  createOverlayLayerStack,
  createPortalHost,
  synchronizePortalScope,
} from '../../packages/overlay/src/index.js';

describe('overlay layer stack', () => {
  it('preserves order through replacement and uses token-aware cleanup', () => {
    const stack = createOverlayLayerStack<string, { readonly label: string }>();
    const removeOld = stack.register('parent', { label: 'old' });
    stack.register('child', { label: 'child' });
    const removeNew = stack.register('parent', { label: 'new' });
    removeOld();
    expect(stack.keys).toEqual(['parent', 'child']);
    expect(stack.get('parent')?.label).toBe('new');
    expect(stack.top).toEqual({ key: 'child', value: { label: 'child' } });
    removeNew();
    expect(stack.keys).toEqual(['child']);
  });

  it('supports explicit unregister and clear', () => {
    const stack = createOverlayLayerStack<number, string>();
    stack.register(1, 'first');
    stack.register(2, 'second');
    expect(stack.unregister(1)).toBe(true);
    expect(stack.unregister(1)).toBe(false);
    expect(stack.top?.key).toBe(2);
    stack.clear();
    expect(stack.size).toBe(0);
    expect(stack.top).toBeNull();
  });

  it('preserves deterministic order for 1000 nested layer registrations', () => {
    const stack = createOverlayLayerStack<number, number>();
    const cleanups = Array.from({ length: 1000 }, (_, index) => stack.register(index, index));
    expect(stack.size).toBe(1000);
    expect(stack.top?.key).toBe(999);
    for (let index = cleanups.length - 1; index >= 0; index -= 1) cleanups[index]?.();
    expect(stack.size).toBe(0);
  });
});

describe('overlay server-safe module surface', () => {
  it('exports browser factories without reading a global document at module evaluation', () => {
    expect(globalThis.document).toBeUndefined();
    expect(createPortalHost).toBeTypeOf('function');
    expect(synchronizePortalScope).toBeTypeOf('function');
    expect(createDismissableLayerManager).toBeTypeOf('function');
    expect(createFocusScopeManager).toBeTypeOf('function');
    expect(createModalIsolationManager).toBeTypeOf('function');
  });
});
