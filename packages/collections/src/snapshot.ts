import type { CollectionItem, CollectionKey, CollectionSnapshot } from './types.js';

export type CollectionInvariantCode =
  | 'CSN_COLLECTION_DUPLICATE_KEY'
  | 'CSN_COLLECTION_MISSING_PARENT'
  | 'CSN_COLLECTION_SELF_PARENT'
  | 'CSN_COLLECTION_PARENT_CYCLE';

export class CollectionInvariantError extends Error {
  readonly code: CollectionInvariantCode;
  readonly key: CollectionKey;

  constructor(code: CollectionInvariantCode, key: CollectionKey, detail: string) {
    super(`${code}: ${detail}`);
    this.name = 'CollectionInvariantError';
    this.code = code;
    this.key = key;
  }
}

const EMPTY_KEYS: readonly never[] = Object.freeze([]);

export function createCollectionSnapshot<Key extends CollectionKey, Metadata = unknown>(
  inputItems: readonly CollectionItem<Key, Metadata>[],
): CollectionSnapshot<Key, Metadata> {
  const items = new Map<Key, Readonly<CollectionItem<Key, Metadata>>>();
  const inputOrder: Key[] = [];

  for (const inputItem of inputItems) {
    if (items.has(inputItem.key)) {
      throw new CollectionInvariantError(
        'CSN_COLLECTION_DUPLICATE_KEY',
        inputItem.key,
        `duplicate key ${String(inputItem.key)}`,
      );
    }
    const item = Object.freeze({ ...inputItem });
    items.set(item.key, item);
    inputOrder.push(item.key);
  }

  const childKeys = new Map<Key, Key[]>();
  const rootKeys: Key[] = [];
  for (const key of inputOrder) {
    const item = items.get(key);
    if (item === undefined) continue;
    const parentKey = item.parentKey;
    if (parentKey === undefined) {
      rootKeys.push(key);
      continue;
    }
    if (Object.is(parentKey, key)) {
      throw new CollectionInvariantError(
        'CSN_COLLECTION_SELF_PARENT',
        key,
        `key ${String(key)} cannot parent itself`,
      );
    }
    if (!items.has(parentKey)) {
      throw new CollectionInvariantError(
        'CSN_COLLECTION_MISSING_PARENT',
        key,
        `parent ${String(parentKey)} does not exist for ${String(key)}`,
      );
    }
    const siblings = childKeys.get(parentKey) ?? [];
    siblings.push(key);
    childKeys.set(parentKey, siblings);
  }

  const visitState = new Map<Key, 'visiting' | 'complete'>();
  for (const startKey of inputOrder) {
    if (visitState.get(startKey) === 'complete') continue;
    const path: Key[] = [];
    let currentKey: Key | undefined = startKey;
    while (currentKey !== undefined && visitState.get(currentKey) !== 'complete') {
      if (visitState.get(currentKey) === 'visiting') {
        throw new CollectionInvariantError(
          'CSN_COLLECTION_PARENT_CYCLE',
          currentKey,
          `parent cycle includes ${String(currentKey)}`,
        );
      }
      visitState.set(currentKey, 'visiting');
      path.push(currentKey);
      currentKey = items.get(currentKey)?.parentKey;
    }
    for (const key of path) visitState.set(key, 'complete');
  }

  const orderedKeys: Key[] = [];
  const depths = new Map<Key, number>();
  const stack = rootKeys.map((key) => ({ key, depth: 0 })).reverse();
  while (stack.length > 0) {
    const entry = stack.pop();
    if (entry === undefined) continue;
    orderedKeys.push(entry.key);
    depths.set(entry.key, entry.depth);
    const children = childKeys.get(entry.key) ?? [];
    for (let index = children.length - 1; index >= 0; index -= 1) {
      const childKey = children[index];
      if (childKey !== undefined) stack.push({ key: childKey, depth: entry.depth + 1 });
    }
  }

  const frozenChildren = new Map<Key, readonly Key[]>();
  for (const [key, children] of childKeys) frozenChildren.set(key, Object.freeze([...children]));
  const frozenKeys = Object.freeze(orderedKeys);
  const frozenRootKeys = Object.freeze(rootKeys);
  const enabledKeys = Object.freeze(orderedKeys.filter((key) => items.get(key)?.disabled !== true));

  return Object.freeze({
    size: items.size,
    keys: frozenKeys,
    rootKeys: frozenRootKeys,
    enabledKeys,
    has: (key: Key) => items.has(key),
    getItem: (key: Key) => items.get(key),
    getParentKey: (key: Key) => items.get(key)?.parentKey ?? null,
    getChildren: (key: Key) => frozenChildren.get(key) ?? (EMPTY_KEYS as readonly Key[]),
    getDepth: (key: Key) => depths.get(key),
  });
}
