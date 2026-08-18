import { Typography } from '@casauran/react';

export function HeadingLevelsExample() {
  return (
    <>
      {/* A heading exists only where the caller asks for a heading element. */}
      <Typography as="h2" variant="heading">
        Billing
      </Typography>
      <Typography as="h3" variant="subheading">
        Payment methods
      </Typography>

      {/* Needing smaller text never means reaching for a deeper level. */}
      <Typography as="h3" variant="caption">
        Archived methods
      </Typography>

      {/* And a large label that is not part of the outline stays a paragraph. */}
      <Typography variant="display">£12,480</Typography>
      <Typography tone="muted" variant="caption">
        Outstanding this month
      </Typography>
    </>
  );
}
