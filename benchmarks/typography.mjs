import { performance } from 'node:perf_hooks';

import { Typography } from '../packages/react/dist/index.js';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const CEILING_MS = 500;
const RENDERS = 5_000;

// Text is the component a page uses at the highest volume, so the scenario is server rendering.
// The cycles below make each render pay for a different resolution path: an element with a derived
// role, a role with a derived element, both given, an explicit size and weight override, and both
// spacing forms — so no single fast path can carry the measurement.
const elements = ['h2', 'p', 'span', 'code', 'blockquote'];
const variants = [undefined, 'display', 'body-small', 'caption', 'code-block'];
const tones = ['inherit', 'muted', 'accent', 'critical'];
const spacings = [undefined, 'md', { blockEnd: 'sm', blockStart: 'lg', inlineStart: 'md' }];
const sizes = [undefined, 'sm', '2xl'];

const start = performance.now();
for (let index = 0; index < RENDERS; index += 1) {
  renderToString(
    createElement(
      Typography,
      {
        as: elements[index % elements.length],
        size: sizes[index % sizes.length],
        spacing: spacings[index % spacings.length],
        tone: tones[index % tones.length],
        variant: variants[index % variants.length],
      },
      'Casauran UI',
    ),
  );
}
const elapsed = performance.now() - start;

// The environment is part of the measurement. A timing without its runtime and platform is an
// unqualified claim, which PERFORMANCE_POLICY.md prohibits.
const environment = `Node ${process.version}, ${process.platform} ${process.arch}`;
if (elapsed > CEILING_MS) {
  throw new Error(
    `Typography SSR benchmark exceeded ${CEILING_MS} ms: ${elapsed.toFixed(2)} ms (${environment})`,
  );
}
console.log(
  `Typography SSR: ${elapsed.toFixed(2)} ms for ${RENDERS.toLocaleString('en-US')} text elements ` +
    `against a ${CEILING_MS} ms ceiling (${environment})`,
);
