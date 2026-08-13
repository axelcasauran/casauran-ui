import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateReactStateFoundation } from './react-state-foundation.mjs';

const contract = json('registry/react-state/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateReactStateFoundation(contract, { sourceExists: exists, sourceTexts });

const coreManifest = json('packages/core/package.json');
if (coreManifest.name !== '@casauran-internal/core' || coreManifest.private !== true) {
  errors.push('core package must remain internal and private');
}
if (coreManifest.dependencies !== undefined || coreManifest.peerDependencies !== undefined) {
  errors.push('core package must remain runtime dependency-free');
}

const reactManifest = json('packages/react/package.json');
if (
  reactManifest.exports?.['./state']?.types !== './dist/state/index.d.ts' ||
  reactManifest.exports?.['./state']?.import !== './dist/state/index.js'
) {
  errors.push('@casauran/react/state supported export is missing');
}
if (reactManifest.peerDependencies?.react !== '^19.2.0') {
  errors.push('React state foundation must use the governed React peer');
}
const runtimeDependencies = Object.keys(reactManifest.dependencies ?? {});
if (runtimeDependencies.some((dependency) => !dependency.startsWith('@casauran-internal/'))) {
  errors.push('React state foundation added an external runtime dependency');
}

const rootIndex = read('packages/react/src/index.ts');
if (rootIndex.includes("'use client'") || rootIndex.includes("'./state")) {
  errors.push('React package root must remain server-safe and must not re-export state hooks');
}
for (const source of files('packages/core/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and server-safe`);
  }
}
for (const source of files('packages/react/src/state').filter((path) => path.endsWith('.ts'))) {
  if (!read(source).startsWith("'use client';")) {
    errors.push(`${source} must declare its local client boundary`);
  }
}

for (const capabilityName of ['state', 'ids']) {
  const capability = json(`registry/capabilities/${capabilityName}.json`);
  if (capability.status !== 'implemented') {
    errors.push(`${capabilityName} capability must be implemented`);
  }
}
const dataBinding = json('registry/platform/data-binding.json');
if (dataBinding.status !== 'unreviewed') {
  errors.push('F0.08 must not claim reference-derived data-binding parity');
}
const collections = json('registry/capabilities/collections.json');
if (
  collections.owner !== 'packages/collections' ||
  !['planned', 'implemented'].includes(collections.status)
) {
  errors.push('collection capability ownership or lifecycle is invalid');
}

const specification = read('specs/foundation/react-state.md');
for (const heading of [
  '## Scope and ownership',
  '## Framework-neutral state resolution',
  '## Controlled and uncontrolled React state',
  '## Committed callbacks',
  '## Hydration and stable IDs',
  '## Accessibility and interaction requirements',
  '## SSR, RSC, security, and performance',
  '## Compatibility and integration',
  '## F0.09 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`React state specification missing ${heading}`);
}

const unitTest = read('tests/unit/react-state-foundation.test.tsx');
for (const marker of ['renderToString', 'isControlledValue(null)', 'data-hydrated', 'exact-id']) {
  if (!unitTest.includes(marker)) errors.push(`React state unit evidence missing ${marker}`);
}
const browserTest = read('tests/browser/react-state-foundation.spec.ts');
for (const marker of [
  'production SSR',
  'data-hydrated',
  'Increment uncontrolled twice',
  'Controlled value',
  'Callback identity stable',
  'generated-id-probe',
]) {
  if (!browserTest.includes(marker)) errors.push(`React state browser evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/react-state-foundation/client-probe.tsx');
if (!fixture.includes('@casauran/react/state')) {
  errors.push('React state production fixture must use the supported state entry point');
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(`${contract.capabilities.length} React state capabilities with SSR and browser evidence`);
}
