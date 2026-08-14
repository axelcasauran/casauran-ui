import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';

import { processData } from '../packages/data/dist/index.js';

const data = Array.from({ length: 100_000 }, (_, id) => ({
  id,
  bucket: id % 10,
  rank: 100_000 - id,
}));
const started = performance.now();
const result = processData(data, {
  filter: { field: 'bucket', operator: 'eq', value: 4 },
  sort: [{ field: 'rank', direction: 'desc' }],
  page: { skip: 100, take: 25 },
});
const elapsed = performance.now() - started;
assert.equal(result.total, 10_000);
assert.equal(result.data[0]?.id, 1004);
assert.ok(elapsed < 5_000, `100,000-row data scenario exceeded 5,000ms: ${elapsed.toFixed(2)}ms`);
console.log(
  `PASS: 100,000-row filter/sort/page in ${elapsed.toFixed(2)}ms on ${process.version} ${process.platform}/${process.arch}`,
);
