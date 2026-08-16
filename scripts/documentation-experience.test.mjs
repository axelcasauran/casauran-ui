import assert from 'node:assert/strict';
import test from 'node:test';

import { validateDocumentationExperience } from './documentation-experience.mjs';

const base = {
  $schema: '../schemas/documentation-experience.schema.json',
  schemaVersion: 1,
  owner: 'apps/docs',
  sourceRegistry: '.agent/stages/index.json',
  capabilities: [
    'global-shell',
    'brand-header',
    'category-navigation',
    'page-table-of-contents',
    'responsive-layout',
    'stable-routing',
    'examples-and-source',
    'api-reference',
    'accessibility-and-keyboard',
    'callouts',
    'presentation-controls',
    'search-metadata',
    'registry-integration',
    'application-accessibility',
    'ssr-rsc',
    'deterministic-visual-coverage',
    'capability-topic-model',
    'generated-topic-routes',
    'interactive-examples',
    'verified-example-source',
  ],
  boundaries: {
    owned: [
      'private documentation application shell and information architecture',
      'documentation-only presentation primitives and component-page composition',
      'registry-derived navigation and search metadata',
      'local post-hydration documentation presentation controls',
      'production documentation host browser and visual evidence',
      'declared topic model, generated component topic routes, and interactive example islands',
    ],
    excluded: [
      'public React components hooks packages or supported consumer APIs',
      'component behavior feature parity or lifecycle advancement',
      'external search content management analytics authentication or deployment services',
      'raw HTML executable source remote modules untrusted URLs or dynamic code execution',
      'apps playground engineering sandbox ownership',
      'SVGIcon or any stage 1.03 implementation',
    ],
  },
};
const validate = (contract) =>
  validateDocumentationExperience(contract, {
    sourceExists: (path) => path === 'registry/schemas/documentation-experience.schema.json',
  });

test('accepts the complete documentation experience contract', () => {
  assert.deepEqual(validate(structuredClone(base)), []);
});

test('rejects schema, owner, and source-registry drift', () => {
  const contract = structuredClone(base);
  contract.$schema = 'wrong.json';
  contract.owner = 'apps/playground';
  contract.sourceRegistry = 'apps/docs/navigation.json';
  assert.equal(validate(contract).length, 3);
});

test('rejects a missing schema source', () => {
  assert.ok(
    validateDocumentationExperience(structuredClone(base), { sourceExists: () => false }).some(
      (error) => error.includes('schema does not exist'),
    ),
  );
});

test('rejects reordered or incomplete capability inventory', () => {
  const reordered = structuredClone(base);
  reordered.capabilities.reverse();
  assert.ok(validate(reordered).some((error) => error.includes('inventory')));
  const incomplete = structuredClone(base);
  incomplete.capabilities.pop();
  assert.ok(validate(incomplete).some((error) => error.includes('inventory')));
});

test('rejects incomplete ownership boundaries', () => {
  const contract = structuredClone(base);
  contract.boundaries.owned.pop();
  contract.boundaries.excluded.pop();
  assert.equal(validate(contract).length, 2);
});
