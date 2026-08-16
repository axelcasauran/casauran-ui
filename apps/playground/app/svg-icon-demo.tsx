import { getIconDefinition, isSVGIconDefinition } from '@casauran/icons';
import { Button, SVGIcon, type SVGIconDefinition } from '@casauran/react';

/** Caller-owned artwork: authored here rather than resolved from the Casauran catalog. */
const bolt: SVGIconDefinition = {
  name: 'bolt',
  paths: ['M13 3 5 14h6l-1 7 8-11h-6z'],
};

const beacon: SVGIconDefinition = {
  name: 'beacon',
  viewBox: '0 0 32 32',
  paths: [{ d: 'M16 5 27 27H5z', strokeWidth: 2.2 }, 'M16 14v6'],
  variants: {
    solid: [{ d: 'M16 5 27 27H5z', paint: 'fill' }],
    duotone: [
      { d: 'M16 5 27 27H5z', paint: 'fill', opacity: 0.3 },
      { d: 'M16 13v7', strokeWidth: 2.4 },
    ],
  },
};

/** Stands in for a definition arriving from a CMS row, a JSON payload, or a build step. */
const untrusted: unknown = { name: 'from-data', paths: [{ d: 'M4 20 20 4M4 4l16 16' }] };

export function SVGIconDemo() {
  return (
    <section aria-labelledby="svg-icon-demo-heading">
      <h2 id="svg-icon-demo-heading">SVGIcon playground</h2>
      <p>
        <SVGIcon icon={bolt} label="Run now" tone="accent" /> Caller-owned artwork with an explicit
        semantic label.
      </p>
      <p>
        <SVGIcon icon={beacon} variant="solid" /> <SVGIcon icon={beacon} variant="duotone" />{' '}
        <SVGIcon icon={beacon} variant="outline" /> Solid and duotone are shipped by this
        definition; <code>outline</code> is not, so it falls back to the default drawing.
      </p>
      <p style={{ color: 'rebeccapurple' }}>
        <SVGIcon icon={bolt} /> The default <code>inherit</code> tone follows the surrounding
        colour.
      </p>
      <p>
        <SVGIcon icon={getIconDefinition('home') ?? bolt} /> A Casauran catalog definition renders
        through the caller-owned surface unchanged.
      </p>
      <p>
        {isSVGIconDefinition(untrusted) ? <SVGIcon icon={untrusted} tone="critical" /> : null} A
        definition from an untyped source is narrowed with <code>isSVGIconDefinition</code> before
        it is rendered.
      </p>
      <p>
        <Button startContent={<SVGIcon icon={bolt} />} tone="accent">
          Composed into Button
        </Button>
      </p>
    </section>
  );
}
