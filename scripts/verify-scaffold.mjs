import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contract = JSON.parse(
  readFileSync(path.join(root, '.agent/mechanical-governance.json'), 'utf8'),
);
const mandatoryValidator = 'scripts/validate-mechanical-governance.mjs';
const scripts = [
  ...new Set([mandatoryValidator, ...contract.validators.map((validator) => validator.script)]),
];
let failed = false;
for (const script of scripts) {
  const r = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) failed = true;
}
if (failed) process.exit(1);
console.log(`PASS: scaffold governance verification complete (${scripts.length} validators)`);
