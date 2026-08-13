import { read, files, fail, pass } from './lib.mjs';
const required = {
  'AGENTS.md': 100,
  'ARCHITECTURE.md': 100,
  'PARITY_DEFINITION.md': 8,
  'KENDO_REFERENCE_POLICY.md': 10,
  'DEPENDENCY_POLICY.md': 6,
  'API_GOVERNANCE.md': 8,
  'SECURITY_ARCHITECTURE.md': 6,
  '.agent/PROMPT_PLAN.md': 20,
};
for (const [p, min] of Object.entries(required)) {
  const n = read(p).split(/\r?\n/).length;
  if (n < min) fail(`${p}: ${n} lines; expected >= ${min}`);
}
for (const p of files('skills').filter((p) => p.endsWith('/SKILL.md'))) {
  const n = read(p).split(/\r?\n/).length;
  if (n < 35) fail(`${p}: skill too shallow (${n})`);
}
for (const p of files('.agent/workflows').filter((p) => p.endsWith('.md'))) {
  const n = read(p).split(/\r?\n/).length;
  if (n < 20) fail(`${p}: workflow too shallow (${n})`);
}
pass('governance, skills and workflows meet substantive-depth gates');
