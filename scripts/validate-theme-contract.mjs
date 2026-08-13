import { exists, fail, json, pass, read } from './lib.mjs';
import { renderThemeCss, validateThemeContract } from './theme-contract.mjs';

const contract = json('registry/themes/foundation.json');
const tokens = json('registry/tokens/foundation.json');
const errors = validateThemeContract(contract, tokens, exists);

if (
  read('packages/theme/src/theme.css').replaceAll('\r\n', '\n') !== renderThemeCss(contract, tokens)
) {
  errors.push('generated theme CSS is stale; run pnpm generate:theme');
}

const manifest = json('packages/theme/package.json');
if (manifest.name !== '@casauran/theme' || manifest.private === true) {
  errors.push('@casauran/theme must remain a supported public package');
}
if (manifest.dependencies !== undefined || manifest.peerDependencies !== undefined) {
  errors.push('@casauran/theme must remain runtime dependency-free');
}
if (manifest.exports?.['./theme.css'] !== './src/theme.css') {
  errors.push('@casauran/theme must expose its static stylesheet');
}
if (!manifest.sideEffects?.includes('**/*.css'))
  errors.push('theme CSS must be retained as a side effect');

const capability = json('registry/capabilities/theming.json');
if (capability.owner !== 'packages/theme' || capability.status !== 'implemented') {
  errors.push('theming capability must be implemented and owned by packages/theme');
}

const specification = read('specs/foundation/css-theme-runtime.md');
for (const heading of [
  '## Scope and ownership',
  '## Theme and density contract',
  '## Public API and CSS imports',
  '## Cascade, RTL, and portals',
  '## Accessibility and visual behavior',
  '## SSR, security, and performance',
  '## Compatibility and overrides',
  '## F0.07 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`theme specification missing ${heading}`);
}

const browserTest = read('tests/browser/theme-runtime.spec.ts');
for (const marker of [
  'data-theme',
  'data-density',
  'prefers-reduced-motion',
  'forced-colors',
  'dir',
]) {
  if (!browserTest.includes(marker)) errors.push(`theme browser evidence missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.themes.length} themes, ${contract.densities.length} densities and adaptive media contracts`,
  );
}
