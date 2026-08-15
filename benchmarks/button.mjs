import { performance } from 'node:perf_hooks';

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { Button } from '../packages/react/dist/index.js';

const count = 1_000;
const renderButtons = (pressed) =>
  renderToString(
    createElement(
      'div',
      null,
      ...Array.from({ length: count }, (_, index) =>
        createElement(
          Button,
          {
            key: index,
            pressed,
            toggleable: true,
            tone: index % 2 === 0 ? 'accent' : 'neutral',
          },
          `Action ${index}`,
        ),
      ),
    ),
  );

const started = performance.now();
const initialMarkup = renderButtons(false);
const updatedMarkup = renderButtons(true);
const elapsed = performance.now() - started;

if (
  !initialMarkup.includes('aria-pressed="false"') ||
  !updatedMarkup.includes('aria-pressed="true"')
) {
  throw new Error('Button benchmark produced invalid state markup.');
}
if (elapsed > 1_000) {
  throw new Error(`Button benchmark exceeded 1,000ms: ${elapsed.toFixed(2)}ms.`);
}

console.log(
  `PASS: ${count} initial and updated Button SSR projections in ${elapsed.toFixed(2)}ms (Node ${process.version}, ${process.platform} ${process.arch})`,
);
