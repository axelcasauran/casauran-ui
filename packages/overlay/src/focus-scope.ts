import { getTabbableElements, tryFocus } from '@casauran-internal/accessibility';

export type FocusTarget = HTMLElement | null | undefined | (() => HTMLElement | null | undefined);

export interface FocusScopeOptions {
  readonly root: HTMLElement;
  readonly initialFocus?: FocusTarget;
  readonly fallbackFocus?: FocusTarget;
  readonly trapFocus?: boolean | undefined;
  readonly restoreFocus?: boolean | FocusTarget | undefined;
}

export interface FocusScopeHandle {
  readonly active: boolean;
  deactivate(): void;
}

export interface FocusScopeManager {
  readonly size: number;
  activate(options: FocusScopeOptions): FocusScopeHandle;
  dispose(): void;
}

interface FocusScopeRecord {
  readonly token: symbol;
  readonly options: FocusScopeOptions;
  readonly previousFocus: HTMLElement | null;
  active: boolean;
  lastFocusedInside: HTMLElement | null;
}

const resolveTarget = (target: FocusTarget): HTMLElement | null => {
  const resolved = typeof target === 'function' ? target() : target;
  return resolved ?? null;
};

function asHTMLElement(target: EventTarget | null, ownerDocument: Document): HTMLElement | null {
  const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement;
  return HTMLElementConstructor !== undefined && target instanceof HTMLElementConstructor
    ? target
    : null;
}

// Entry and fallback targets outside the scope root are ignored, so a resolved target can never
// move focus out of a scope that is containing it.
function resolveContainedTarget(root: HTMLElement, target: FocusTarget): HTMLElement | null {
  const resolved = resolveTarget(target);
  return resolved !== null && root.contains(resolved) ? resolved : null;
}

function focusEntry(scope: FocusScopeRecord): boolean {
  const { root } = scope.options;
  const candidates = [
    resolveContainedTarget(root, scope.options.initialFocus),
    getTabbableElements(root)[0] ?? null,
    resolveContainedTarget(root, scope.options.fallbackFocus),
    root,
  ];
  for (const candidate of candidates) {
    if (candidate !== null && root.contains(candidate) && tryFocus(candidate)) {
      scope.lastFocusedInside = candidate;
      return true;
    }
  }
  return false;
}

export function createFocusScopeManager(ownerDocument: Document): FocusScopeManager {
  const scopes: FocusScopeRecord[] = [];
  let listening = false;
  const top = () => scopes.at(-1) ?? null;

  const handleFocusIn = (event: FocusEvent) => {
    const scope = top();
    if (scope === null) return;
    const target = asHTMLElement(event.target, ownerDocument);
    if (target !== null && scope.options.root.contains(target)) {
      scope.lastFocusedInside = target;
      return;
    }
    if (scope.options.trapFocus === true) {
      if (!tryFocus(scope.lastFocusedInside)) focusEntry(scope);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const scope = top();
    if (
      scope === null ||
      scope.options.trapFocus !== true ||
      event.key !== 'Tab' ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }
    const tabbable = getTabbableElements(scope.options.root);
    if (tabbable.length === 0) {
      event.preventDefault();
      const fallback = resolveContainedTarget(scope.options.root, scope.options.fallbackFocus);
      if (!tryFocus(fallback)) tryFocus(scope.options.root);
      return;
    }

    const active = asHTMLElement(ownerDocument.activeElement, ownerDocument);
    const activeIndex = active === null ? -1 : tabbable.indexOf(active);
    if (event.shiftKey && activeIndex <= 0) {
      event.preventDefault();
      tryFocus(tabbable.at(-1));
    } else if (!event.shiftKey && (activeIndex < 0 || activeIndex === tabbable.length - 1)) {
      event.preventDefault();
      tryFocus(tabbable[0]);
    }
  };

  const startListening = () => {
    if (listening) return;
    listening = true;
    ownerDocument.addEventListener('focusin', handleFocusIn, true);
    ownerDocument.addEventListener('keydown', handleKeyDown, true);
  };

  const stopListening = () => {
    if (!listening) return;
    listening = false;
    ownerDocument.removeEventListener('focusin', handleFocusIn, true);
    ownerDocument.removeEventListener('keydown', handleKeyDown, true);
  };

  const deactivate = (scope: FocusScopeRecord) => {
    if (!scope.active) return;
    scope.active = false;
    const index = scopes.findIndex((candidate) => candidate.token === scope.token);
    if (index < 0) return;
    const wasTop = index === scopes.length - 1;
    scopes.splice(index, 1);
    if (scopes.length === 0) stopListening();
    if (!wasTop || scope.options.restoreFocus === false) return;

    const restoreOption = scope.options.restoreFocus;
    const explicitTarget =
      restoreOption === undefined || restoreOption === true
        ? scope.previousFocus
        : resolveTarget(restoreOption);
    if (tryFocus(explicitTarget)) return;
    const nextScope = top();
    if (nextScope !== null && !tryFocus(nextScope.lastFocusedInside)) focusEntry(nextScope);
  };

  return {
    get size() {
      return scopes.length;
    },
    activate(options) {
      if (options.root.ownerDocument !== ownerDocument || !options.root.isConnected) {
        throw new TypeError('Focus scope root must be connected to the manager document');
      }
      const previousFocus = asHTMLElement(ownerDocument.activeElement, ownerDocument);
      const scope: FocusScopeRecord = {
        token: Symbol('overlay-focus-scope'),
        options,
        previousFocus,
        active: true,
        lastFocusedInside: null,
      };
      scopes.push(scope);
      startListening();
      focusEntry(scope);
      return {
        get active() {
          return scope.active;
        },
        deactivate() {
          deactivate(scope);
        },
      };
    },
    dispose() {
      const activeScopes = [...scopes].reverse();
      for (const scope of activeScopes) deactivate(scope);
      scopes.length = 0;
      stopListening();
    },
  };
}
