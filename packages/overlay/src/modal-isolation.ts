export interface ModalIsolationHandle {
  readonly active: boolean;
  deactivate(): void;
}

export interface ModalIsolationManager {
  readonly size: number;
  activate(root: HTMLElement): ModalIsolationHandle;
  dispose(): void;
}

interface InertState {
  count: number;
  readonly original: boolean;
}

interface IsolationRecord {
  readonly token: symbol;
  readonly elements: readonly HTMLElement[];
  active: boolean;
}

function getSiblingBranches(root: HTMLElement, body: HTMLElement): readonly HTMLElement[] {
  const branches = new Set<HTMLElement>();
  const HTMLElementConstructor = root.ownerDocument.defaultView?.HTMLElement;
  if (HTMLElementConstructor === undefined) return [];
  let current: HTMLElement = root;
  while (current !== body) {
    const parent = current.parentElement;
    if (parent === null) break;
    for (const child of parent.children) {
      if (child !== current && child instanceof HTMLElementConstructor) {
        branches.add(child);
      }
    }
    current = parent;
  }
  return [...branches];
}

export function createModalIsolationManager(ownerDocument: Document): ModalIsolationManager {
  const inertStates = new Map<HTMLElement, InertState>();
  const isolations: IsolationRecord[] = [];

  const deactivate = (isolation: IsolationRecord) => {
    if (!isolation.active) return;
    isolation.active = false;
    const index = isolations.findIndex((candidate) => candidate.token === isolation.token);
    if (index >= 0) isolations.splice(index, 1);

    for (const element of isolation.elements) {
      const state = inertStates.get(element);
      if (state === undefined) continue;
      state.count -= 1;
      if (state.count > 0) continue;
      inertStates.delete(element);
      if (element.inert) element.inert = state.original;
    }
  };

  return {
    get size() {
      return isolations.length;
    },
    activate(root) {
      const body = ownerDocument.body;
      if (root.ownerDocument !== ownerDocument || !body.contains(root)) {
        throw new TypeError('Modal isolation root must be connected beneath the document body');
      }
      const elements = getSiblingBranches(root, body);
      for (const element of elements) {
        const existing = inertStates.get(element);
        if (existing === undefined) {
          inertStates.set(element, { count: 1, original: element.inert });
          element.inert = true;
        } else {
          existing.count += 1;
        }
      }
      const isolation: IsolationRecord = {
        token: Symbol('overlay-modal-isolation'),
        elements,
        active: true,
      };
      isolations.push(isolation);
      return {
        get active() {
          return isolation.active;
        },
        deactivate() {
          deactivate(isolation);
        },
      };
    },
    dispose() {
      for (const isolation of [...isolations].reverse()) deactivate(isolation);
      isolations.length = 0;
    },
  };
}
