import assert from 'node:assert/strict';
import test from 'node:test';

import { validateVirtualizationFoundation } from './virtualization-foundation.mjs';

const modules = {
  'packages/virtualization/src/axis.ts':
    'createVirtualAxis VirtualAxis VirtualWindow VirtualItem VirtualMeasurement VirtualAxisMutation VirtualAnchor VirtualWindowOptions',
  'packages/virtualization/src/grid.ts': 'createVirtualGrid VirtualGrid VirtualGridWindow',
  'packages/virtualization/src/measurement.ts':
    'createElementMeasurementObserver ElementMeasurementObserver',
};
const base = {
  $schema: '../schemas/virtualization-foundation.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/virtualization',
  capabilities: [
    {
      id: 'axis-windowing',
      module: 'packages/virtualization/src/axis.ts',
      exports: ['createVirtualAxis'],
      evidence: ['unit', 'ssr', 'browser', 'typing', 'performance'],
    },
    {
      id: 'dynamic-measurement',
      module: 'packages/virtualization/src/axis.ts',
      exports: ['VirtualMeasurement'],
      evidence: ['unit', 'browser', 'typing', 'performance', 'security'],
    },
    {
      id: 'scroll-anchoring',
      module: 'packages/virtualization/src/axis.ts',
      exports: ['VirtualAnchor'],
      evidence: ['unit', 'browser', 'typing'],
    },
    {
      id: 'focus-pinning',
      module: 'packages/virtualization/src/axis.ts',
      exports: ['VirtualWindowOptions'],
      evidence: ['unit', 'browser', 'typing', 'accessibility'],
    },
    {
      id: 'two-dimensional-windowing',
      module: 'packages/virtualization/src/grid.ts',
      exports: ['createVirtualGrid'],
      evidence: ['unit', 'ssr', 'browser', 'typing', 'performance'],
    },
    {
      id: 'element-measurement',
      module: 'packages/virtualization/src/measurement.ts',
      exports: ['createElementMeasurementObserver'],
      evidence: ['unit', 'browser', 'typing', 'security'],
    },
  ],
  boundaries: {
    owned: [
      'framework-neutral one-dimensional estimated and measured window calculation with item overscan',
      'stable-key dynamic size measurement with bounded count and finite positive geometry validation',
      'explicit scroll adjustment that preserves a stable anchor across measurement and count changes',
      'disjoint pinned indexes that keep caller-owned focused or active items mounted',
      'two-dimensional row and column window composition without materializing a cell matrix',
      'explicit native ResizeObserver bridge that starts only after a browser constructor and elements are supplied',
      'dependency-free server-safe package imports with logarithmic offset lookup and measurement updates',
    ],
    excluded: [
      'public React components hooks providers renderers DOM structure styles or component event APIs',
      'collection registration active state selection tree projection or data processing',
      'focus movement restoration keyboard mapping ARIA roles names states announcements or tab order',
      'scroll container ownership event subscription scheduling rendering or browser scroll mutation',
      'automatic adaptive overscan velocity prediction infinite loading pagination or remote transport',
      'masonry lane packing sticky headers merged cells frozen panes or spreadsheet formulas',
      'locale formatting RTL browser scrollLeft normalization theme density CSS or responsive layout policy',
      'HTML URLs SVG files serialized executable data storage network or dynamic code execution',
      'reference-derived virtualization parity or future public list grid tree scheduler spreadsheet components',
      'F0.16 drag and drop autoscroll or any later-stage capability',
    ],
  },
};
const validate = (contract) =>
  validateVirtualizationFoundation(contract, {
    sourceExists: (path) =>
      path === 'registry/schemas/virtualization-foundation.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete virtualization contract', () => {
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
  duplicate.capabilities[1].id = 'axis-windowing';
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
