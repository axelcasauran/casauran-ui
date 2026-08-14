import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateInternationalization } from './internationalization.mjs';

const contract = json('registry/i18n/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateInternationalization(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/i18n/package.json');
if (manifest.name !== '@casauran-internal/i18n' || manifest.private !== true) {
  errors.push('i18n package must remain internal and private');
}
if (
  Object.keys(manifest.dependencies ?? {}).length !== 0 ||
  manifest.peerDependencies !== undefined ||
  manifest.sideEffects !== false
) {
  errors.push('i18n package must have no runtime dependencies and remain side-effect-free');
}

for (const source of files('packages/i18n/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and free of a React client boundary`);
  }
  if (
    /innerHTML|insertAdjacentHTML|dangerouslySetInnerHTML|eval\s*\(|new Function|fetch\s*\(|\bwindow\b|\bdocument\b|\bnavigator\b|localStorage|sessionStorage/u.test(
      text,
    )
  ) {
    errors.push(`${source} must not introduce DOM, storage, transport, or dynamic-execution sinks`);
  }
}

for (const marker of [
  'Intl.getCanonicalLocales',
  'Intl.Locale',
  'Intl.PluralRules',
  'Intl.NumberFormat',
  'Intl.DateTimeFormat',
  'Intl.Collator',
]) {
  if (!Object.values(sourceTexts).some((source) => source.includes(marker))) {
    errors.push(`Native internationalization implementation missing ${marker}`);
  }
}

const capability = json('registry/capabilities/internationalization.json');
if (capability.status !== 'implemented' || capability.owner !== 'packages/i18n') {
  errors.push('internationalization capability must be implemented by packages/i18n');
}
const dateMathStatus = json('registry/capabilities/date-math.json').status;
if (!['planned', 'implemented'].includes(dateMathStatus)) {
  errors.push('date-math lifecycle must remain planned or implemented by its owning stage');
}
if (json('registry/capabilities/recurrence.json').status !== 'planned') {
  errors.push('F0.13 must not advance recurrence');
}
if (json('registry/platform/internationalization.json').status !== 'unreviewed') {
  errors.push('F0.13 must not advance reference-derived internationalization parity');
}
for (const componentName of ['date-input', 'data-grid', 'scheduler']) {
  if (json(`registry/components/${componentName}.json`).status !== 'unreviewed') {
    errors.push(`F0.13 must not advance public ${componentName} lifecycle`);
  }
}

const specification = read('specs/foundation/internationalization.md');
for (const heading of [
  '## Scope and ownership',
  '## Locale resolution contract',
  '## Direction contract',
  '## Message catalog and fallback contract',
  '## Plural selection contract',
  '## Number and date-time formatting contract',
  '## Collation contract',
  '## Security and trust boundaries',
  '## Accessibility, RTL, and IME',
  '## SSR, compatibility, and integration',
  '## F0.14 boundary',
]) {
  if (!specification.includes(heading)) {
    errors.push(`Internationalization specification missing ${heading}`);
  }
}

const packageReadme = read('packages/i18n/README.md');
for (const marker of ['untrusted text', 'no React provider', 'date-math']) {
  if (!packageReadme.includes(marker)) errors.push(`i18n package documentation missing ${marker}`);
}
const unitTest = read('tests/unit/internationalization.test.ts');
for (const marker of ['not_a_locale', 'prototype', "'ordinal'", 'timeZone', 'formatNumber']) {
  if (!unitTest.includes(marker))
    errors.push(`Internationalization unit evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/internationalization/page.tsx');
if (!fixture.includes('@casauran-internal/i18n')) {
  errors.push('Internationalization production fixture must import the package root during SSR');
}
const browserTest = read('tests/browser/internationalization.spec.ts');
for (const marker of ['production SSR', 'untrusted messages as text', 'plurals, numbers, dates']) {
  if (!browserTest.includes(marker)) {
    errors.push(`Internationalization browser evidence missing ${marker}`);
  }
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.capabilities.length} internationalization capabilities with SSR and RTL evidence`,
  );
}
