import { isSVGIconDefinition } from '@casauran/icons';
import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function RuntimeDefinitionsExample() {
  // A definition that arrived from outside the type system: a CMS row, a JSON payload, an upload.
  const fromData: unknown = { name: 'spark', paths: [{ d: 'M12 3v18M3 12h18', strokeWidth: 2 }] };
  const rejected: unknown = { name: 'broken', paths: 'M12 3v18' };
  const fallback: SVGIconDefinition = { name: 'placeholder', paths: ['M5 12h14'] };

  return (
    <>
      <span className="docs-icon-swatch">
        <SVGIcon icon={isSVGIconDefinition(fromData) ? fromData : fallback} size="2xl" />
        <code>narrowed</code>
      </span>
      <span className="docs-icon-swatch">
        <SVGIcon icon={isSVGIconDefinition(rejected) ? rejected : fallback} size="2xl" />
        <code>rejected → fallback</code>
      </span>
    </>
  );
}
