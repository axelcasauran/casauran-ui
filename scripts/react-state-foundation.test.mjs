import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReactStateFoundation } from './react-state-foundation.mjs';

const sourceTexts = {
  'packages/core/src/state.ts': 'isControlledValue resolveControllableValue resolveStateUpdate',
  'packages/core/src/id.ts': 'normalizeIdPart createScopedId',
  'packages/react/src/state/use-committed-callback.ts': 'useCommittedCallback',
  'packages/react/src/state/use-controllable-state.ts': 'useControllableState',
  'packages/react/src/state/use-hydrated.ts': 'useHydrated useStableId',
};
const base = {
  $schema: '../schemas/react-state-foundation.schema.json',
  schemaVersion: 1,
  packages: {
    core: '@casauran-internal/core',
    reactEntryPoint: '@casauran/react/state',
  },
  capabilities: [
    ['state-resolution', 'packages/core', 'packages/core/src/state.ts', ['unit', 'typing']],
    ['id-normalization', 'packages/core', 'packages/core/src/id.ts', ['unit', 'ssr', 'typing']],
    [
      'committed-callback',
      'packages/react',
      'packages/react/src/state/use-committed-callback.ts',
      ['unit', 'hydration', 'browser', 'typing'],
    ],
    [
      'controllable-state',
      'packages/react',
      'packages/react/src/state/use-controllable-state.ts',
      ['unit', 'ssr', 'hydration', 'browser', 'typing'],
    ],
    [
      'hydration-state',
      'packages/react',
      'packages/react/src/state/use-hydrated.ts',
      ['unit', 'ssr', 'hydration', 'browser', 'typing'],
    ],
  ].map(([id, owner, module, evidence]) => ({
    id,
    owner,
    module,
    exports:
      id === 'state-resolution'
        ? ['isControlledValue', 'resolveControllableValue', 'resolveStateUpdate']
        : id === 'id-normalization'
          ? ['normalizeIdPart', 'createScopedId']
          : id === 'committed-callback'
            ? ['useCommittedCallback']
            : id === 'controllable-state'
              ? ['useControllableState']
              : ['useHydrated', 'useStableId'],
    clientBoundary: owner === 'packages/react',
    evidence,
  })),
  boundaries: {
    owned: [
      'framework-neutral controlled value and state update resolution',
      'framework-neutral generated ID normalization',
      'latest committed callback invocation with stable identity',
      'controlled and uncontrolled React state coordination',
      'hydration readiness and hydration-stable React IDs',
    ],
    excluded: [
      'public component implementation',
      'global state stores or context frameworks',
      'collection registration active item selection or typeahead',
      'overlay open state focus lifecycle or dismissal',
      'form validation or field state',
      'persistent or serialized state',
      'component-specific state machines',
      'reference-derived data-binding parity claims',
    ],
  },
};
const validate = (contract) =>
  validateReactStateFoundation(contract, {
    sourceExists: (path) =>
      path === 'registry/schemas/react-state-foundation.schema.json' || path in sourceTexts,
    sourceTexts,
  });

test('accepts the complete React state foundation contract', () => {
  assert.deepEqual(validate(structuredClone(base)), []);
});

test('rejects package and schema drift', () => {
  const contract = structuredClone(base);
  contract.packages.reactEntryPoint = '@casauran/react';
  contract.$schema = 'wrong.json';
  assert.equal(validate(contract).length, 2);
});

test('rejects reordered, duplicate, and missing capability inventory', () => {
  const reordered = structuredClone(base);
  reordered.capabilities.reverse();
  assert.ok(validate(reordered).some((error) => error.includes('inventory')));
  const duplicate = structuredClone(base);
  duplicate.capabilities[1].id = 'state-resolution';
  assert.ok(validate(duplicate).some((error) => error.includes('duplicate')));
});

test('rejects owner, client-boundary, export, and evidence drift', () => {
  const contract = structuredClone(base);
  contract.capabilities[2].owner = 'packages/core';
  contract.capabilities[3].clientBoundary = false;
  contract.capabilities[4].exports.push('missingExport');
  contract.capabilities[0].evidence = ['unit'];
  assert.equal(validate(contract).length, 5);
});

test('rejects incomplete ownership boundaries', () => {
  const contract = structuredClone(base);
  contract.boundaries.owned.pop();
  contract.boundaries.excluded.pop();
  assert.equal(validate(contract).length, 2);
});
