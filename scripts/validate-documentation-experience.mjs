import { validateDocumentationExperience } from './documentation-experience.mjs';
import { validateFeatureCoverage, validatePendingCoverage } from './documentation-coverage.mjs';
import { exists, fail, files, json, pass, read } from './lib.mjs';

const contract = json('registry/documentation/foundation.json');
const errors = validateDocumentationExperience(contract, { sourceExists: exists });

const manifest = json('apps/docs/package.json');
if (manifest.name !== '@casauran-internal/docs' || manifest.private !== true) {
  errors.push('documentation application must remain internal and private');
}
const allowedDependencies = new Set([
  '@casauran/icons',
  '@casauran/react',
  '@casauran/theme',
  '@casauran/tokens',
  'next',
  'react',
  'react-dom',
]);
for (const dependency of Object.keys(manifest.dependencies ?? {})) {
  if (!allowedDependencies.has(dependency)) {
    errors.push(`documentation application has unapproved runtime dependency ${dependency}`);
  }
}

const requiredSources = [
  'apps/docs/app/globals.css',
  'apps/docs/app/layout.tsx',
  'apps/docs/app/page.tsx',
  'apps/docs/app/docs-index.json/route.ts',
  'apps/docs/components/current-link.tsx',
  'apps/docs/components/docs-primitives.tsx',
  'apps/docs/components/docs-shell.tsx',
  'apps/docs/components/presentation-controls.tsx',
  'apps/docs/lib/content.ts',
  'tests/browser/docs-shell.spec.ts',
];
for (const source of requiredSources) {
  if (!exists(source)) errors.push(`documentation foundation source missing: ${source}`);
}

const stages = json('.agent/stages/index.json');
const stageIndex = stages.findIndex((stage) => stage.id === 'F0.18');
// ADR-020 inserted F0.18 at the ledger boundary after 1.02, and it must not have started 1.03.
// ADR-024 generalised the second half of that assertion: another governed stage may now be
// inserted after F0.18, so what is checked is that no public component stage intervenes.
const firstComponentAfter = stages
  .slice(stageIndex + 1)
  .find((stage) => stage.type === 'public-component');
if (stageIndex < 1 || stages[stageIndex - 1]?.id !== '1.02') {
  errors.push('F0.18 must remain at the governed current boundary immediately after 1.02');
}
if (firstComponentAfter?.id !== '1.03') {
  errors.push('F0.18 must precede 1.03 with no public component stage inserted between them');
}
for (const stage of stages.slice(stageIndex + 1)) {
  if (stage.id === firstComponentAfter?.id) break;
  if (stage.status !== 'not-started') {
    errors.push(`${stage.id} was inserted after F0.18 and must remain not-started until it runs`);
  }
}
if (!['in-progress', 'complete'].includes(stages[stageIndex]?.status)) {
  errors.push('F0.18 must be active or complete');
}
if (
  !read('.agent/decisions/ADR-020-documentation-experience-foundation.md').includes(
    'Status: Accepted',
  )
) {
  errors.push('documentation architecture requires accepted ADR-020');
}
if (json('registry/components/svg-icon.json').status !== 'unreviewed') {
  errors.push('F0.18 must not advance SVGIcon lifecycle');
}

const metadataSource = read('apps/docs/lib/content.ts');
for (const marker of [
  "stageId: '1.01'",
  "stageId: '1.02'",
  '.agent/stages/index.json',
  'docsIndex',
]) {
  if (!metadataSource.includes(marker)) errors.push(`documentation metadata missing ${marker}`);
}
for (const document of [
  ['1.01', 'button'],
  ['1.02', 'icon'],
]) {
  if (!exists(`apps/docs/app/components/${document[1]}/page.tsx`)) {
    errors.push(`completed stage ${document[0]} is missing its stable documentation route`);
  }
}

const primitiveSource = read('apps/docs/components/docs-primitives.tsx');
for (const marker of [
  'DocsPage',
  'DocsSection',
  'Example',
  'ApiReference',
  'KeyboardTable',
  'Callout',
]) {
  if (!primitiveSource.includes(`function ${marker}`)) {
    errors.push(`documentation primitives missing ${marker}`);
  }
}
const shellSource = read('apps/docs/components/docs-shell.tsx');
for (const marker of [
  'Skip to documentation',
  'Documentation',
  'On this page',
  'PresentationControls',
]) {
  if (marker === 'On this page') continue;
  if (!shellSource.includes(marker)) errors.push(`documentation shell missing ${marker}`);
}
if (!primitiveSource.includes('On this page'))
  errors.push('documentation page table of contents missing');

const clientBoundaries = files('apps/docs').filter(
  (path) => /\.tsx$/u.test(path) && /^[\s\n]*['"]use client['"]/u.test(read(path)),
);
if (
  clientBoundaries.length !== 2 ||
  !clientBoundaries.includes('apps/docs/components/current-link.tsx') ||
  !clientBoundaries.includes('apps/docs/components/presentation-controls.tsx')
) {
  errors.push(
    'documentation client boundaries must remain limited to current links and presentation controls',
  );
}
for (const source of files('apps/docs').filter((path) => /\.(ts|tsx)$/u.test(path))) {
  const text = read(source);
  if (
    /dangerouslySetInnerHTML|insertAdjacentHTML|\beval\s*\(|new Function|\bfetch\s*\(/u.test(text)
  ) {
    errors.push(`${source} introduces an unapproved documentation content sink`);
  }
}

const browserTest = exists('tests/browser/docs-shell.spec.ts')
  ? read('tests/browser/docs-shell.spec.ts')
  : '';
for (const marker of [
  'production SSR',
  'docs-index.json',
  'mobile navigation',
  'toHaveScreenshot',
]) {
  if (!browserTest.includes(marker))
    errors.push(`documentation browser evidence missing ${marker}`);
}
const playground = read('apps/playground/README.md');
if (!playground.includes('interactive component experimentation')) {
  errors.push('apps/playground must remain documented as an engineering sandbox');
}

// ADR-023: every declared feature of a documented component is demonstrated on its route, and an
// enumerated feature is demonstrated by showing every value rather than one representative.
const pendingCoverage = Array.isArray(contract.pendingCoverage) ? contract.pendingCoverage : [];
const pendingSlugs = new Set();
for (const pending of pendingCoverage) {
  errors.push(...validatePendingCoverage(pending));
  if (typeof pending?.slug === 'string') pendingSlugs.add(pending.slug);
}
const documentedStatuses = new Set(['documented', 'parity-verified', 'improved']);
for (const component of files('registry/components')
  .filter((path) => path.endsWith('.json'))
  .map(json)) {
  if (!documentedStatuses.has(component.status)) continue;
  const route = `apps/docs/app/components/${component.slug}/page.tsx`;
  if (!exists(route)) {
    errors.push(`${component.name}: ${component.status} requires ${route}`);
    continue;
  }
  if (pendingSlugs.has(component.slug)) continue;
  errors.push(...validateFeatureCoverage(component, read(route), exists));
}
for (const pending of pendingSlugs) {
  if (!exists(`registry/components/${pending}.json`)) {
    errors.push(`pending coverage names an unknown component ${pending}`);
  }
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(`${contract.capabilities.length} documentation capabilities with governed shell evidence`);
}
