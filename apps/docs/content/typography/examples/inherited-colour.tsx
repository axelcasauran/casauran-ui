import { Button, Typography } from '@casauran/react';

export function InheritedColourExample() {
  return (
    <>
      {/* The default tone resolves to `currentColor`, so text takes its context. */}
      <div className="docs-text-context">
        <Typography>This paragraph follows the colour of the block around it.</Typography>
      </div>
      <Button tone="accent">
        <Typography as="span" variant="body-small">
          Text inside a solid action takes that control&apos;s foreground.
        </Typography>
      </Button>
      {/* `default` opts out of inheritance and pins the theme's primary text colour. */}
      <div className="docs-text-context">
        <Typography tone="default">This paragraph does not follow it.</Typography>
      </div>
    </>
  );
}
