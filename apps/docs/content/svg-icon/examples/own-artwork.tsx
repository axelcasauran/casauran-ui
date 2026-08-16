import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function OwnArtworkExample() {
  // The definition is data the application owns. It can live in a module, come from a build step,
  // or arrive as JSON — nothing about it is markup.
  const bolt: SVGIconDefinition = {
    name: 'bolt',
    paths: ['M13 3 5 14h6l-1 7 8-11h-6z'],
  };

  return (
    <>
      <span className="docs-icon-swatch">
        <SVGIcon icon={bolt} size="2xl" />
        <code>bolt</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={bolt} size="2xl" tone="accent" />
        <code>tone=&quot;accent&quot;</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={bolt} label="Run now" size="2xl" tone="positive" />
        <code>label</code>
      </span>
    </>
  );
}
