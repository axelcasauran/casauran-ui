import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateAnimationFoundation } from './animation-foundation.mjs';

const contract = json('registry/animation/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateAnimationFoundation(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/animation/package.json');
if (manifest.name !== '@casauran-internal/animation' || manifest.private !== true) {
  errors.push('animation package must remain internal and private');
}
if (
  Object.keys(manifest.dependencies ?? {}).length !== 0 ||
  manifest.peerDependencies !== undefined ||
  manifest.sideEffects !== false
) {
  errors.push('animation package must have no runtime dependencies and remain side-effect-free');
}

for (const source of files('packages/animation/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and free of a React client boundary`);
  }
  if (/innerHTML|insertAdjacentHTML|dangerouslySetInnerHTML|eval\s*\(/u.test(text)) {
    errors.push(`${source} must not introduce an HTML or dynamic-execution sink`);
  }
}

const animation = json('registry/capabilities/animation.json');
if (animation.status !== 'implemented' || animation.owner !== 'packages/animation') {
  errors.push('animation capability must be implemented by packages/animation');
}
const dataOperations = json('registry/capabilities/data-operations.json');
if (!['planned', 'implemented'].includes(dataOperations.status)) {
  errors.push('data operations capability must remain at a legal roadmap status');
}
for (const platformName of ['accessibility', 'data-binding']) {
  if (json(`registry/platform/${platformName}.json`).status !== 'unreviewed') {
    errors.push(`F0.11 must not advance reference-derived ${platformName} parity`);
  }
}

const specification = read('specs/foundation/animation.md');
for (const heading of [
  '## Scope and ownership',
  '## Motion timing',
  '## Reduced-motion preference',
  '## Web Animations playback',
  '## Animation registry',
  '## Presence state',
  '## Accessibility and interaction requirements',
  '## SSR, security, and performance',
  '## Compatibility and integration',
  '## F0.12 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`Animation specification missing ${heading}`);
}

const tokenContract = read('registry/tokens/foundation.json');
const themeCss = read('packages/theme/src/theme.css');
for (const marker of [
  '--csn-motion-duration-fast',
  '--csn-motion-duration-standard',
  '--csn-motion-duration-slow',
  '--csn-motion-easing-standard',
]) {
  if (!tokenContract.includes(marker) || !themeCss.includes(marker)) {
    errors.push(`Animation token/theme integration missing ${marker}`);
  }
}
const unitTest = read('tests/unit/animation-foundation.test.ts');
for (const marker of ['1000', 'reducedMotion: true', 'stale completion revisions']) {
  if (!unitTest.includes(marker)) errors.push(`Animation unit evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/animation-foundation/page.tsx');
if (!fixture.includes('@casauran-internal/animation')) {
  errors.push('Animation production fixture must import the package root during SSR');
}
const browserTest = read('tests/browser/animation-foundation.spec.ts');
for (const marker of [
  'production SSR',
  'reducedMotion',
  'AbortSignal',
  'interrupted',
  'presence',
]) {
  if (!browserTest.includes(marker)) errors.push(`Animation browser evidence missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.capabilities.length} animation capabilities with SSR and browser motion evidence`,
  );
}
