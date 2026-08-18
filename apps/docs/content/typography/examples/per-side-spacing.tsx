import { Typography } from '@casauran/react';

export function PerSideSpacingExample() {
  return (
    <>
      {/* Sides are logical, so the same declaration is correct in both directions. */}
      <Typography as="h3" spacing={{ blockEnd: 'xs', blockStart: 'xl' }}>
        A heading with room above it and little below
      </Typography>
      <Typography>The paragraph that heading introduces.</Typography>
      <Typography spacing={{ blockStart: 'md', inlineStart: 'lg' }} variant="quote">
        An indented quotation: the inline-start step indents it from the reading edge.
      </Typography>
      {/* An omitted side gets no margin; it is not inherited from the shorthand. */}
      <Typography spacing={{ blockEnd: 'lg' }} tone="muted" variant="caption">
        Metadata with space below it only.
      </Typography>
    </>
  );
}
