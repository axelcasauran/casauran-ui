const PORTAL_SCOPE_ATTRIBUTES = ['data-theme', 'data-density', 'dir'] as const;

export type PortalScopeAttribute = (typeof PORTAL_SCOPE_ATTRIBUTES)[number];

export interface PortalHostOptions {
  readonly ownerDocument: Document;
  readonly parent?: HTMLElement | undefined;
  readonly scopeSource?: Element | null | undefined;
}

export interface PortalHost {
  readonly element: HTMLElement;
  readonly destroyed: boolean;
  synchronizeScope(source?: Element | null): void;
  destroy(): void;
}

function resolveScopeValue(source: Element, attribute: PortalScopeAttribute): string | null {
  return source.closest(`[${attribute}]`)?.getAttribute(attribute) ?? null;
}

export function synchronizePortalScope(
  portalHost: HTMLElement,
  source: Element | null | undefined,
): void {
  if (
    source !== null &&
    source !== undefined &&
    source.ownerDocument !== portalHost.ownerDocument
  ) {
    throw new TypeError('Portal scope source must belong to the portal host document');
  }

  for (const attribute of PORTAL_SCOPE_ATTRIBUTES) {
    const value =
      source === null || source === undefined ? null : resolveScopeValue(source, attribute);
    if (value === null) portalHost.removeAttribute(attribute);
    else portalHost.setAttribute(attribute, value);
  }
}

export function createPortalHost(options: PortalHostOptions): PortalHost {
  const parent = options.parent ?? options.ownerDocument.body;
  if (parent.ownerDocument !== options.ownerDocument) {
    throw new TypeError('Portal parent must belong to the owner document');
  }

  const element = options.ownerDocument.createElement('div');
  element.setAttribute('data-csn-overlay-host', '');
  synchronizePortalScope(element, options.scopeSource);
  parent.append(element);
  let destroyed = false;

  return {
    element,
    get destroyed() {
      return destroyed;
    },
    synchronizeScope(source = options.scopeSource) {
      synchronizePortalScope(element, source);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      element.remove();
    },
  };
}
