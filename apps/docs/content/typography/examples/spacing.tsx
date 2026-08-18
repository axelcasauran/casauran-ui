import { Typography } from '@casauran/react';

export function SpacingExample() {
  return (
    <>
      {/* A shorthand step applies to both block sides — the vertical rhythm of the block. */}
      <Typography spacing="none">No margin at all</Typography>
      <Typography spacing="xs">Extra small block spacing</Typography>
      <Typography spacing="sm">Small block spacing</Typography>
      <Typography spacing="md">Medium block spacing</Typography>
      <Typography spacing="lg">Large block spacing</Typography>
      <Typography spacing="xl">Extra large block spacing</Typography>
    </>
  );
}
