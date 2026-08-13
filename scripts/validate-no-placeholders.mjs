import { files, read, fail, pass } from './lib.mjs';
const governed = [
  'AGENTS.md',
  'ARCHITECTURE.md',
  'PARITY_DEFINITION.md',
  'DEPENDENCY_POLICY.md',
  'KENDO_REFERENCE_POLICY.md',
  ...files('skills').filter((p) => p.endsWith('.md')),
  ...files('.agent/workflows').filter((p) => p.endsWith('.md')),
];
const bad = [
  /\blorem ipsum\b/i,
  /\bTBD\b/,
  /\bFIXME\b/,
  /placeholder content/i,
  /enterprise implementation skill\.?$/im,
];
for (const p of governed) {
  for (const rx of bad) if (rx.test(read(p))) fail(`${p}: placeholder marker ${rx}`);
}
pass('governance/skills/workflows contain no placeholder markers');
