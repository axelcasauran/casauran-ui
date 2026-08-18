import { Typography } from '@casauran/react';

export function AlignmentExample() {
  return (
    <>
      <Typography align="start">Start — the reading edge, whatever the direction.</Typography>
      <Typography align="center">Centre</Typography>
      <Typography align="end">End — the trailing edge, whatever the direction.</Typography>
      <Typography align="justify">
        Justified text stretches each line to both edges of its container, so the block forms an
        even rectangle of prose rather than a ragged one.
      </Typography>
      {/* The same markup in a right-to-left passage: `start` follows the direction. */}
      <div dir="rtl">
        <Typography align="start">تتبع المحاذاة المنطقية اتجاه النص.</Typography>
      </div>
    </>
  );
}
