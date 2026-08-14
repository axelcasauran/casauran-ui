import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateVirtualizationFoundation } from './virtualization-foundation.mjs';

const contract = json('registry/virtualization/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateVirtualizationFoundation(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/virtualization/package.json');
if (manifest.name !== '@casauran-internal/virtualization' || manifest.private !== true) {
  errors.push('virtualization package must remain internal and private');
}
if (
  Object.keys(manifest.dependencies ?? {}).length !== 0 ||
  manifest.peerDependencies !== undefined ||
  manifest.sideEffects !== false
) {
  errors.push(
    'virtualization package must have no runtime dependencies and remain side-effect-free',
  );
}
for (const source of files('packages/virtualization/src').filter((path) => path.endsWith('.ts'))) {
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
      `${source} must not introduce DOM-global, storage, transport, or dynamic-code sinks`,
    );
  }
}
for (const marker of ['FenwickTree', 'MAX_VIRTUAL_ITEMS', 'scrollAdjustment', 'includeIndexes']) {
  if (!sourceTexts['packages/virtualization/src/axis.ts']?.includes(marker)) {
    errors.push(`Virtual axis implementation missing ${marker}`);
  }
}
for (const marker of ['ResizeObserver', 'WeakMap', 'disconnect']) {
  if (!sourceTexts['packages/virtualization/src/measurement.ts']?.includes(marker)) {
    errors.push(`Element measurement implementation missing ${marker}`);
  }
}

const capability = json('registry/capabilities/virtualization.json');
if (capability.status !== 'implemented' || capability.owner !== 'packages/virtualization') {
  errors.push('virtualization capability must be implemented by packages/virtualization');
}
for (const prerequisite of ['collections', 'data-operations', 'date-math']) {
  if (json(`registry/capabilities/${prerequisite}.json`).status !== 'implemented') {
    errors.push(`F0.15 requires implemented ${prerequisite} ownership`);
  }
}
if (!['planned', 'implemented'].includes(json('registry/capabilities/drag-drop.json').status)) {
  errors.push('drag-drop lifecycle must remain planned or implemented by its owning stage');
}
for (const componentName of ['list-view', 'data-grid', 'tree-list', 'scheduler', 'spreadsheet']) {
  if (json(`registry/components/${componentName}.json`).status !== 'unreviewed') {
    errors.push(`F0.15 must not advance public ${componentName} lifecycle`);
  }
}

const specification = read('specs/foundation/virtualization.md');
for (const heading of [
  '## Scope and ownership',
  '## Axis and overscan contract',
  '## Dynamic measurement and stable keys',
  '## Scroll anchoring and alignment',
  '## Focus and selection preservation',
  '## Two-dimensional virtualization',
  '## Browser measurement lifecycle',
  '## Accessibility, input, RTL, and i18n',
  '## Security and validation',
  '## Performance contract',
  '## SSR, hydration, and integration',
  '## F0.16 boundary',
]) {
  if (!specification.includes(heading))
    errors.push(`Virtualization specification missing ${heading}`);
}
const packageReadme = read('packages/virtualization/README.md');
for (const marker of ['overscan', 'scrollAdjustment', 'ResizeObserver', 'F0.16']) {
  if (!packageReadme.includes(marker))
    errors.push(`virtualization package documentation missing ${marker}`);
}
const unitTest = read('tests/unit/virtualization.test.ts');
for (const marker of ['100_000', 'stable key', 'includeIndexes', 'FakeResizeObserver']) {
  if (!unitTest.includes(marker)) errors.push(`Virtualization unit evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/virtualization/page.tsx');
if (!fixture.includes('@casauran-internal/virtualization')) {
  errors.push('Virtualization production fixture must import the package root during SSR');
}
const browserTest = read('tests/browser/virtualization.spec.ts');
for (const marker of ['production SSR', 'stable scroll anchoring', 'focused pinned item']) {
  if (!browserTest.includes(marker))
    errors.push(`Virtualization browser evidence missing ${marker}`);
}
const benchmark = read('benchmarks/virtualization.mjs');
for (const marker of ['100_000', '10_000', 'ceilingMilliseconds', 'process.version']) {
  if (!benchmark.includes(marker)) errors.push(`Virtualization benchmark missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.capabilities.length} virtualization capabilities with dynamic, SSR and browser evidence`,
  );
}
