import type { CollectionKey, CollectionSnapshot } from './types.js';

export function getVisibleKeys<Key extends CollectionKey>(
  snapshot: CollectionSnapshot<Key>,
  expandedKeys: ReadonlySet<Key> | readonly Key[],
): readonly Key[] {
  const expanded = new Set(expandedKeys);
  const visible: Key[] = [];
  const stack = [...snapshot.rootKeys].reverse();
  while (stack.length > 0) {
    const key = stack.pop();
    if (key === undefined) continue;
    visible.push(key);
    if (!expanded.has(key)) continue;
    const children = snapshot.getChildren(key);
    for (let index = children.length - 1; index >= 0; index -= 1) {
      const childKey = children[index];
      if (childKey !== undefined) stack.push(childKey);
    }
  }
  return Object.freeze(visible);
}
