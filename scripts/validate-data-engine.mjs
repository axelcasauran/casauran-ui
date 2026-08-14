import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateDataEngine } from './data-engine.mjs';

const contract = json('registry/data/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateDataEngine(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/data/package.json');
if (manifest.name !== '@casauran-internal/data' || manifest.private !== true) {
  errors.push('data package must remain internal and private');
}
if (
  Object.keys(manifest.dependencies ?? {}).length !== 0 ||
  manifest.peerDependencies !== undefined ||
  manifest.sideEffects !== false
) {
  errors.push('data package must have no runtime dependencies and remain side-effect-free');
}

for (const source of files('packages/data/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and free of a React client boundary`);
  }
  if (
    /innerHTML|insertAdjacentHTML|dangerouslySetInnerHTML|eval\s*\(|new Function|fetch\s*\(/u.test(
      text,
    )
  ) {
    errors.push(`${source} must not introduce content, dynamic-execution, or transport sinks`);
  }
  if (/\bIntl\./u.test(text)) errors.push(`${source} must not advance F0.13 locale behavior`);
}

for (const capabilityName of [
  'data-operations',
  'filtering',
  'sorting',
  'grouping',
  'aggregation',
  'paging',
]) {
  const capability = json(`registry/capabilities/${capabilityName}.json`);
  if (capability.status !== 'implemented' || capability.owner !== 'packages/data') {
    errors.push(`${capabilityName} capability must be implemented by packages/data`);
  }
}
if (
  !['planned', 'implemented'].includes(
    json('registry/capabilities/internationalization.json').status,
  )
) {
  errors.push('internationalization capability must remain at a legal roadmap status');
}
for (const componentName of ['data-grid', 'tree-list', 'list-view']) {
  if (json(`registry/components/${componentName}.json`).status !== 'unreviewed') {
    errors.push(`F0.12 must not advance public ${componentName} lifecycle`);
  }
}
for (const platformName of ['accessibility', 'data-binding']) {
  if (json(`registry/platform/${platformName}.json`).status !== 'unreviewed') {
    errors.push(`F0.12 must not advance reference-derived ${platformName} parity`);
  }
}

const specification = read('specs/foundation/data-engine.md');
for (const heading of [
  '## Scope and ownership',
  '## Descriptor and state contract',
  '## Field access and comparison',
  '## Filtering and sorting',
  '## Aggregation and grouping',
  '## Paging and composite processing',
  '## Security and trust boundaries',
  '## Performance and large-data evidence',
  '## Accessibility and product dimensions',
  '## SSR, compatibility, and integration',
  '## F0.13 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`Data specification missing ${heading}`);
}

const unitTest = read('tests/unit/data-engine.test.ts');
for (const marker of ['100_000', 'inherited/prototype', 'cycles', 'leaf paging']) {
  if (!unitTest.includes(marker)) errors.push(`Data unit evidence missing ${marker}`);
}
const benchmark = read('benchmarks/data-engine.mjs');
for (const marker of ['100_000', '5_000', 'process.version']) {
  if (!benchmark.includes(marker)) errors.push(`Data performance evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/data-engine/page.tsx');
if (!fixture.includes('@casauran-internal/data')) {
  errors.push('Data production fixture must import the package root during SSR');
}
const browserTest = read('tests/browser/data-engine.spec.ts');
for (const marker of ['production SSR', 'deterministic', 'serializable']) {
  if (!browserTest.includes(marker)) errors.push(`Data browser evidence missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(`${contract.capabilities.length} data capabilities with SSR and 100,000-row evidence`);
}
