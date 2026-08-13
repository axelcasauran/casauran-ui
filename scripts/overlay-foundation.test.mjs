import assert from 'node:assert/strict';
import test from 'node:test';

import { validateOverlayFoundation } from './overlay-foundation.mjs';

const modules = {
  'packages/overlay/src/portal.ts': 'createPortalHost synchronizePortalScope',
  'packages/overlay/src/layer-stack.ts': 'createOverlayLayerStack',
  'packages/overlay/src/dismissable-layer.ts': 'createDismissableLayerManager',
  'packages/overlay/src/focus-scope.ts': 'createFocusScopeManager',
  'packages/overlay/src/modal-isolation.ts': 'createModalIsolationManager',
};
const evidence = {
  'portal-host': ['unit', 'ssr', 'browser', 'typing'],
  'layer-stack': ['unit', 'ssr', 'typing'],
  'dismissable-layer': ['unit', 'ssr', 'browser', 'accessibility', 'typing', 'security'],
  'focus-scope': ['unit', 'ssr', 'browser', 'accessibility', 'typing'],
  'modal-isolation': ['unit', 'ssr', 'browser', 'accessibility', 'typing'],
};
const moduleById = {
  'portal-host': 'packages/overlay/src/portal.ts',
  'layer-stack': 'packages/overlay/src/layer-stack.ts',
  'dismissable-layer': 'packages/overlay/src/dismissable-layer.ts',
  'focus-scope': 'packages/overlay/src/focus-scope.ts',
  'modal-isolation': 'packages/overlay/src/modal-isolation.ts',
};
const base = {
  $schema: '../schemas/overlay-foundation.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/overlay',
  capabilities: Object.entries(moduleById).map(([id, module]) => ({
    id,
    module,
    exports: modules[module].split(' '),
    evidence: evidence[id],
  })),
  boundaries: {
    owned: [
      'portal host creation cleanup and theme density direction synchronization',
      'token-safe ordered layer registration and top-layer arbitration',
      'top-layer Escape and pointer-outside dismissal intent',
      'nested focus entry containment Tab traversal and restoration',
      'nested modal background isolation with native inert restoration',
    ],
    excluded: [
      'public React components hooks contexts or providers',
      'positioning geometry placement collision viewport constraints or observers',
      'animation transition presence or motion orchestration',
      'component-specific roles names states or APG keyboard tables',
      'application open state controlled state or business workflow',
      'overlay content rendering HTML parsing URL handling or sanitization',
      'scroll locking overscroll or scrollbar compensation policy',
      'component visual styling tokens layout or arrow rendering',
      'F0.11 animation foundation or later public Popup Tooltip Popover Dialog Menu',
    ],
  },
};
const validate = (contract) =>
  validateOverlayFoundation(contract, {
    sourceExists: (path) =>
      path === 'registry/schemas/overlay-foundation.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete overlay foundation contract', () => {
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
  duplicate.capabilities[1].id = 'portal-host';
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
