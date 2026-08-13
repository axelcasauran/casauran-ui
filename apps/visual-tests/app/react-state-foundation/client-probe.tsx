'use client';

import {
  useCommittedCallback,
  useControllableState,
  useHydrated,
  useStableId,
} from '@casauran/react/state';
import { useRef, useState } from 'react';

export function ReactStateClientProbe() {
  const [uncontrolledEvents, setUncontrolledEvents] = useState<readonly number[]>([]);
  const [uncontrolledValue, setUncontrolledValue] = useControllableState({
    defaultValue: 1,
    onChange: (value) => {
      setUncontrolledEvents((events) => [...events, value]);
    },
  });
  const [requestedControlledValue, setRequestedControlledValue] = useState<number | null>(null);
  const [controlledValue, requestControlledValue] = useControllableState({
    value: 5,
    defaultValue: 0,
    onChange: setRequestedControlledValue,
  });
  const [callbackVersion, setCallbackVersion] = useState(1);
  const [callbackResult, setCallbackResult] = useState('Not invoked');
  const callback = useCommittedCallback(() => {
    setCallbackResult(`Version ${String(callbackVersion)}`);
  });
  const initialCallbackRef = useRef(callback);
  const hydrated = useHydrated();
  const generatedId = useStableId(undefined, 'state-probe');
  const explicitId = useStableId('state-probe-explicit');

  return (
    <section data-hydrated={String(hydrated)} data-testid="react-state-client-probe">
      <h2>Controllable state</h2>
      <output aria-label="Uncontrolled value">{uncontrolledValue}</output>
      <output aria-label="Uncontrolled change count">{uncontrolledEvents.length}</output>
      <output aria-label="Latest uncontrolled change">{uncontrolledEvents.at(-1) ?? 'none'}</output>
      <button
        type="button"
        onClick={() => {
          setUncontrolledValue((previousValue) => previousValue + 1);
          setUncontrolledValue((previousValue) => previousValue + 1);
        }}
      >
        Increment uncontrolled twice
      </button>
      <button
        type="button"
        onClick={() => {
          setUncontrolledValue(uncontrolledValue);
        }}
      >
        Request unchanged uncontrolled
      </button>

      <output aria-label="Controlled value">{controlledValue}</output>
      <output aria-label="Requested controlled value">{requestedControlledValue ?? 'none'}</output>
      <button
        type="button"
        onClick={() => {
          requestControlledValue((previousValue) => previousValue + 1);
        }}
      >
        Request controlled increment
      </button>

      <h2>Committed callback</h2>
      <output aria-label="Callback identity stable">
        {String(initialCallbackRef.current === callback)}
      </output>
      <output aria-label="Callback result">{callbackResult}</output>
      <button
        type="button"
        onClick={() => {
          setCallbackVersion(2);
        }}
      >
        Update callback version
      </button>
      <button type="button" onClick={callback}>
        Invoke committed callback
      </button>

      <h2>Stable identifiers</h2>
      <label htmlFor={generatedId}>Generated identifier</label>
      <input data-testid="generated-id-probe" id={generatedId} readOnly value="generated" />
      <label htmlFor={explicitId}>Explicit identifier</label>
      <input data-testid="explicit-id-probe" id={explicitId} readOnly value="explicit" />
    </section>
  );
}
