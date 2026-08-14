import { performance } from 'node:perf_hooks';

import { Icon } from '../packages/react/dist/index.js';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const start = performance.now();
for (let index = 0; index < 1_000; index += 1) {
  renderToString(createElement(Icon, { name: index % 2 === 0 ? 'home' : 'search' }));
}
const elapsed = performance.now() - start;
if (elapsed > 500) throw new Error(`Icon SSR benchmark exceeded 500 ms: ${elapsed.toFixed(2)} ms`);
console.log(`Icon SSR: ${elapsed.toFixed(2)} ms for 1,000 named icons`);
