'use client';

import { Button } from '@casauran/react';
import { useState } from 'react';

export function ControlledToggleExample() {
  const [pinned, setPinned] = useState(false);

  return (
    <>
      <Button
        onPressedChange={(event) => {
          setPinned(event.pressed);
        }}
        pressed={pinned}
        toggleable
      >
        {pinned ? 'Pinned' : 'Pin'}
      </Button>
      <Button
        appearance="outline"
        onClick={() => {
          setPinned(false);
        }}
      >
        Reset from outside
      </Button>
      <output aria-live="polite">Owner state: {pinned ? 'pinned' : 'not pinned'}</output>
    </>
  );
}
