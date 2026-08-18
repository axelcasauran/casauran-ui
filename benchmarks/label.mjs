import { performance } from 'node:perf_hooks';

import { Label } from '../packages/react/dist/index.js';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const CEILING_MS = 500;
const RENDERS = 5_000;

// A form of fifty fields renders fifty captions, so server rendering is the scenario that matters.
// The cycles below make each render pay for a different path: no marker, each marker with its
// text, the invalid and disabled reflections, and the empty caption.
const requirements = ['none', 'optional', 'required'];
const markerText = ['', '(optional)', '(required)'];
const captions = ['Email address', 'Full name', null, 'Product code'];

const start = performance.now();
for (let index = 0; index < RENDERS; index += 1) {
  const slot = index % requirements.length;
  renderToString(
    createElement(
      Label,
      {
        disabled: index % 5 === 0,
        htmlFor: `field-${String(index)}`,
        invalid: index % 3 === 0,
        ...(slot === 0
          ? { requirement: 'none' }
          : { requirement: requirements[slot], requirementText: markerText[slot] }),
      },
      captions[index % captions.length],
    ),
  );
}
const elapsed = performance.now() - start;

// The environment is part of the measurement. A timing without its runtime and platform is an
// unqualified claim, which PERFORMANCE_POLICY.md prohibits.
const environment = `Node ${process.version}, ${process.platform} ${process.arch}`;
if (elapsed > CEILING_MS) {
  throw new Error(
    `Label SSR benchmark exceeded ${CEILING_MS} ms: ${elapsed.toFixed(2)} ms (${environment})`,
  );
}
console.log(
  `Label SSR: ${elapsed.toFixed(2)} ms for ${RENDERS.toLocaleString('en-US')} form captions ` +
    `against a ${CEILING_MS} ms ceiling (${environment})`,
);
