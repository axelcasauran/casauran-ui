'use client';

import {
  createLiveRegionController,
  getDirectionalNavigationIntent,
  getLiveRegionAttributes,
  getRovingTabIndex,
  getTabbableElements,
  moveRovingFocus,
  resolveRovingTabStop,
  tryFocus,
  type KeyboardEventLike,
  type LiveRegionController,
} from '@casauran-internal/accessibility/testing';
import { useRef, useState, type KeyboardEvent } from 'react';

type ItemId = 'alpha' | 'unavailable' | 'beta' | 'gamma';

const items: readonly { id: ItemId; label: string; disabled?: boolean }[] = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'unavailable', label: 'Unavailable', disabled: true },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
];

export function AccessibilityClientProbe() {
  const initialTabStop = resolveRovingTabStop(items, 'alpha');
  const [tabStopId, setTabStopId] = useState<ItemId | null>(initialTabStop);
  const itemRefs = useRef<Partial<Record<ItemId, HTMLButtonElement>>>({});
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const liveRegionControllerRef = useRef<LiveRegionController>(null);
  const focusZoneRef = useRef<HTMLDivElement>(null);
  const programmaticTargetRef = useRef<HTMLDivElement>(null);

  const announce = (message: string) => {
    const target = liveRegionRef.current;
    if (target !== null) {
      liveRegionControllerRef.current ??= createLiveRegionController(target);
      liveRegionControllerRef.current.announce(message);
    }
  };

  const handleItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keyboardEvent: KeyboardEventLike = {
      key: event.key,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      isComposing: event.nativeEvent.isComposing,
    };
    const intent = getDirectionalNavigationIntent(keyboardEvent, {
      orientation: 'horizontal',
      direction: 'rtl',
    });
    if (intent === null) return;

    event.preventDefault();
    const nextId = moveRovingFocus(items, tabStopId, intent, { loop: true });
    if (nextId === null) return;
    setTabStopId(nextId);
    tryFocus(itemRefs.current[nextId]);
    announce(`Focused ${items.find((item) => item.id === nextId)?.label ?? nextId}`);
  };

  return (
    <>
      <div
        aria-label="RTL roving focus demo"
        className="accessibility-probe__group"
        dir="rtl"
        role="toolbar"
      >
        {items.map((item) => (
          <button
            key={item.id}
            ref={(element) => {
              if (element !== null) itemRefs.current[item.id] = element;
            }}
            disabled={item.disabled}
            tabIndex={getRovingTabIndex(item.id, tabStopId)}
            type="button"
            onClick={() => {
              announce(`Activated ${item.label}`);
            }}
            onKeyDown={handleItemKeyDown}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="accessibility-probe__group" ref={focusZoneRef}>
        <a href="#programmatic-target">First link</a>
        <button hidden type="button">
          Hidden action
        </button>
        <button disabled type="button">
          Disabled action
        </button>
        <button type="button">Last action</button>
      </div>

      <div className="accessibility-probe__group">
        <button
          type="button"
          onClick={() => {
            const last = getTabbableElements(focusZoneRef.current ?? document).at(-1);
            tryFocus(last);
          }}
        >
          Focus last tabbable
        </button>
        <button
          type="button"
          onClick={() => {
            tryFocus(programmaticTargetRef.current);
          }}
        >
          Focus programmatic target
        </button>
        <button
          type="button"
          onClick={() => {
            announce('<img src=x onerror=alert(1)>');
          }}
        >
          Announce markup-like text
        </button>
      </div>

      <div id="programmatic-target" ref={programmaticTargetRef} tabIndex={-1}>
        Programmatic focus target
      </div>

      <div
        {...getLiveRegionAttributes()}
        ref={liveRegionRef}
        data-csn-visually-hidden=""
        data-testid="live-region"
        role="status"
      />
    </>
  );
}
