import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateCollectionEngine } from './collection-engine.mjs';

const contract = json('registry/collections/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateCollectionEngine(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/collections/package.json');
if (manifest.name !== '@casauran-internal/collections' || manifest.private !== true) {
  errors.push('collection package must remain internal and private');
}
if (manifest.dependencies !== undefined || manifest.peerDependencies !== undefined) {
  errors.push('collection package must remain runtime dependency-free');
}
if (manifest.sideEffects !== false) errors.push('collection package must remain side-effect-free');

for (const source of files('packages/collections/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (
    text.includes("'use client'") ||
    /from ['"]react['"]/u.test(text) ||
    /\b(?:window|document|navigator|localStorage|sessionStorage)\b/u.test(text)
  ) {
    errors.push(`${source} must remain framework-neutral and server-safe`);
  }
}

for (const capabilityName of ['collections', 'selection']) {
  const capability = json(`registry/capabilities/${capabilityName}.json`);
  if (capability.status !== 'implemented' || capability.owner !== 'packages/collections') {
    errors.push(`${capabilityName} capability must be implemented by packages/collections`);
  }
}
for (const platformName of ['accessibility', 'data-binding']) {
  const platform = json(`registry/platform/${platformName}.json`);
  if (platform.status !== 'unreviewed') {
    errors.push(`F0.09 must not advance reference-derived ${platformName} parity`);
  }
}
const overlay = json('registry/capabilities/overlay.json');
if (overlay.owner !== 'packages/overlay' || !['planned', 'implemented'].includes(overlay.status)) {
  errors.push('overlay capability ownership or lifecycle is invalid');
}

const specification = read('specs/foundation/collection-engine.md');
for (const heading of [
  '## Scope and ownership',
  '## Identity and immutable snapshots',
  '## Registration lifecycle',
  '## Active item movement',
  '## Selection model',
  '## Tree visibility',
  '## Typeahead',
  '## Accessibility and interaction requirements',
  '## SSR, security, and performance',
  '## Compatibility and integration',
  '## F0.10 boundary',
]) {
  if (!specification.includes(heading))
    errors.push(`Collection engine specification missing ${heading}`);
}

const unitTest = read('tests/unit/collection-engine.test.ts');
for (const marker of [
  'CSN_COLLECTION_DUPLICATE_KEY',
  'CSN_COLLECTION_PARENT_CYCLE',
  '10000',
  '<script>alert(1)</script>',
]) {
  if (!unitTest.includes(marker)) errors.push(`Collection engine unit evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/collection-engine/page.tsx');
if (!fixture.includes('@casauran-internal/collections')) {
  errors.push('Collection engine production fixture must import the package root');
}
const browserTest = read('tests/browser/collection-engine.spec.ts');
for (const marker of [
  'production SSR',
  'Visible collection keys',
  'selected-keys',
  'typeahead-match',
]) {
  if (!browserTest.includes(marker))
    errors.push(`Collection engine browser evidence missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.capabilities.length} collection engine capabilities with SSR and large-data evidence`,
  );
}
