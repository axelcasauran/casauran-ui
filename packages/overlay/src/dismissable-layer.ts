import { createOverlayLayerStack, type OverlayLayerKey } from './layer-stack.js';

export type OverlayDismissReason = 'escape-key' | 'pointer-outside';

export interface OverlayDismissEvent {
  readonly reason: OverlayDismissReason;
  readonly originalEvent: KeyboardEvent | PointerEvent;
}

export interface DismissableLayerOptions {
  readonly element: HTMLElement;
  readonly branches?: readonly HTMLElement[] | (() => readonly HTMLElement[]) | undefined;
  readonly dismissOnEscape?: boolean | undefined;
  readonly dismissOnPointerOutside?: boolean | undefined;
  readonly onDismiss: (event: OverlayDismissEvent) => void;
}

export interface DismissableLayerManager<Key extends OverlayLayerKey> {
  readonly size: number;
  readonly topLayerKey: Key | null;
  register(key: Key, options: DismissableLayerOptions): () => void;
  unregister(key: Key): boolean;
  dispose(): void;
}

const isCommandModified = (event: KeyboardEvent): boolean =>
  event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

function isNodeInDocument(target: EventTarget | null, ownerDocument: Document): target is Node {
  const NodeConstructor = ownerDocument.defaultView?.Node;
  return NodeConstructor !== undefined && target instanceof NodeConstructor;
}

function getBranches(options: DismissableLayerOptions): readonly HTMLElement[] {
  return typeof options.branches === 'function' ? options.branches() : (options.branches ?? []);
}

export function createDismissableLayerManager<Key extends OverlayLayerKey>(
  ownerDocument: Document,
): DismissableLayerManager<Key> {
  const stack = createOverlayLayerStack<Key, DismissableLayerOptions>();
  let listening = false;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.repeat || event.isComposing || isCommandModified(event)) {
      return;
    }
    const top = stack.top;
    if (top === null || top.value.dismissOnEscape === false) return;
    top.value.onDismiss({ reason: 'escape-key', originalEvent: event });
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const top = stack.top;
    if (top === null || top.value.dismissOnPointerOutside === false) return;
    const target = event.target;
    if (!isNodeInDocument(target, ownerDocument) || !target.isConnected) return;
    if (top.value.element.contains(target)) return;
    if (getBranches(top.value).some((branch) => branch.contains(target))) return;
    top.value.onDismiss({ reason: 'pointer-outside', originalEvent: event });
  };

  const startListening = () => {
    if (listening) return;
    listening = true;
    ownerDocument.addEventListener('keydown', handleKeyDown, true);
    ownerDocument.addEventListener('pointerdown', handlePointerDown, true);
  };

  const stopListening = () => {
    if (!listening) return;
    listening = false;
    ownerDocument.removeEventListener('keydown', handleKeyDown, true);
    ownerDocument.removeEventListener('pointerdown', handlePointerDown, true);
  };

  const unregister = (key: Key): boolean => {
    const removed = stack.unregister(key);
    if (stack.size === 0) stopListening();
    return removed;
  };

  return {
    get size() {
      return stack.size;
    },
    get topLayerKey() {
      return stack.top?.key ?? null;
    },
    register(key, options) {
      if (options.element.ownerDocument !== ownerDocument) {
        throw new TypeError('Dismissable layer must belong to the manager document');
      }
      const unregisterToken = stack.register(key, options);
      startListening();
      return () => {
        unregisterToken();
        if (stack.size === 0) stopListening();
      };
    },
    unregister,
    dispose() {
      stack.clear();
      stopListening();
    },
  };
}
