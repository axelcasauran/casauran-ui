import { spawnSync } from 'node:child_process';
const scripts = [
  'validate-local-reference-config.mjs',
  'validate-branding.mjs',
  'validate-registry.mjs',
  'validate-stages.mjs',
  'validate-reference-provenance.mjs',
  'validate-dependencies.mjs',
  'validate-client-boundaries.mjs',
  'validate-doc-depth.mjs',
  'validate-no-placeholders.mjs',
  'validate-specs.mjs',
  'validate-parity.mjs',
  'validate-package-exports.mjs',
  'validate-component-composition.mjs',
  'validate-package-boundaries.mjs',
  'validate-public-api.mjs',
  'validate-toolchain.mjs',
  'validate-platform.mjs',
];
let failed = false;
for (const s of scripts) {
  const r = spawnSync(process.execPath, [`scripts/${s}`], { stdio: 'inherit' });
  if (r.status !== 0) failed = true;
}
if (failed) process.exit(1);
console.log('PASS: scaffold governance verification complete');
