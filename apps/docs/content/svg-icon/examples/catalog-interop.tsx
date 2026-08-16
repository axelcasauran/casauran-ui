import { getIconDefinition } from '@casauran/icons';
import { Icon, SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function CatalogInteropExample() {
  // A catalog definition is structurally an SVGIconDefinition, so one contract serves both
  // components and the same drawing renders identically through either.
  const home = getIconDefinition('home') as SVGIconDefinition;

  return (
    <>
      <span className="docs-icon-swatch">
        <Icon name="home" size="2xl" />
        <code>Icon name</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={home} size="2xl" />
        <code>SVGIcon icon</code>
      </span>
    </>
  );
}
