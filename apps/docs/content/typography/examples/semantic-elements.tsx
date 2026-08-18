import { Typography } from '@casauran/react';

export function SemanticElementsExample() {
  return (
    <>
      <Typography as="h1">Heading level one</Typography>
      <Typography as="h2">Heading level two</Typography>
      <Typography as="h3">Heading level three</Typography>
      <Typography as="h4">Heading level four</Typography>
      <Typography as="h5">Heading level five</Typography>
      <Typography as="h6">Heading level six</Typography>
      <Typography as="p">A paragraph of prose.</Typography>
      <Typography as="div">A block with no paragraph semantics.</Typography>
      <Typography as="blockquote">A quotation from another source.</Typography>
      <Typography as="pre">{'a block of\npreformatted text'}</Typography>
      <p>
        An inline <Typography as="span">span</Typography>, some{' '}
        <Typography as="strong">strong importance</Typography>, some{' '}
        <Typography as="em">stressed emphasis</Typography>, and a bit of{' '}
        <Typography as="code">inline code</Typography>.
      </p>
    </>
  );
}
