import { Typography } from '@casauran/react';

export function CasingExample() {
  return (
    <>
      <Typography transform="none">Casing untouched</Typography>
      <Typography transform="uppercase">Uppercased visually</Typography>
      <Typography transform="lowercase">LOWERCASED VISUALLY</Typography>
      <Typography transform="capitalize">capitalized visually</Typography>
    </>
  );
}
