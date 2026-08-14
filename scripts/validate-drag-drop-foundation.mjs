import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateDragDropFoundation } from './drag-drop-foundation.mjs';

const contract = json('registry/drag-drop/foundation.json');
const sourceTexts = Object.fromEntries(
  contract.capabilities.map((capability) => [capability.module, read(capability.module)]),
);
const errors = validateDragDropFoundation(contract, { sourceExists: exists, sourceTexts });

const manifest = json('packages/drag-drop/package.json');
if (manifest.name !== '@casauran-internal/drag-drop' || manifest.private !== true) {
  errors.push('drag-drop package must remain internal and private');
}
if (
  Object.keys(manifest.dependencies ?? {}).length !== 0 ||
  manifest.peerDependencies !== undefined ||
  manifest.sideEffects !== false
) {
  errors.push('drag-drop package must have no runtime dependencies and remain side-effect-free');
}
for (const source of files('packages/drag-drop/src').filter((path) => path.endsWith('.ts'))) {
  const text = read(source);
  if (text.includes("'use client'") || /from ['"]react['"]/u.test(text)) {
    errors.push(`${source} must remain framework-neutral and free of a React client boundary`);
  }
  if (
    /Date\.now|innerHTML|insertAdjacentHTML|dangerouslySetInnerHTML|eval\s*\(|new Function|fetch\s*\(|\bwindow\b|\bdocument\b|\bnavigator\b|localStorage|sessionStorage|DataTransfer/u.test(
      text,
    )
  ) {
    errors.push(
      `${source} must not introduce global DOM, transfer, storage, transport, or dynamic-code sinks`,
    );
  }
}
for (const marker of ['activationDistance', 'beginPointer', 'beginKeyboard', 'threshold-not-met']) {
  if (!sourceTexts['packages/drag-drop/src/session.ts']?.includes(marker)) {
    errors.push(`Drag session implementation missing ${marker}`);
  }
}
for (const marker of ['setPointerCapture', 'lostpointercapture', 'pointercancel', 'dispose']) {
  if (!sourceTexts['packages/drag-drop/src/pointer.ts']?.includes(marker)) {
    errors.push(`Pointer capture implementation missing ${marker}`);
  }
}
for (const marker of [
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'edgeThreshold',
  'maxSpeed',
]) {
  if (!sourceTexts['packages/drag-drop/src/autoscroll.ts']?.includes(marker)) {
    errors.push(`Autoscroll implementation missing ${marker}`);
  }
}

const capability = json('registry/capabilities/drag-drop.json');
if (capability.status !== 'implemented' || capability.owner !== 'packages/drag-drop') {
  errors.push('drag-drop capability must be implemented by packages/drag-drop');
}
for (const prerequisite of ['collections', 'virtualization']) {
  if (json(`registry/capabilities/${prerequisite}.json`).status !== 'implemented') {
    errors.push(`F0.16 requires implemented ${prerequisite} ownership`);
  }
}
const stages = json('.agent/stages/index.json');
if (!['not-started', 'complete'].includes(stages.find((stage) => stage.id === 'F0.17')?.status)) {
  errors.push('F0.17 reference baseline must retain a valid lifecycle state after F0.16');
}
for (const componentName of [
  'sortable',
  'data-grid',
  'task-board',
  'scheduler',
  'gantt',
  'diagram',
  'external-drop-zone',
]) {
  if (json(`registry/components/${componentName}.json`).status !== 'unreviewed') {
    errors.push(`F0.16 must not advance public ${componentName} lifecycle`);
  }
}

const specification = read('specs/foundation/drag-drop.md');
for (const heading of [
  '## Scope and ownership',
  '## Pointer session and activation contract',
  '## Drop targets and collision contract',
  '## Pointer capture and cleanup lifecycle',
  '## Keyboard alternative and accessibility boundary',
  '## Autoscroll contract',
  '## Security and trust boundaries',
  '## Performance contract',
  '## RTL, i18n, IME, theming, and responsive behavior',
  '## SSR, hydration, and integration',
  '## F0.17 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`Drag-drop specification missing ${heading}`);
}
const packageReadme = read('packages/drag-drop/README.md');
for (const marker of ['Pointer Events', 'keyboard-equivalent', 'autoscroll', 'F0.17']) {
  if (!packageReadme.includes(marker))
    errors.push(`drag-drop package documentation missing ${marker}`);
}
const unitTest = read('tests/unit/drag-drop.test.ts');
for (const marker of [
  'primary button-zero pointer',
  'closest-center',
  'capture-loss',
  'hostile payloads',
]) {
  if (!unitTest.includes(marker)) errors.push(`Drag-drop unit evidence missing ${marker}`);
}
const fixture = read('apps/visual-tests/app/drag-drop/page.tsx');
if (!fixture.includes('@casauran-internal/drag-drop')) {
  errors.push('Drag-drop production fixture must import the package root during SSR');
}
const browserTest = read('tests/browser/drag-drop.spec.ts');
for (const marker of [
  'production SSR',
  'primary pointer capture',
  'keyboard alternative',
  'touch Pointer Events',
  'edge autoscroll',
]) {
  if (!browserTest.includes(marker)) errors.push(`Drag-drop browser evidence missing ${marker}`);
}
const benchmark = read('benchmarks/drag-drop.mjs');
for (const marker of ['2_000', '5_000', '50_000', 'ceilingMilliseconds', 'process.version']) {
  if (!benchmark.includes(marker)) errors.push(`Drag-drop benchmark missing ${marker}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.capabilities.length} drag-drop capabilities with pointer, keyboard and autoscroll evidence`,
  );
}
