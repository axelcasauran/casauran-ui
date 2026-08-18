import { Typography } from '@casauran/react';

export function StructureAndStyleExample() {
  return (
    <>
      {/* Neither prop: a paragraph with body type. */}
      <Typography>A paragraph with the default body role.</Typography>

      {/* Only the element: the role follows it, so the common case stays one prop. */}
      <Typography as="h3">A level-three heading, sized as one</Typography>

      {/* Only the role: the element stays a paragraph, because a size is not an outline. */}
      <Typography variant="title">Title type, still a paragraph</Typography>

      {/* Both: the outline and the size are decided independently. */}
      <Typography as="h2" variant="display">
        A level-two heading at display size
      </Typography>
      <Typography as="h2" variant="caption">
        A level-two heading at caption size
      </Typography>
    </>
  );
}
