import { Button } from '@casauran/react';

export function TonesExample() {
  return (
    <>
      <Button appearance="solid" tone="neutral">
        Neutral
      </Button>
      <Button appearance="solid" tone="accent">
        Accent
      </Button>
      <Button appearance="solid" tone="positive">
        Positive
      </Button>
      <Button appearance="solid" tone="caution">
        Caution
      </Button>
      <Button appearance="solid" tone="critical">
        Critical
      </Button>
      <Button appearance="solid" tone="inverse">
        Inverse
      </Button>
    </>
  );
}
