import { Typography } from '@casauran/react';

export function NestingExample() {
  return (
    <Typography as="p">
      A run of prose can carry <Typography as="strong">strong importance</Typography>,{' '}
      <Typography as="em">stressed emphasis</Typography>, and{' '}
      <Typography as="code">inline code</Typography> without any of them leaving the paragraph. A
      nested element with the default tone takes the colour of the passage around it.
    </Typography>
  );
}
