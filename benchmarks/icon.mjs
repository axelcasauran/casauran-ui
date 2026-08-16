import { performance } from 'node:perf_hooks';

import { Icon } from '../packages/react/dist/index.js';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const CEILING_MS = 500;
const RENDERS = 1_000;

const start = performance.now();
for (let index = 0; index < RENDERS; index += 1) {
  renderToString(createElement(Icon, { name: index % 2 === 0 ? 'home' : 'search' }));
}
const elapsed = performance.now() - start;

// The environment is part of the measurement. A timing without its runtime and platform is an
// unqualified claim, which PERFORMANCE_POLICY.md prohibits.
const environment = `Node ${process.version}, ${process.platform} ${process.arch}`;
if (elapsed > CEILING_MS) {
  throw new Error(
    `Icon SSR benchmark exceeded ${CEILING_MS} ms: ${elapsed.toFixed(2)} ms (${environment})`,
  );
}
console.log(
  `Icon SSR: ${elapsed.toFixed(2)} ms for ${RENDERS.toLocaleString('en-US')} named icons ` +
    `against a ${CEILING_MS} ms ceiling (${environment})`,
);
