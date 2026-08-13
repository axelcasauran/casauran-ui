import { files, json, exists, fail, pass } from './lib.mjs';
const entries = files('registry/components')
  .filter((p) => p.endsWith('.json'))
  .map(json);
const needs = new Set([
  'specified',
  'api-approved',
  'implemented',
  'tested',
  'documented',
  'parity-verified',
  'improved',
]);
for (const e of entries) {
  if (!needs.has(e.status)) continue;
  const direct = `specs/components/${e.slug}.spec.md`;
  const complex = `specs/components/${e.slug}/architecture.md`;
  if (!exists(direct) && !exists(complex)) fail(`${e.name}: ${e.status} requires spec`);
}
pass('spec lifecycle consistency');
