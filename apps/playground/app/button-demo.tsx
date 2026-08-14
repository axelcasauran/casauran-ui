'use client';

import { Button } from '@casauran/react';
import { useState } from 'react';

export function ButtonDemo() {
  const [pressed, setPressed] = useState(false);

  return (
    <section aria-labelledby="button-demo-heading">
      <h2 id="button-demo-heading">Button playground</h2>
      <Button
        appearance="solid"
        onPressedChange={(event) => {
          setPressed(event.pressed);
        }}
        pressed={pressed}
        startContent="★"
        toggleable
        tone="accent"
      >
        {pressed ? 'Pinned' : 'Pin'}
      </Button>
    </section>
  );
}
