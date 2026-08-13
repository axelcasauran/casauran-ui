import assert from 'node:assert/strict';
import test from 'node:test';

import { validateCollectionEngine } from './collection-engine.mjs';

const modules = {
  'packages/collections/src/snapshot.ts': 'CollectionInvariantError createCollectionSnapshot',
  'packages/collections/src/registry.ts': 'createCollectionRegistry',
  'packages/collections/src/active.ts': 'resolveActiveKey moveActiveKey',
  'packages/collections/src/selection.ts':
    'createSelectionState applySelectionIntent isKeySelected',
  'packages/collections/src/tree.ts': 'getVisibleKeys',
  'packages/collections/src/typeahead.ts':
    'updateTypeaheadState getTypeaheadQuery findTypeaheadMatch',
};
const base = {
  $schema: '../schemas/collection-engine.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/collections',
  capabilities: [
    ['snapshot', 'packages/collections/src/snapshot.ts', ['unit', 'ssr', 'typing', 'large-data']],
    ['registration', 'packages/collections/src/registry.ts', ['unit', 'typing']],
    ['active-item', 'packages/collections/src/active.ts', ['unit', 'ssr', 'typing']],
    ['selection', 'packages/collections/src/selection.ts', ['unit', 'ssr', 'typing']],
    ['visible-tree', 'packages/collections/src/tree.ts', ['unit', 'ssr', 'typing', 'large-data']],
    ['typeahead', 'packages/collections/src/typeahead.ts', ['unit', 'ssr', 'typing', 'security']],
  ].map(([id, module, evidence]) => ({
    id,
    module,
    exports: modules[module].split(' '),
    evidence,
  })),
  boundaries: {
    owned: [
      'immutable ordered and tree collection snapshots',
      'mutation-safe keyed registration and cleanup',
      'enabled active-item resolution and logical movement',
      'single multiple toggle and range selection models',
      'expanded-tree visible key projection',
      'caller-timed text-value typeahead matching',
    ],
    excluded: [
      'public React components hooks contexts or providers',
      'keyboard event to navigation intent mapping',
      'DOM focus roving tabindex or overlay focus lifecycle',
      'component-specific ARIA roles states or APG policies',
      'virtualization measurement scrolling or paging',
      'data sorting filtering grouping or transport',
      'locale ownership translation or collation policy',
      'persistent serialized or server-synchronized selection',
      'F0.10 overlay portal dismissal or positioning',
    ],
  },
};
const validate = (contract) =>
  validateCollectionEngine(contract, {
    sourceExists: (path) =>
      path === 'registry/schemas/collection-engine.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete collection engine contract', () => {
  assert.deepEqual(validate(structuredClone(base)), []);
});

test('rejects schema and package ownership drift', () => {
  const contract = structuredClone(base);
  contract.$schema = 'wrong.json';
  contract.package = '@casauran/react';
  assert.equal(validate(contract).length, 2);
});

test('rejects reordered and duplicate capability inventory', () => {
  const reordered = structuredClone(base);
  reordered.capabilities.reverse();
  assert.ok(validate(reordered).some((error) => error.includes('inventory')));
  const duplicate = structuredClone(base);
  duplicate.capabilities[1].id = 'snapshot';
  assert.ok(validate(duplicate).some((error) => error.includes('duplicate')));
});

test('rejects missing module exports and evidence drift', () => {
  const contract = structuredClone(base);
  contract.capabilities[0].module = 'missing.ts';
  contract.capabilities[1].exports.push('missingExport');
  contract.capabilities[2].evidence = ['unit'];
  assert.equal(validate(contract).length, 3);
});

test('rejects incomplete ownership boundaries', () => {
  const contract = structuredClone(base);
  contract.boundaries.owned.pop();
  contract.boundaries.excluded.pop();
  assert.equal(validate(contract).length, 2);
});
