import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function LayersExample() {
  // A drawing is an ordered list of layers. A bare string is stroked geometry with the platform
  // defaults; an object adds paint, weight, fill rule and opacity — the whole vocabulary.
  const stamp: SVGIconDefinition = {
    name: 'stamp',
    paths: [
      { d: 'M4 4h16v16H4zM9 9h6v6H9z', paint: 'fill', fillRule: 'evenodd' },
      { d: 'M12 1v2M12 21v2', strokeWidth: 2.6 },
      { d: 'M2 12h2M20 12h2', opacity: 0.45 },
    ],
  };

  return (
    <>
      <span className="docs-icon-swatch">
        <SVGIcon icon={stamp} size="3xl" tone="accent" />
        <code>paint, weight, opacity</code>
      </span>
      <span className="docs-icon-inline">
        A filled layer paints its interior and clears its stroke; an even-odd rule cuts the hole.
      </span>
    </>
  );
}
