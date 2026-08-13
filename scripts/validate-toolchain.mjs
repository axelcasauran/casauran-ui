import { json, fail, pass } from './lib.mjs';
const p = json('package.json');
const expected = {
  packageManager: 'pnpm@11.17.0',
  typescript: '6.0.3',
  eslint: '10.8.0',
  'typescript-eslint': '8.65.0',
  prettier: '3.9.6',
  vitest: '4.1.0',
  '@playwright/test': '1.62.0',
  '@changesets/cli': '2.31.0',
  'dependency-cruiser': '18.1.0',
};
if (p.packageManager !== expected.packageManager) fail(`packageManager drift: ${p.packageManager}`);
for (const [name, version] of Object.entries(expected)) {
  if (name === 'packageManager') continue;
  if (p.devDependencies?.[name] !== version) fail(`toolchain drift ${name}: ${p.devDependencies?.[name]} expected ${version}`);
}
if (p.engines?.node !== '>=24.18.0 <27') fail(`unexpected Node support range ${p.engines?.node}`);
pass('pinned mutually-supported toolchain snapshot');
