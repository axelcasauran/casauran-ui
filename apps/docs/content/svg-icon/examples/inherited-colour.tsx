import { Button, SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function InheritedColourExample() {
  const bolt: SVGIconDefinition = { name: 'bolt', paths: ['M13 3 5 14h6l-1 7 8-11h-6z'] };

  return (
    <>
      <span className="docs-icon-inline" style={{ color: 'var(--csn-status-danger)' }}>
        <SVGIcon icon={bolt} /> Takes the surrounding text colour
      </span>
      <Button startContent={<SVGIcon icon={bolt} />} tone="accent">
        And a solid control&apos;s foreground
      </Button>
    </>
  );
}
