import { Typography } from '@casauran/react';

export function TypeRampExample() {
  return (
    <>
      <Typography variant="display">Display</Typography>
      <Typography variant="title">Title</Typography>
      <Typography variant="heading">Heading</Typography>
      <Typography variant="subheading">Subheading</Typography>
      <Typography variant="body">Body — the default role.</Typography>
      <Typography variant="body-small">Body small — dense supporting prose.</Typography>
      <Typography variant="caption">Caption — metadata beneath a block.</Typography>
      <Typography transform="uppercase" variant="overline">
        Overline
      </Typography>
      <Typography variant="code">inline code</Typography>
      <Typography variant="code-block">{'const total = rows.length;'}</Typography>
      <Typography variant="quote">A quotation keeps its own rule and rhythm.</Typography>
    </>
  );
}
