import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateDateMath } from './date-math.mjs';

const contract = json('registry/date-math/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateDateMath(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/date-math/package.json');
if (manifest.name !== '@casauran-internal/date-math' || manifest.private !== true) {
  errors.push('date-math package must remain internal and private');
}
if (
  Object.keys(manifest.dependencies ?? {}).length !== 0 ||
  manifest.peerDependencies !== undefined ||
  manifest.sideEffects !== false
) {
  errors.push('date-math package must have no runtime dependencies and remain side-effect-free');
}

for (const source of files('packages/date-math/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and free of a React client boundary`);
  }
  if (
    /Date\.now|innerHTML|insertAdjacentHTML|dangerouslySetInnerHTML|eval\s*\(|new Function|fetch\s*\(|\bwindow\b|\bdocument\b|\bnavigator\b|localStorage|sessionStorage/u.test(
      text,
    )
  ) {
    errors.push(
      `${source} must not introduce clock, DOM, storage, transport, or dynamic-execution sinks`,
    );
  }
}

for (const marker of ['Intl.DateTimeFormat', 'formatToParts', 'resolvedOptions().timeZone']) {
  if (!Object.values(sourceTexts).some((source) => source.includes(marker))) {
    errors.push(`Native timezone implementation missing ${marker}`);
  }
}

const capability = json('registry/capabilities/date-math.json');
if (capability.status !== 'implemented' || capability.owner !== 'packages/date-math') {
  errors.push('date-math capability must be implemented by packages/date-math');
}
if (json('registry/capabilities/internationalization.json').status !== 'implemented') {
  errors.push('F0.14 requires the implemented F0.13 internationalization owner');
}
const virtualizationStatus = json('registry/capabilities/virtualization.json').status;
if (!['planned', 'implemented'].includes(virtualizationStatus)) {
  errors.push('virtualization lifecycle must remain planned or implemented by its owning stage');
}
if (json('registry/capabilities/recurrence.json').status !== 'planned') {
  errors.push('F0.14 must not advance recurrence');
}
if (!['planned', 'implemented'].includes(json('registry/capabilities/drag-drop.json').status)) {
  errors.push('drag-drop lifecycle must remain planned or implemented by its owning stage');
}
if (json('registry/platform/date-math.json').status !== 'unreviewed') {
  errors.push('F0.14 must not advance reference-derived date-math parity');
}
for (const componentName of ['calendar', 'date-input', 'scheduler', 'gantt']) {
  if (json(`registry/components/${componentName}.json`).status !== 'unreviewed') {
    errors.push(`F0.14 must not advance public ${componentName} lifecycle`);
  }
}

const specification = read('specs/foundation/date-math.md');
for (const heading of [
  '## Scope and ownership',
  '## Calendar date contract',
  '## Calendar arithmetic contract',
  '## ISO week contract',
  '## Date range contract',
  '## Wall-time contract',
  '## Timezone strategy and DST contract',
  '## Parsing and trust boundaries',
  '## Accessibility, i18n, RTL, and IME',
  '## Performance and immutability',
  '## SSR, compatibility, and integration',
  '## F0.15 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`Date-math specification missing ${heading}`);
}

const packageReadme = read('packages/date-math/README.md');
for (const marker of ['inclusive', 'DST', 'no parser', 'F0.15']) {
  if (!packageReadme.includes(marker))
    errors.push(`date-math package documentation missing ${marker}`);
}
const unitTest = read('tests/unit/date-math.test.ts');
for (const marker of ['America/New_York', "'reject'", 'weekYear', 'prototype', 'Asia/Kathmandu']) {
  if (!unitTest.includes(marker)) errors.push(`Date-math unit evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/date-math/page.tsx');
if (!fixture.includes('@casauran-internal/date-math')) {
  errors.push('Date-math production fixture must import the package root during SSR');
}
const browserTest = read('tests/browser/date-math.spec.ts');
for (const marker of ['production SSR', 'calendar and inclusive range', 'DST gap and overlap']) {
  if (!browserTest.includes(marker)) errors.push(`Date-math browser evidence missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0)
  pass(`${contract.capabilities.length} date-math capabilities with DST and SSR evidence`);
