import { Typography } from '@casauran/react';

export function TonesExample() {
  return (
    <>
      <Typography tone="inherit">Inherit — follows the surrounding colour.</Typography>
      <Typography tone="default">Default — the theme&apos;s primary text colour.</Typography>
      <Typography tone="muted">Muted — de-emphasised supporting text.</Typography>
      <Typography tone="accent">Accent — the single brand ramp.</Typography>
      <Typography tone="positive">Positive — a completed operation.</Typography>
      <Typography tone="caution">Caution — something needs attention.</Typography>
      <Typography tone="critical">Critical — an error the reader must resolve.</Typography>
      <div className="docs-text-inverse">
        <Typography tone="inverse">Inverse — for an inverse surface.</Typography>
      </div>
    </>
  );
}
