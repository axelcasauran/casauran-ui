import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function VariantFallbackExample() {
  // This definition ships only `solid`. Asking for another variant is not an error: the default
  // drawing renders and `data-variant` reports `default`, so the fallback is observable.
  const shield: SVGIconDefinition = {
    name: 'shield',
    paths: ['M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z'],
    variants: {
      solid: [{ d: 'M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z', paint: 'fill' }],
    },
  };

  return (
    <>
      <span className="docs-icon-swatch">
        <SVGIcon icon={shield} size="2xl" variant="solid" />
        <code>solid — shipped</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={shield} size="2xl" variant="duotone" />
        <code>duotone — falls back</code>
      </span>
    </>
  );
}
