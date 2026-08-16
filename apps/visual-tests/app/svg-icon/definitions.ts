import type { SVGIconDefinition } from '@casauran/react';

/**
 * Caller-owned artwork, authored for this fixture. It is deliberately not part of the
 * `@casauran/icons` catalog: the point of SVGIcon is that an application ships its own drawings.
 */

/** One bare geometry layer — the shorthand form, with every default applied by the component. */
export const bolt: SVGIconDefinition = {
  name: 'bolt',
  paths: ['M13 3 5 14h6l-1 7 8-11h-6z'],
};

/** A directional symbol, so mirroring has something whose orientation is visible. */
export const flag: SVGIconDefinition = {
  name: 'flag',
  paths: ['M6 21V4M6 4h11l-2.5 4L17 12H6'],
};

/** Ships all three governed variants plus a two-layer default drawing. */
export const beacon: SVGIconDefinition = {
  name: 'beacon',
  viewBox: '0 0 32 32',
  paths: [
    { d: 'M16 5 27 27H5z', strokeWidth: 2.2 },
    { d: 'M16 14v6', opacity: 0.55 },
  ],
  variants: {
    solid: [{ d: 'M16 5 27 27H5z', paint: 'fill' }],
    outline: [{ d: 'M16 5 27 27H5z', strokeWidth: 1.4 }],
    duotone: [
      { d: 'M16 5 27 27H5z', paint: 'fill', opacity: 0.3 },
      { d: 'M16 13v7', strokeWidth: 2.4 },
    ],
  },
};

/** Ships only `solid`, so requesting another variant must fall back to the default drawing. */
export const shield: SVGIconDefinition = {
  name: 'shield',
  paths: ['M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z'],
  variants: {
    solid: [{ d: 'M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z', paint: 'fill' }],
  },
};

/** Mixes a filled layer with an even-odd hole and a stroked layer at a heavier weight. */
export const stamp: SVGIconDefinition = {
  name: 'stamp',
  paths: [
    {
      d: 'M4 4h16v16H4zM9 9h6v6H9z',
      paint: 'fill',
      fillRule: 'evenodd',
    },
    { d: 'M12 1v2M12 21v2', strokeWidth: 2.6 },
  ],
};
