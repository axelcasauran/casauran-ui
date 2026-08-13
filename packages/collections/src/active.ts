import type { CollectionKey, CollectionSnapshot } from './types.js';

export type ActiveMovementIntent = 'previous' | 'next' | 'first' | 'last';

export function resolveActiveKey<Key extends CollectionKey>(
  snapshot: CollectionSnapshot<Key>,
  preferredKey: Key | null | undefined,
): Key | null {
  if (
    preferredKey !== null &&
    preferredKey !== undefined &&
    snapshot.getItem(preferredKey)?.disabled !== true
  ) {
    return snapshot.has(preferredKey) ? preferredKey : (snapshot.enabledKeys[0] ?? null);
  }
  return snapshot.enabledKeys[0] ?? null;
}

export function moveActiveKey<Key extends CollectionKey>(
  snapshot: CollectionSnapshot<Key>,
  currentKey: Key | null | undefined,
  intent: ActiveMovementIntent,
  options: { readonly loop?: boolean | undefined } = {},
): Key | null {
  const keys = snapshot.enabledKeys;
  if (keys.length === 0) return null;
  if (intent === 'first') return keys[0] ?? null;
  if (intent === 'last') return keys.at(-1) ?? null;

  const currentIndex =
    currentKey === null || currentKey === undefined ? -1 : keys.indexOf(currentKey);
  if (currentIndex < 0) return intent === 'previous' ? (keys.at(-1) ?? null) : (keys[0] ?? null);

  const nextIndex = currentIndex + (intent === 'next' ? 1 : -1);
  if (nextIndex >= 0 && nextIndex < keys.length) return keys[nextIndex] ?? null;
  if (options.loop === true) return intent === 'next' ? (keys[0] ?? null) : (keys.at(-1) ?? null);
  return keys[currentIndex] ?? null;
}
