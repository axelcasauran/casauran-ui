import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function DirectionExample() {
  const flag: SVGIconDefinition = { name: 'flag', paths: ['M6 21V4M6 4h11l-2.5 4L17 12H6'] };

  return (
    <>
      <span className="docs-icon-swatch">
        <SVGIcon flip="none" icon={flag} size="xl" />
        <code>none</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon flip="horizontal" icon={flag} size="xl" />
        <code>horizontal</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon flip="vertical" icon={flag} size="xl" />
        <code>vertical</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon flip="both" icon={flag} size="xl" />
        <code>both</code>
      </span>
    </>
  );
}
