import { Button, Typography } from '@casauran/react';

export function CompositionExample() {
  return (
    <>
      <Button tone="accent">
        <Typography as="span" variant="body-small">
          A composed label
        </Typography>
      </Button>
      <Typography as="p" spacing={{ blockStart: 'sm' }} tone="muted" variant="caption">
        Typography renders text inside another component&apos;s slot; it never owns the interaction.
      </Typography>
    </>
  );
}
