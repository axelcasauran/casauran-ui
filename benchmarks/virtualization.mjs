import { performance } from 'node:perf_hooks';
import process from 'node:process';

import { createVirtualAxis, createVirtualGrid } from '../packages/virtualization/dist/index.js';

const ceilingMilliseconds = 5_000;
const started = performance.now();
const axis = createVirtualAxis({
  count: 100_000,
  estimateSize: 24,
  getKey: (index) => `row-${index}`,
  overscan: 3,
});

let checksum = 0;
for (let iteration = 0; iteration < 20_000; iteration += 1) {
  const offset = (iteration * 7919) % 2_399_000;
  const window = axis.getWindow({ offset, viewportSize: 480, includeIndexes: [0] });
  checksum += window.visibleStartIndex + window.visibleEndIndex + window.items.length;
}

const anchor = { key: 'row-50000' };
for (let batch = 0; batch < 1_000; batch += 1) {
  const index = batch * 50;
  const mutation = axis.measure([{ index, size: 24 + (batch % 5) }], anchor);
  checksum += mutation.scrollAdjustment;
}

const grid = createVirtualGrid({
  rowCount: 100_000,
  columnCount: 10_000,
  estimateRowSize: 24,
  estimateColumnSize: 80,
  rowOverscan: 2,
  columnOverscan: 2,
});
for (let iteration = 0; iteration < 5_000; iteration += 1) {
  const window = grid.getWindow({
    scrollTop: (iteration * 3571) % 2_399_000,
    scrollLeft: (iteration * 1879) % 799_000,
    viewportHeight: 720,
    viewportWidth: 1_280,
  });
  checksum += window.rows.items.length + window.columns.items.length;
}

const durationMilliseconds = performance.now() - started;
const environment = {
  node: process.version,
  platform: process.platform,
  architecture: process.arch,
  rowCount: 100_000,
  columnCount: 10_000,
  axisQueries: 20_000,
  measurementUpdates: 1_000,
  gridQueries: 5_000,
  ceilingMilliseconds,
  durationMilliseconds: Number(durationMilliseconds.toFixed(2)),
  checksum,
};
console.log(JSON.stringify(environment));
if (durationMilliseconds > ceilingMilliseconds) {
  throw new Error(
    `virtualization benchmark exceeded ${String(ceilingMilliseconds)}ms: ${durationMilliseconds.toFixed(2)}ms`,
  );
}
