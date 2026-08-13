import { files, json, fail, pass } from './lib.mjs';

const entries = files('registry/platform')
  .filter((p) => p.endsWith('.json'))
  .map(json);
const names = new Set(entries.map((e) => e.name));
const required = [
  'accessibility',
  'cloud-integration',
  'data-binding',
  'third-party-integration',
  'security',
  'server-capabilities',
  'styling',
  'internationalization',
  'date-math',
  'migration',
  'troubleshooting',
  'ai-components',
  'ai-tools',
  'web-ai-tooling',
  'project-setup',
];
let ok = true;
for (const name of required) {
  if (!names.has(name)) {
    fail(`missing platform parity domain ${name}`);
    ok = false;
  }
}
if (entries.length !== required.length) {
  fail(`expected ${required.length} platform parity entries, got ${entries.length}`);
  ok = false;
}
for (const e of entries) {
  if (e.referenceCommit !== '6a05c926c4f08b89782c25336fc159fea3a3f26b') {
    fail(`${e.name}: platform reference commit drift`);
    ok = false;
  }
  if (
    ![
      'unreviewed',
      'reference-analyzed',
      'specified',
      'implemented',
      'tested',
      'documented',
      'parity-verified',
      'improved',
    ].includes(e.status)
  ) {
    fail(`${e.name}: invalid status ${e.status}`);
    ok = false;
  }
}
if (ok) pass('15 platform parity registry domains pinned to baseline');
