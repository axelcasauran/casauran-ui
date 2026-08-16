import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function VariantsExample() {
  // One symbol, three drawings. Each variant is its own geometry, not a restyle of one path.
  const beacon: SVGIconDefinition = {
    name: 'beacon',
    paths: [{ d: 'M12 4 21 20H3z', strokeWidth: 2.2 }, 'M12 11v4'],
    variants: {
      solid: [{ d: 'M12 4 21 20H3z', paint: 'fill' }],
      outline: [{ d: 'M12 4 21 20H3z', strokeWidth: 1.2 }],
      duotone: [
        { d: 'M12 4 21 20H3z', paint: 'fill', opacity: 0.3 },
        { d: 'M12 10v5', strokeWidth: 2.4 },
      ],
    },
  };

  return (
    <>
      <span className="docs-icon-swatch">
        <SVGIcon icon={beacon} size="2xl" variant="solid" />
        <code>solid</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={beacon} size="2xl" variant="outline" />
        <code>outline</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={beacon} size="2xl" variant="duotone" />
        <code>duotone</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={beacon} size="2xl" />
        <code>default</code>
      </span>
    </>
  );
}
