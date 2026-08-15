'use client';

import {
  createDismissableLayerManager,
  createFocusScopeManager,
  createModalIsolationManager,
  createPortalHost,
  type DismissableLayerManager,
  type FocusScopeManager,
  type ModalIsolationManager,
  type PortalHost,
} from '@casauran-internal/overlay';
import { useEffect, useRef, useState } from 'react';

export function OverlayFoundationClientProbe() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [escapedOpen, setEscapedOpen] = useState(false);
  const [dismissLog, setDismissLog] = useState('none');
  const scopeSourceRef = useRef<HTMLDivElement>(null);
  const escapedTriggerRef = useRef<HTMLButtonElement>(null);
  const escapedRootRef = useRef<HTMLDivElement>(null);
  const outsideTargetRef = useRef<HTMLButtonElement>(null);
  const parentTriggerRef = useRef<HTMLButtonElement>(null);
  const parentRootRef = useRef<HTMLDivElement>(null);
  const parentInitialRef = useRef<HTMLButtonElement>(null);
  const childTriggerRef = useRef<HTMLButtonElement>(null);
  const childRootRef = useRef<HTMLDivElement>(null);
  const childInitialRef = useRef<HTMLButtonElement>(null);
  const portalHostRef = useRef<PortalHost>(null);
  const dismissManagerRef = useRef<DismissableLayerManager<string>>(null);
  const focusManagerRef = useRef<FocusScopeManager>(null);
  const isolationManagerRef = useRef<ModalIsolationManager>(null);

  useEffect(() => {
    dismissManagerRef.current = createDismissableLayerManager<string>(document);
    focusManagerRef.current = createFocusScopeManager(document);
    isolationManagerRef.current = createModalIsolationManager(document);
    return () => {
      portalHostRef.current?.destroy();
      dismissManagerRef.current?.dispose();
      isolationManagerRef.current?.dispose();
      focusManagerRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const root = parentRootRef.current;
    if (!parentOpen || root === null) return;
    const unregisterDismiss = dismissManagerRef.current?.register('parent', {
      element: root,
      onDismiss: ({ reason }) => {
        setDismissLog(`parent:${reason}`);
        setChildOpen(false);
        setParentOpen(false);
      },
    });
    const focusScope = focusManagerRef.current?.activate({
      root,
      initialFocus: () => parentInitialRef.current,
      trapFocus: true,
      restoreFocus: () => parentTriggerRef.current,
    });
    const isolation = isolationManagerRef.current?.activate(root);
    return () => {
      unregisterDismiss?.();
      isolation?.deactivate();
      focusScope?.deactivate();
    };
  }, [parentOpen]);

  useEffect(() => {
    const root = childRootRef.current;
    if (!childOpen || root === null) return;
    const unregisterDismiss = dismissManagerRef.current?.register('child', {
      element: root,
      onDismiss: ({ reason }) => {
        setDismissLog(`child:${reason}`);
        setChildOpen(false);
      },
    });
    const focusScope = focusManagerRef.current?.activate({
      root,
      initialFocus: () => childInitialRef.current,
      trapFocus: true,
      restoreFocus: () => childTriggerRef.current,
    });
    const isolation = isolationManagerRef.current?.activate(root);
    return () => {
      unregisterDismiss?.();
      isolation?.deactivate();
      focusScope?.deactivate();
    };
  }, [childOpen]);

  // Entry and fallback targets outside the scope root must be ignored, so this scope declares an
  // out-of-root target and contains no tabbable descendant.
  useEffect(() => {
    const root = escapedRootRef.current;
    if (!escapedOpen || root === null) return;
    const unregisterDismiss = dismissManagerRef.current?.register('escaped', {
      element: root,
      onDismiss: ({ reason }) => {
        setDismissLog(`escaped:${reason}`);
        setEscapedOpen(false);
      },
    });
    const focusScope = focusManagerRef.current?.activate({
      root,
      initialFocus: () => outsideTargetRef.current,
      fallbackFocus: () => outsideTargetRef.current,
      trapFocus: true,
      restoreFocus: () => escapedTriggerRef.current,
    });
    return () => {
      unregisterDismiss?.();
      focusScope?.deactivate();
    };
  }, [escapedOpen]);

  const createScopedPortal = () => {
    portalHostRef.current?.destroy();
    const portal = createPortalHost({
      ownerDocument: document,
      scopeSource: scopeSourceRef.current,
    });
    const content = document.createElement('p');
    content.dataset['testid'] = 'portal-content';
    content.textContent = 'Portal content';
    portal.element.append(content);
    portalHostRef.current = portal;
  };

  return (
    <section aria-label="Overlay lifecycle probe">
      <div ref={scopeSourceRef} data-density="compact" data-theme="dark" dir="rtl">
        <button type="button" onClick={createScopedPortal}>
          Create scoped portal
        </button>
        <button
          type="button"
          onClick={() => {
            const source = scopeSourceRef.current;
            if (source === null) return;
            source.dataset['theme'] = 'light';
            source.dataset['density'] = 'comfortable';
            source.dir = 'ltr';
            portalHostRef.current?.synchronizeScope(source);
          }}
        >
          Synchronize portal scope
        </button>
        <button
          type="button"
          onClick={() => {
            portalHostRef.current?.destroy();
          }}
        >
          Destroy portal
        </button>
      </div>

      <button
        ref={parentTriggerRef}
        data-testid="parent-trigger"
        type="button"
        onClick={() => {
          setDismissLog('none');
          setParentOpen(true);
        }}
      >
        Open parent layer
      </button>
      <button data-testid="background-action" type="button">
        Background action
      </button>
      <button
        ref={escapedTriggerRef}
        data-testid="escaped-trigger"
        type="button"
        onClick={() => {
          setDismissLog('none');
          setEscapedOpen(true);
        }}
      >
        Open escaped-target layer
      </button>
      <button ref={outsideTargetRef} data-testid="outside-target" type="button">
        Outside target
      </button>
      <output aria-label="Dismiss log">{dismissLog}</output>

      {escapedOpen ? (
        <div
          ref={escapedRootRef}
          aria-label="Escaped target layer"
          data-testid="escaped-root"
          role="group"
          tabIndex={-1}
        >
          <p>This layer declares an out-of-root focus target and has no tabbable descendant.</p>
        </div>
      ) : null}

      {parentOpen ? (
        <div ref={parentRootRef} aria-label="Parent layer" role="group" tabIndex={-1}>
          <button ref={parentInitialRef} type="button">
            Parent first
          </button>
          <button
            ref={childTriggerRef}
            type="button"
            onClick={() => {
              setChildOpen(true);
            }}
          >
            Open child layer
          </button>
          <button type="button">Parent last</button>
          {childOpen ? (
            <div ref={childRootRef} aria-label="Child layer" role="group" tabIndex={-1}>
              <button ref={childInitialRef} type="button">
                Child first
              </button>
              <button type="button">Child last</button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
