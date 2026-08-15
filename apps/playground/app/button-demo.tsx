'use client';

import { Button, type ButtonSize, Icon } from '@casauran/react';
import { useState } from 'react';

const sizes: readonly ButtonSize[] = ['xs', 'sm', 'md', 'lg'];

export function ButtonDemo() {
  const [pressed, setPressed] = useState(false);
  const [cancelToggle, setCancelToggle] = useState(false);

  return (
    <section aria-labelledby="button-demo-heading">
      <h2 id="button-demo-heading">Button playground</h2>
      <Button
        appearance="solid"
        onPressedChange={(event) => {
          setPressed(event.pressed);
        }}
        pressed={pressed}
        startContent={<Icon name="add" />}
        toggleable
        tone="accent"
      >
        {pressed ? 'Pinned' : 'Pin'}
      </Button>

      <h3>Size scale and icon-only geometry</h3>
      {sizes.map((size) => (
        <Button aria-label={`Search ${size}`} iconOnly key={size} size={size}>
          <Icon name="search" />
        </Button>
      ))}

      <h3>Cancellable activation</h3>
      <Button
        onClick={(event) => {
          if (cancelToggle) event.preventDefault();
        }}
        toggleable
      >
        Toggle me
      </Button>
      <Button
        onPressedChange={(event) => {
          setCancelToggle(event.pressed);
        }}
        toggleable
      >
        {cancelToggle ? 'Cancelling toggles' : 'Allowing toggles'}
      </Button>
    </section>
  );
}
