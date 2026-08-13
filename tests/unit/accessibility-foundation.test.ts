import { describe, expect, it } from 'vitest';

import {
  createLiveRegionController,
  getDirectionalNavigationIntent,
  getLiveRegionAttributes,
  getRovingTabIndex,
  isActivationKey,
  isDismissKey,
  isKeyboardEventModified,
  moveRovingFocus,
  resolveRovingTabStop,
} from '../../packages/accessibility/src/index.js';

const items = [
  { id: 'alpha' },
  { id: 'unavailable', disabled: true },
  { id: 'beta' },
  { id: 'gamma' },
] as const;

describe('accessibility keyboard primitives', () => {
  it('maps horizontal and vertical keys without claiming pattern behavior', () => {
    expect(
      getDirectionalNavigationIntent(
        { key: 'ArrowRight' },
        { orientation: 'horizontal', direction: 'ltr' },
      ),
    ).toBe('next');
    expect(getDirectionalNavigationIntent({ key: 'ArrowUp' }, { orientation: 'vertical' })).toBe(
      'previous',
    );
    expect(
      getDirectionalNavigationIntent({ key: 'ArrowUp' }, { orientation: 'horizontal' }),
    ).toBeNull();
    expect(getDirectionalNavigationIntent({ key: 'Home' }, { orientation: 'both' })).toBe('first');
  });

  it('reverses horizontal intent for RTL', () => {
    expect(
      getDirectionalNavigationIntent(
        { key: 'ArrowLeft' },
        { orientation: 'horizontal', direction: 'rtl' },
      ),
    ).toBe('next');
    expect(
      getDirectionalNavigationIntent(
        { key: 'ArrowRight' },
        { orientation: 'horizontal', direction: 'rtl' },
      ),
    ).toBe('previous');
  });

  it('ignores command-modified and IME-composing navigation', () => {
    expect(isKeyboardEventModified({ key: 'ArrowRight', ctrlKey: true })).toBe(true);
    expect(
      getDirectionalNavigationIntent(
        { key: 'ArrowRight', metaKey: true },
        { orientation: 'horizontal' },
      ),
    ).toBeNull();
    expect(
      getDirectionalNavigationIntent(
        { key: 'ArrowRight', isComposing: true },
        { orientation: 'horizontal' },
      ),
    ).toBeNull();
  });

  it('keeps activation and dismissal opt-in and composition-safe', () => {
    expect(isActivationKey({ key: 'Enter' })).toBe(true);
    expect(isActivationKey({ key: ' ' })).toBe(true);
    expect(isActivationKey({ key: 'Enter', isComposing: true })).toBe(false);
    expect(isDismissKey({ key: 'Escape' })).toBe(true);
    expect(isDismissKey({ key: 'Escape', altKey: true })).toBe(false);
  });
});

describe('accessibility roving-focus primitives', () => {
  it('resolves one enabled tab stop and tab indexes', () => {
    expect(resolveRovingTabStop(items, 'unavailable')).toBe('alpha');
    expect(resolveRovingTabStop(items, 'beta')).toBe('beta');
    expect(getRovingTabIndex('beta', 'beta')).toBe(0);
    expect(getRovingTabIndex('alpha', 'beta')).toBe(-1);
  });

  it('skips disabled items and optionally loops', () => {
    expect(moveRovingFocus(items, 'alpha', 'next')).toBe('beta');
    expect(moveRovingFocus(items, 'gamma', 'next')).toBe('gamma');
    expect(moveRovingFocus(items, 'gamma', 'next', { loop: true })).toBe('alpha');
    expect(moveRovingFocus(items, 'alpha', 'previous', { loop: true })).toBe('gamma');
  });

  it('handles first, last, missing, empty, and all-disabled input', () => {
    expect(moveRovingFocus(items, 'beta', 'first')).toBe('alpha');
    expect(moveRovingFocus(items, 'beta', 'last')).toBe('gamma');
    expect(moveRovingFocus(items, null, 'next')).toBe('alpha');
    expect(moveRovingFocus([], null, 'next')).toBeNull();
    expect(moveRovingFocus([{ id: 'none', disabled: true }], null, 'next')).toBeNull();
  });
});

describe('accessibility live-region primitives', () => {
  it('provides explicit accessible defaults and overrides', () => {
    expect(getLiveRegionAttributes()).toEqual({
      'aria-live': 'polite',
      'aria-atomic': 'true',
      'aria-relevant': 'additions text',
    });
    expect(getLiveRegionAttributes({ politeness: 'assertive', atomic: false })).toMatchObject({
      'aria-live': 'assertive',
      'aria-atomic': 'false',
    });
  });

  it('coalesces queued announcements so the newest text wins', () => {
    const target = { textContent: null as string | null, isConnected: true };
    const scheduled: Array<() => void> = [];
    const controller = createLiveRegionController(target, (callback) => scheduled.push(callback));
    controller.announce('First');
    controller.announce('Second');
    expect(target.textContent).toBe('');
    for (const callback of scheduled) callback();
    expect(target.textContent).toBe('Second');
  });

  it('writes markup-like input as text and cancels disposed announcements', () => {
    const target = { textContent: null as string | null, isConnected: true };
    const scheduled: Array<() => void> = [];
    const controller = createLiveRegionController(target, (callback) => scheduled.push(callback));
    controller.announce('<img src=x onerror=alert(1)>');
    scheduled.shift()?.();
    expect(target.textContent).toBe('<img src=x onerror=alert(1)>');
    controller.announce('Cancelled');
    controller.dispose();
    scheduled.shift()?.();
    expect(target.textContent).toBe('');
  });
});
