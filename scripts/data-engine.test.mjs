import assert from 'node:assert/strict';
import test from 'node:test';

import { validateDataEngine } from './data-engine.mjs';

const modules = {
  'packages/data/src/descriptors.ts':
    'DataState DataResult FilterDescriptor SortDescriptor GroupDescriptor AggregateDescriptor PageDescriptor',
  'packages/data/src/fields.ts': 'getFieldValue',
  'packages/data/src/filter.ts': 'filterData',
  'packages/data/src/sort.ts': 'sortData',
  'packages/data/src/aggregate.ts': 'aggregateData',
  'packages/data/src/group.ts': 'groupData',
  'packages/data/src/process.ts': 'pageData processData',
};
const evidence = {
  'data-descriptors': ['unit', 'ssr', 'typing'],
  'field-access': ['unit', 'ssr', 'security', 'typing'],
  filtering: ['unit', 'ssr', 'security', 'typing', 'performance'],
  sorting: ['unit', 'ssr', 'typing', 'performance'],
  aggregation: ['unit', 'ssr', 'typing'],
  grouping: ['unit', 'ssr', 'typing', 'performance'],
  'paging-processing': ['unit', 'ssr', 'browser', 'typing', 'performance'],
};
const moduleById = {
  'data-descriptors': 'packages/data/src/descriptors.ts',
  'field-access': 'packages/data/src/fields.ts',
  filtering: 'packages/data/src/filter.ts',
  sorting: 'packages/data/src/sort.ts',
  aggregation: 'packages/data/src/aggregate.ts',
  grouping: 'packages/data/src/group.ts',
  'paging-processing': 'packages/data/src/process.ts',
};
const base = {
  $schema: '../schemas/data-engine.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/data',
  capabilities: Object.entries(moduleById).map(([id, module]) => ({
    id,
    module,
    exports: modules[module].split(' '),
    evidence: evidence[id],
  })),
  boundaries: {
    owned: [
      'serializable filter sort group aggregate page and composite data-state descriptors',
      'own-property field access with missing fields represented as undefined',
      'deterministic immutable filtering stable sorting grouping aggregation and paging',
      'provider-neutral client and server state processing without transport assumptions',
      'bounded runtime validation for untrusted recursive filter descriptor structures',
    ],
    excluded: [
      'public React components hooks contexts renderers or component event APIs',
      'database REST GraphQL query generation fetching caching mutation or synchronization',
      'persistence serialization version migration storage or URL state encoding',
      'virtualization windowing measurement scrolling or viewport ownership',
      'locale-aware comparison collation parsing formatting messages or F0.13 internationalization',
      'tree hierarchy projection pivot cube formula recurrence chart or scheduler processing',
      'selection active item focus keyboard pointer touch drag drop or IME behavior',
      'HTML URL SVG file clipboard content rendering sanitization or dynamic execution',
      'component-specific defaults business rules column models or server protocol conventions',
      'F0.13 internationalization runtime or future public Grid TreeList ListView components',
    ],
  },
};
const validate = (contract) =>
  validateDataEngine(contract, {
    sourceExists: (path) => path === 'registry/schemas/data-engine.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete data engine contract', () => {
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
  duplicate.capabilities[1].id = 'data-descriptors';
  assert.ok(validate(duplicate).some((error) => error.includes('duplicate')));
});

test('rejects missing modules, exports, and evidence', () => {
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
