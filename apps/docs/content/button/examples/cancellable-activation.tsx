'use client';

import { Button } from '@casauran/react';
import { useState } from 'react';

export function CancellableActivationExample() {
  const [locked, setLocked] = useState(true);
  const [log, setLog] = useState('No activation yet.');

  return (
    <>
      <Button
        onClick={(event) => {
          // onClick runs before the pressed-state transition, so preventDefault cancels the
          // toggle request while the native event still happened.
          if (locked) event.preventDefault();
          setLog(locked ? 'Click received, toggle cancelled.' : 'Click received, toggle applied.');
        }}
        onPressedChange={(event) => {
          setLog(`Pressed state requested: ${String(event.pressed)}.`);
        }}
        toggleable
      >
        Pin record
      </Button>
      <Button
        onPressedChange={(event) => {
          setLocked(event.pressed);
        }}
        pressed={locked}
        toggleable
        tone="accent"
      >
        {locked ? 'Cancelling toggles' : 'Allowing toggles'}
      </Button>
      <output aria-live="polite">{log}</output>
    </>
  );
}
