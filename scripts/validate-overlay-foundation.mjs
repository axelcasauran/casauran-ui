import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateOverlayFoundation } from './overlay-foundation.mjs';

const contract = json('registry/overlay/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateOverlayFoundation(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/overlay/package.json');
if (manifest.name !== '@casauran-internal/overlay' || manifest.private !== true) {
  errors.push('overlay package must remain internal and private');
}
const dependencies = Object.keys(manifest.dependencies ?? {});
if (
  dependencies.length !== 1 ||
  manifest.dependencies?.['@casauran-internal/accessibility'] !== 'workspace:*' ||
  manifest.peerDependencies !== undefined
) {
  errors.push('overlay package may depend only on the internal accessibility owner');
}
if (manifest.sideEffects !== false) errors.push('overlay package must remain side-effect-free');

for (const source of files('packages/overlay/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and free of a React client boundary`);
  }
  if (/innerHTML|insertAdjacentHTML|dangerouslySetInnerHTML|eval\s*\(/u.test(text)) {
    errors.push(`${source} must not introduce an HTML or dynamic-execution sink`);
  }
}

const overlay = json('registry/capabilities/overlay.json');
if (overlay.status !== 'implemented' || overlay.owner !== 'packages/overlay') {
  errors.push('overlay capability must be implemented by packages/overlay');
}
const positioning = json('registry/capabilities/positioning.json');
if (positioning.status !== 'planned') errors.push('F0.10 must not implement positioning geometry');
const animation = json('registry/capabilities/animation.json');
if (animation.status !== 'planned') errors.push('F0.10 must not advance F0.11 animation');
for (const platformName of ['accessibility', 'data-binding']) {
  if (json(`registry/platform/${platformName}.json`).status !== 'unreviewed') {
    errors.push(`F0.10 must not advance reference-derived ${platformName} parity`);
  }
}

const specification = read('specs/foundation/overlay.md');
for (const heading of [
  '## Scope and ownership',
  '## Portal hosts and inherited scope',
  '## Ordered layer stack',
  '## Dismissable layers',
  '## Focus scopes',
  '## Modal isolation',
  '## Accessibility and interaction requirements',
  '## SSR, security, and performance',
  '## Compatibility and integration',
  '## F0.11 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`Overlay specification missing ${heading}`);
}

const portalSource = read('packages/overlay/src/portal.ts');
for (const marker of ["'data-theme'", "'data-density'", "'dir'"]) {
  if (!portalSource.includes(marker)) errors.push(`Portal scope contract missing ${marker}`);
}
const unitTest = read('tests/unit/overlay-foundation.test.ts');
for (const marker of ['1000', 'token-aware cleanup', 'globalThis.document']) {
  if (!unitTest.includes(marker)) errors.push(`Overlay unit evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/overlay-foundation/page.tsx');
if (!fixture.includes('@casauran-internal/overlay')) {
  errors.push('Overlay production fixture must import the package root during SSR');
}
const browserTest = read('tests/browser/overlay-foundation.spec.ts');
for (const marker of [
  'production SSR',
  'pointer-outside',
  'isComposing',
  'Shift+Tab',
  "toHaveJSProperty('inert', true)",
]) {
  if (!browserTest.includes(marker)) errors.push(`Overlay browser evidence missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(`${contract.capabilities.length} overlay capabilities with SSR and browser focus evidence`);
}
