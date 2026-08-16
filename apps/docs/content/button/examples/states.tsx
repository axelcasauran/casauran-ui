'use client';

import { Button } from '@casauran/react';

export function StatesExample() {
  return (
    <>
      <Button disabled>Unavailable</Button>
      <Button defaultPressed toggleable>
        Pinned
      </Button>
      <Button toggleable>Not pinned</Button>
    </>
  );
}
