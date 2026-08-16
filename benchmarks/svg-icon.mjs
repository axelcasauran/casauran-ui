import { performance } from 'node:perf_hooks';

import { SVGIcon } from '../packages/react/dist/index.js';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const CEILING_MS = 500;
const RENDERS = 1_000;

// A caller-owned three-layer definition with two variants: the scenario has to pay for definition
// validation, variant resolution, and per-layer rendering, which is what separates this component
// from the named-catalog one.
const definition = {
  name: 'beacon',
  viewBox: '0 0 32 32',
  paths: [
    { d: 'M16 5 27 27H5z', strokeWidth: 2.2 },
    { d: 'M16 14v6', opacity: 0.55 },
    { d: 'M11 22h10', paint: 'fill', fillRule: 'evenodd' },
  ],
  variants: {
    solid: [{ d: 'M16 5 27 27H5z', paint: 'fill' }],
    duotone: [
      { d: 'M16 5 27 27H5z', paint: 'fill', opacity: 0.3 },
      { d: 'M16 13v7', strokeWidth: 2.4 },
    ],
  },
};

// Alternating a shipped variant with an absent one exercises both resolution and the fallback path.
const variants = ['solid', 'duotone', 'outline'];

const start = performance.now();
for (let index = 0; index < RENDERS; index += 1) {
  renderToString(createElement(SVGIcon, { icon: definition, variant: variants[index % 3] }));
}
const elapsed = performance.now() - start;

// The environment is part of the measurement. A timing without its runtime and platform is an
// unqualified claim, which PERFORMANCE_POLICY.md prohibits.
const environment = `Node ${process.version}, ${process.platform} ${process.arch}`;
if (elapsed > CEILING_MS) {
  throw new Error(
    `SVGIcon SSR benchmark exceeded ${CEILING_MS} ms: ${elapsed.toFixed(2)} ms (${environment})`,
  );
}
console.log(
  `SVGIcon SSR: ${elapsed.toFixed(2)} ms for ${RENDERS.toLocaleString('en-US')} caller-owned ` +
    `multi-layer icons against a ${CEILING_MS} ms ceiling (${environment})`,
);
