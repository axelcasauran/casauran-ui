import { performance } from 'node:perf_hooks';

import {
  calculateAutoScrollDelta,
  createDropTargetRegistry,
} from '../packages/drag-drop/dist/index.js';

const targetCount = 2_000;
const collisionQueries = 5_000;
const autoscrollQueries = 50_000;
const ceilingMilliseconds = 5_000;

const registry = createDropTargetRegistry();
for (let index = 0; index < targetCount; index += 1) {
  const column = index % 50;
  const row = Math.floor(index / 50);
  registry.register({
    id: index,
    data: index,
    rect: () => ({ x: column * 20, y: row * 20, width: 18, height: 18 }),
  });
}

let checksum = 0;
const start = performance.now();
for (let index = 0; index < collisionQueries; index += 1) {
  const target = registry.resolve({
    payload: index,
    point: { x: (index % 50) * 20 + 9, y: (index % 40) * 20 + 9 },
  });
  checksum += target?.data ?? 0;
}
for (let index = 0; index < autoscrollQueries; index += 1) {
  const delta = calculateAutoScrollDelta({
    point: { x: index % 2 === 0 ? 1 : 399, y: index % 3 === 0 ? 1 : 299 },
    rect: { x: 0, y: 0, width: 400, height: 300 },
    metrics: {
      scrollLeft: 500,
      scrollTop: 1_000,
      scrollWidth: 2_000,
      scrollHeight: 5_000,
      clientWidth: 400,
      clientHeight: 300,
    },
    edgeThreshold: 48,
    maxSpeed: 1_200,
    elapsedMilliseconds: 1000 / 60,
  });
  checksum += Math.abs(delta.x) + Math.abs(delta.y);
}
const elapsedMilliseconds = performance.now() - start;
if (checksum <= 0) throw new Error('drag-drop benchmark checksum was not exercised');
console.log(
  JSON.stringify({
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    targetCount,
    collisionQueries,
    autoscrollQueries,
    elapsedMilliseconds: Number(elapsedMilliseconds.toFixed(2)),
    ceilingMilliseconds,
  }),
);
if (elapsedMilliseconds > ceilingMilliseconds) {
  throw new Error(
    `drag-drop benchmark exceeded ${String(ceilingMilliseconds)} ms: ${elapsedMilliseconds.toFixed(2)} ms`,
  );
}
