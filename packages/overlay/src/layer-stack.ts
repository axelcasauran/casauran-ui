export type OverlayLayerKey = string | number | symbol;

export interface OverlayLayerStack<Key extends OverlayLayerKey, RecordValue> {
  readonly size: number;
  readonly keys: readonly Key[];
  readonly top: Readonly<{ key: Key; value: RecordValue }> | null;
  register(key: Key, value: RecordValue): () => void;
  unregister(key: Key): boolean;
  get(key: Key): RecordValue | undefined;
  clear(): void;
}

interface LayerRegistration<RecordValue> {
  readonly token: symbol;
  readonly value: RecordValue;
}

export function createOverlayLayerStack<
  Key extends OverlayLayerKey,
  RecordValue,
>(): OverlayLayerStack<Key, RecordValue> {
  const registrations = new Map<Key, LayerRegistration<RecordValue>>();
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
    get keys() {
      return Object.freeze(order.filter((key) => registrations.has(key)));
    },
    get top() {
      for (let index = order.length - 1; index >= 0; index -= 1) {
        const key = order[index];
        if (key === undefined) continue;
        const registration = registrations.get(key);
        if (registration !== undefined) {
          return Object.freeze({ key, value: registration.value });
        }
      }
      return null;
    },
    register(key, value) {
      const token = Symbol('overlay-layer-registration');
      if (!registrations.has(key)) order.push(key);
      registrations.set(key, { token, value });
      return () => {
        if (registrations.get(key)?.token === token) unregister(key);
      };
    },
    unregister,
    get(key) {
      return registrations.get(key)?.value;
    },
    clear() {
      registrations.clear();
      order.length = 0;
    },
  };
}
