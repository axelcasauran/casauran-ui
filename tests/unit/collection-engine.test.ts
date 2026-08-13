import { describe, expect, it } from 'vitest';

import type { CollectionInvariantError } from '../../packages/collections/src/index.js';
import {
  applySelectionIntent,
  createCollectionRegistry,
  createCollectionSnapshot,
  createSelectionState,
  emptyTypeaheadState,
  findTypeaheadMatch,
  getTypeaheadQuery,
  getVisibleKeys,
  moveActiveKey,
  resolveActiveKey,
  updateTypeaheadState,
} from '../../packages/collections/src/index.js';

const snapshot = createCollectionSnapshot([
  { key: 'root', textValue: 'Projects' },
  { key: 'alpha', parentKey: 'root', textValue: 'Alpha' },
  { key: 'disabled', parentKey: 'root', disabled: true, textValue: 'Unavailable' },
  { key: 'beta', parentKey: 'root', textValue: 'Beta' },
  { key: 'nested', parentKey: 'beta', textValue: 'Nested' },
]);

describe('collection snapshots and registration', () => {
  it('creates an immutable, deterministic depth-first snapshot', () => {
    expect(snapshot.keys).toEqual(['root', 'alpha', 'disabled', 'beta', 'nested']);
    expect(snapshot.rootKeys).toEqual(['root']);
    expect(snapshot.enabledKeys).toEqual(['root', 'alpha', 'beta', 'nested']);
    expect(snapshot.getChildren('root')).toEqual(['alpha', 'disabled', 'beta']);
    expect(snapshot.getParentKey('nested')).toBe('beta');
    expect(snapshot.getDepth('nested')).toBe(2);
    expect(Object.isFrozen(snapshot.keys)).toBe(true);
    expect(Object.isFrozen(snapshot.getItem('root'))).toBe(true);
  });

  it.each([
    ['CSN_COLLECTION_DUPLICATE_KEY', [{ key: 'a' }, { key: 'a' }]],
    ['CSN_COLLECTION_MISSING_PARENT', [{ key: 'a', parentKey: 'missing' }]],
    ['CSN_COLLECTION_SELF_PARENT', [{ key: 'a', parentKey: 'a' }]],
    [
      'CSN_COLLECTION_PARENT_CYCLE',
      [
        { key: 'a', parentKey: 'b' },
        { key: 'b', parentKey: 'a' },
      ],
    ],
  ])('rejects invalid identity graphs with %s', (code, items) => {
    expect(() => createCollectionSnapshot(items)).toThrow(
      expect.objectContaining<Partial<CollectionInvariantError>>({
        code: code as CollectionInvariantError['code'],
      }),
    );
  });

  it('uses token-aware registration cleanup and stable insertion order', () => {
    const registry = createCollectionRegistry<string>();
    const removeOld = registry.register({ key: 'a', textValue: 'old' });
    registry.register({ key: 'b' });
    const removeNew = registry.register({ key: 'a', textValue: 'new' });
    removeOld();
    expect(registry.snapshot().keys).toEqual(['a', 'b']);
    expect(registry.snapshot().getItem('a')?.textValue).toBe('new');
    removeNew();
    registry.register({ key: 'a' });
    expect(registry.snapshot().keys).toEqual(['b', 'a']);
  });

  it('handles a 10000-item deep tree without recursive traversal', () => {
    const items = Array.from({ length: 10000 }, (_, index) => ({
      key: index,
      ...(index === 0 ? {} : { parentKey: index - 1 }),
    }));
    const large = createCollectionSnapshot(items);
    const expanded = new Set(items.slice(0, -1).map((item) => item.key));
    expect(large.size).toBe(10000);
    expect(large.getDepth(9999)).toBe(9999);
    expect(getVisibleKeys(large, expanded)).toHaveLength(10000);
  });
});

describe('active item, selection, and tree visibility', () => {
  it('resolves and moves active keys over enabled collection order', () => {
    expect(resolveActiveKey(snapshot, 'disabled')).toBe('root');
    expect(resolveActiveKey(snapshot, 'beta')).toBe('beta');
    expect(moveActiveKey(snapshot, 'alpha', 'next')).toBe('beta');
    expect(moveActiveKey(snapshot, 'root', 'previous')).toBe('root');
    expect(moveActiveKey(snapshot, 'root', 'previous', { loop: true })).toBe('nested');
    expect(moveActiveKey(snapshot, null, 'previous')).toBe('nested');
  });

  it('normalizes selection and applies single, toggle, and range intents', () => {
    const initial = createSelectionState(snapshot, ['disabled', 'beta', 'missing'], 'missing');
    expect(initial).toEqual({ selectedKeys: ['beta'], anchorKey: 'beta' });
    const toggled = applySelectionIntent(snapshot, initial, 'alpha', {
      mode: 'multiple',
      intent: 'toggle',
    });
    expect(toggled).toEqual({ selectedKeys: ['alpha', 'beta'], anchorKey: 'alpha' });
    const ranged = applySelectionIntent(snapshot, toggled, 'nested', {
      mode: 'multiple',
      intent: 'range',
    });
    expect(ranged).toEqual({
      selectedKeys: ['alpha', 'beta', 'nested'],
      anchorKey: 'alpha',
    });
    expect(
      applySelectionIntent(snapshot, ranged, 'nested', { mode: 'single', intent: 'toggle' }),
    ).toEqual({ selectedKeys: [], anchorKey: 'nested' });
    expect(applySelectionIntent(snapshot, ranged, null, { mode: 'none', intent: 'clear' })).toEqual(
      { selectedKeys: [], anchorKey: null },
    );
  });

  it('projects only roots and children of expanded ancestors', () => {
    expect(getVisibleKeys(snapshot, [])).toEqual(['root']);
    expect(getVisibleKeys(snapshot, new Set(['root']))).toEqual([
      'root',
      'alpha',
      'disabled',
      'beta',
    ]);
    expect(getVisibleKeys(snapshot, ['root', 'beta'])).toEqual(snapshot.keys);
  });
});

describe('caller-timed typeahead', () => {
  it('accumulates within the timeout and resets for elapsed or non-monotonic time', () => {
    const first = updateTypeaheadState(emptyTypeaheadState, 'a', 100);
    expect(updateTypeaheadState(first, 'l', 300).search).toBe('al');
    expect(updateTypeaheadState(first, 'b', 601).search).toBe('b');
    expect(updateTypeaheadState(first, 'b', 99).search).toBe('b');
  });

  it('collapses repeated characters and wraps over enabled items', () => {
    expect(getTypeaheadQuery('bbb')).toBe('b');
    expect(findTypeaheadMatch(snapshot, 'b', 'beta')).toBe('beta');
    expect(findTypeaheadMatch(snapshot, 'u', 'root')).toBeNull();
  });

  it('supports caller-owned normalization and treats markup-like text as plain data', () => {
    const text = createCollectionSnapshot([
      { key: 1, textValue: '<script>alert(1)</script>' },
      { key: 2, textValue: 'Éclair' },
    ]);
    expect(findTypeaheadMatch(text, '<s', null)).toBe(1);
    expect(
      findTypeaheadMatch(text, 'e', null, {
        normalizeText: (value) =>
          value
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase(),
      }),
    ).toBe(2);
  });
});
