import { Button, SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function CompositionExample() {
  const bolt: SVGIconDefinition = { name: 'bolt', paths: ['M13 3 5 14h6l-1 7 8-11h-6z'] };

  return (
    <>
      <Button startContent={<SVGIcon icon={bolt} />} tone="accent">
        Run now
      </Button>
      <Button endContent={<SVGIcon icon={bolt} />} appearance="outline">
        Trailing artwork
      </Button>
      <Button iconOnly aria-label="Run now" startContent={<SVGIcon icon={bolt} />} tone="accent" />
    </>
  );
}
