import { createCollectionSnapshot } from './snapshot.js';
import type { CollectionItem, CollectionKey, CollectionSnapshot } from './types.js';

export interface CollectionRegistry<Key extends CollectionKey, Metadata = unknown> {
  readonly size: number;
  register(item: CollectionItem<Key, Metadata>): () => void;
  unregister(key: Key): boolean;
  clear(): void;
  snapshot(): CollectionSnapshot<Key, Metadata>;
}

interface Registration<Metadata, Key extends CollectionKey> {
  readonly item: CollectionItem<Key, Metadata>;
  readonly token: symbol;
}

export function createCollectionRegistry<
  Key extends CollectionKey,
  Metadata = unknown,
>(): CollectionRegistry<Key, Metadata> {
  const registrations = new Map<Key, Registration<Metadata, Key>>();
  const order: Key[] = [];

  const unregister = (key: Key): boolean => {
    if (!registrations.delete(key)) return false;
    const index = order.indexOf(key);
    if (index >= 0) order.splice(index, 1);
    return true;
  };

  return {
    get size() {
      return registrations.size;
    },
    register(item) {
      const token = Symbol('collection-registration');
      if (!registrations.has(item.key)) order.push(item.key);
      registrations.set(item.key, { item: { ...item }, token });
      return () => {
        if (registrations.get(item.key)?.token === token) unregister(item.key);
      };
    },
    unregister,
    clear() {
      registrations.clear();
      order.length = 0;
    },
    snapshot() {
      const items = order.flatMap((key) => {
        const registration = registrations.get(key);
        return registration === undefined ? [] : [registration.item];
      });
      return createCollectionSnapshot(items);
    },
  };
}
