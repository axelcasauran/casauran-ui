import { Typography } from '@casauran/react';

export function WeightsExample() {
  return (
    <>
      <Typography weight="regular">Regular</Typography>
      <Typography weight="medium">Medium</Typography>
      <Typography weight="semibold">Semibold</Typography>
      <Typography weight="bold">Bold</Typography>
      {/* An override is independent of the role that supplied the default. */}
      <Typography as="h3" weight="regular">
        A heading deliberately set at regular weight
      </Typography>
    </>
  );
}
