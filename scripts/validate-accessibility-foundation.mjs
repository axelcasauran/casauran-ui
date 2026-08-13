import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateAccessibilityFoundation } from './accessibility-foundation.mjs';

const contract = json('registry/accessibility/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateAccessibilityFoundation(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/accessibility/package.json');
if (manifest.name !== '@casauran-internal/accessibility' || manifest.private !== true) {
  errors.push('accessibility package must remain internal and private');
}
if (manifest.dependencies !== undefined || manifest.peerDependencies !== undefined) {
  errors.push('accessibility package must remain runtime dependency-free');
}
if (manifest.sideEffects?.[0] !== '**/*.css') {
  errors.push('accessibility stylesheet must be retained as a side effect');
}
if (manifest.exports?.['./accessibility.css'] !== './src/accessibility.css') {
  errors.push('accessibility package must export its static stylesheet');
}
if (manifest.exports?.['./testing']?.import !== './src/testing.ts') {
  errors.push('accessibility browser fixture source export is missing');
}

for (const capabilityName of ['accessibility', 'focus', 'keyboard']) {
  const capability = json(`registry/capabilities/${capabilityName}.json`);
  if (capability.owner !== 'packages/accessibility' || capability.status !== 'implemented') {
    errors.push(`${capabilityName} capability must be implemented by packages/accessibility`);
  }
}

const platform = json('registry/platform/accessibility.json');
if (platform.status !== 'unreviewed') {
  errors.push('F0.07 must not claim reference-derived platform accessibility parity');
}

const packageSources = files('packages/accessibility/src').filter((source) =>
  source.endsWith('.ts'),
);
for (const source of packageSources) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and server-safe`);
  }
}

const stylesheet = read('packages/accessibility/src/accessibility.css');
for (const marker of [
  '@layer utilities',
  'data-csn-visually-hidden',
  'inline-size: 1px',
  'block-size: 1px',
  'clip-path: inset(50%)',
]) {
  if (!stylesheet.includes(marker)) errors.push(`accessibility stylesheet missing ${marker}`);
}

const specification = read('specs/foundation/accessibility.md');
for (const heading of [
  '## Scope and ownership',
  '## Focus and tabbability',
  '## Roving focus and keyboard',
  '## Live regions and visually hidden content',
  '## Accessibility requirements',
  '## SSR, security, and performance',
  '## Compatibility and integration',
  '## F0.08 boundary',
]) {
  if (!specification.includes(heading))
    errors.push(`accessibility specification missing ${heading}`);
}

const browserTest = read('tests/browser/accessibility-foundation.spec.ts');
for (const marker of [
  'toMatchAriaSnapshot',
  'toBeFocused',
  'isComposing',
  'data-csn-visually-hidden',
  'markup-like text',
]) {
  if (!browserTest.includes(marker))
    errors.push(`accessibility browser evidence missing ${marker}`);
}

const fixtureImports = files('apps')
  .filter((source) => /\.(ts|tsx)$/u.test(source))
  .filter((source) => read(source).includes('@casauran-internal/accessibility/testing'));
if (
  fixtureImports.length !== 1 ||
  fixtureImports[0] !== 'apps/visual-tests/app/accessibility-foundation/client-probe.tsx'
) {
  errors.push('accessibility source export must be restricted to the internal visual-test fixture');
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.capabilities.length} accessibility primitives with unit, SSR and browser evidence`,
  );
}
