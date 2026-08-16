import {
  validateComponentLifecycleBoundary,
  validateDocumentationExperience,
} from './documentation-experience.mjs';
import {
  publishedTopics,
  validateFeatureCoverage,
  validatePendingCoverage,
  validatePublishedTopics,
} from './documentation-coverage.mjs';
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
  // F0.19: component routes are generated from the topic model rather than hand-authored.
  'apps/docs/app/components/page.tsx',
  'apps/docs/app/components/[slug]/page.tsx',
  'apps/docs/app/components/[slug]/[topic]/page.tsx',
  'apps/docs/components/current-link.tsx',
  'apps/docs/components/docs-primitives.tsx',
  'apps/docs/components/docs-shell.tsx',
  'apps/docs/components/example-frame.tsx',
  'apps/docs/components/presentation-controls.tsx',
  'apps/docs/lib/content.ts',
  'apps/docs/lib/example-source.ts',
  'apps/docs/lib/topics.ts',
  'registry/documentation/topics.json',
  'registry/schemas/documentation-topics.schema.json',
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
  // Anything inserted between F0.18 and the next component stage is documentation-foundation work
  // (F0.19 is the first). Stage ordering and status transitions stay owned by repository governance.
  if (stage.type !== 'foundation') {
    errors.push(`${stage.id} was inserted after F0.18 and must be a foundation stage`);
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
// F0.18 originally asserted this by naming SVGIcon and requiring it to stay `unreviewed`. That
// held only until `1.03` ran and covered exactly one component; the generalised rule binds every
// component's lifecycle to its own stage, so a foundation stage still cannot advance a component
// queued behind it.
errors.push(
  ...validateComponentLifecycleBoundary(
    stages,
    files('registry/components')
      .filter((path) => path.endsWith('.json'))
      .map(json),
  ),
);

const metadataSource = read('apps/docs/lib/content.ts');
for (const marker of [
  "stageId: '1.01'",
  "stageId: '1.02'",
  "stageId: '1.03'",
  '.agent/stages/index.json',
  'docsIndex',
]) {
  if (!metadataSource.includes(marker)) errors.push(`documentation metadata missing ${marker}`);
}
for (const document of [
  ['1.01', 'button'],
  ['1.02', 'icon'],
  ['1.03', 'svg-icon'],
]) {
  if (!exists(`apps/docs/content/${document[1]}/index.tsx`)) {
    errors.push(`completed stage ${document[0]} is missing its documentation content module`);
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

// F0.19 adds interactive examples, so the allowed client set grows from two shell islands to the
// shell islands, the example frame, and example modules. Routes, layouts, content modules and the
// shell itself must stay server components.
const clientBoundaries = files('apps/docs').filter(
  (path) => /\.tsx$/u.test(path) && /^[\s\n]*['"]use client['"]/u.test(read(path)),
);
const allowedClientBoundaries = new Set([
  'apps/docs/components/current-link.tsx',
  'apps/docs/components/example-frame.tsx',
  'apps/docs/components/presentation-controls.tsx',
]);
for (const boundary of clientBoundaries) {
  const isExampleModule = /^apps\/docs\/content\/[a-z0-9-]+\/examples\/[a-z0-9-]+\.tsx$/u.test(
    boundary,
  );
  if (!allowedClientBoundaries.has(boundary) && !isExampleModule) {
    errors.push(`unapproved documentation client boundary: ${boundary}`);
  }
}
for (const required of allowedClientBoundaries) {
  if (!clientBoundaries.includes(required)) {
    errors.push(`documentation client island missing its directive: ${required}`);
  }
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
const topicModel = json('registry/documentation/topics.json');
const modelTopics = Array.isArray(topicModel.topics) ? topicModel.topics : [];
if (topicModel.schemaVersion !== 1 || topicModel.owner !== 'apps/docs') {
  errors.push('documentation topic model must declare schemaVersion 1 and apps/docs ownership');
}
if (!exists(topicModel.decision ?? '')) {
  errors.push(`documentation topic model references a missing decision: ${topicModel.decision}`);
}
if (modelTopics.length < 5) errors.push('documentation topic model must declare its topic set');

const documentedStatuses = new Set(['documented', 'parity-verified', 'improved']);
for (const component of files('registry/components')
  .filter((path) => path.endsWith('.json'))
  .map(json)) {
  if (!documentedStatuses.has(component.status)) continue;
  const index = `apps/docs/content/${component.slug}/index.tsx`;
  if (!exists(index)) {
    errors.push(`${component.name}: ${component.status} requires ${index}`);
    continue;
  }
  const indexSource = read(index);
  const exampleSources = files(`apps/docs/content/${component.slug}`)
    .filter((path) => path.includes('/examples/'))
    .map(read)
    .join('\n');
  const topics = publishedTopics(indexSource);
  errors.push(...validatePublishedTopics(component.name, topics, modelTopics));
  if (pendingSlugs.has(component.slug)) continue;
  errors.push(
    ...validateFeatureCoverage(
      component,
      { index: indexSource, examples: exampleSources, topics },
      exists,
    ),
  );
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
