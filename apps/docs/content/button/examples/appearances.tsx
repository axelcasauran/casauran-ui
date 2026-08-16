import { Button } from '@casauran/react';

export function AppearancesExample() {
  return (
    <>
      <Button appearance="solid" tone="accent">
        Solid
      </Button>
      <Button appearance="soft" tone="accent">
        Soft
      </Button>
      <Button appearance="outline" tone="accent">
        Outline
      </Button>
      <Button appearance="ghost" tone="accent">
        Ghost
      </Button>
      <Button appearance="link" tone="accent">
        Link
      </Button>
    </>
  );
}
