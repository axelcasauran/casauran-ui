import type { CollectionKey, CollectionSnapshot } from './types.js';

export type SelectionMode = 'none' | 'single' | 'multiple';
export type SelectionIntent = 'replace' | 'toggle' | 'range' | 'add-range' | 'clear';

export interface SelectionState<Key extends CollectionKey> {
  readonly selectedKeys: readonly Key[];
  readonly anchorKey: Key | null;
}

const enabled = <Key extends CollectionKey>(snapshot: CollectionSnapshot<Key>, key: Key): boolean =>
  snapshot.has(key) && snapshot.getItem(key)?.disabled !== true;

const orderSelection = <Key extends CollectionKey>(
  snapshot: CollectionSnapshot<Key>,
  keys: Iterable<Key>,
): readonly Key[] => {
  const requested = new Set(keys);
  return Object.freeze(snapshot.enabledKeys.filter((key) => requested.has(key)));
};

export function createSelectionState<Key extends CollectionKey>(
  snapshot: CollectionSnapshot<Key>,
  selectedKeys: Iterable<Key> = [],
  anchorKey: Key | null = null,
): SelectionState<Key> {
  const ordered = orderSelection(snapshot, selectedKeys);
  const anchor =
    anchorKey !== null && enabled(snapshot, anchorKey) ? anchorKey : (ordered[0] ?? null);
  return Object.freeze({ selectedKeys: ordered, anchorKey: anchor });
}

export function isKeySelected<Key extends CollectionKey>(
  state: SelectionState<Key>,
  key: Key,
): boolean {
  return state.selectedKeys.includes(key);
}

export function applySelectionIntent<Key extends CollectionKey>(
  snapshot: CollectionSnapshot<Key>,
  state: SelectionState<Key>,
  targetKey: Key | null,
  options: { readonly mode: SelectionMode; readonly intent: SelectionIntent },
): SelectionState<Key> {
  if (options.mode === 'none' || options.intent === 'clear') {
    return Object.freeze({ selectedKeys: Object.freeze([]), anchorKey: null });
  }

  const current = createSelectionState(snapshot, state.selectedKeys, state.anchorKey);
  if (targetKey === null || !enabled(snapshot, targetKey)) return current;

  if (options.mode === 'single') {
    const selected =
      options.intent === 'toggle' && isKeySelected(current, targetKey) ? [] : [targetKey];
    return Object.freeze({ selectedKeys: Object.freeze(selected), anchorKey: targetKey });
  }

  if (options.intent === 'replace') {
    return Object.freeze({ selectedKeys: Object.freeze([targetKey]), anchorKey: targetKey });
  }
  if (options.intent === 'toggle') {
    const keys = new Set(current.selectedKeys);
    if (keys.has(targetKey)) keys.delete(targetKey);
    else keys.add(targetKey);
    return Object.freeze({ selectedKeys: orderSelection(snapshot, keys), anchorKey: targetKey });
  }

  const anchorKey =
    current.anchorKey !== null && enabled(snapshot, current.anchorKey)
      ? current.anchorKey
      : targetKey;
  const start = snapshot.enabledKeys.indexOf(anchorKey);
  const end = snapshot.enabledKeys.indexOf(targetKey);
  const lower = Math.min(start, end);
  const upper = Math.max(start, end);
  const range = snapshot.enabledKeys.slice(lower, upper + 1);
  const selected =
    options.intent === 'add-range'
      ? orderSelection(snapshot, [...current.selectedKeys, ...range])
      : Object.freeze([...range]);
  return Object.freeze({ selectedKeys: selected, anchorKey });
}
