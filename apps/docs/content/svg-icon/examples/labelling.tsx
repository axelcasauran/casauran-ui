import { SVGIcon, type SVGIconDefinition } from '@casauran/react';

export function LabellingExample() {
  const beacon: SVGIconDefinition = { name: 'beacon', paths: ['M12 4 21 20H3z', 'M12 11v4'] };

  return (
    <>
      <span className="docs-icon-inline">
        <SVGIcon icon={beacon} /> Decorative by default: hidden from assistive technology, because
        the sentence beside it already carries the meaning.
      </span>
      <span className="docs-icon-inline">
        <SVGIcon icon={beacon} label="Signal strength" /> Labelled: exposed as an image named
        &ldquo;Signal strength&rdquo;, for artwork that is the only carrier of its meaning.
      </span>
    </>
  );
}
