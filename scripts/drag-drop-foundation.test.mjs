import assert from 'node:assert/strict';
import test from 'node:test';

import { validateDragDropFoundation } from './drag-drop-foundation.mjs';

const modules = {
  'packages/drag-drop/src/session.ts':
    'createDragSession DragSession DragSnapshot PointerDragStart KeyboardDragStart DragCompletion',
  'packages/drag-drop/src/geometry.ts':
    'createDropTargetRegistry DropTargetRegistry DragCollisionStrategy',
  'packages/drag-drop/src/pointer.ts':
    'createPointerDragController PointerDragController PointerCaptureElementLike',
  'packages/drag-drop/src/autoscroll.ts':
    'calculateAutoScrollDelta createAutoScroller AutoScroller',
};
const base = {
  $schema: '../schemas/drag-drop-foundation.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/drag-drop',
  capabilities: [
    {
      id: 'pointer-session',
      module: 'packages/drag-drop/src/session.ts',
      exports: ['createDragSession'],
      evidence: ['unit', 'ssr', 'browser', 'typing', 'security'],
    },
    {
      id: 'target-collision',
      module: 'packages/drag-drop/src/geometry.ts',
      exports: ['createDropTargetRegistry'],
      evidence: ['unit', 'ssr', 'browser', 'typing', 'performance', 'security'],
    },
    {
      id: 'pointer-capture',
      module: 'packages/drag-drop/src/pointer.ts',
      exports: ['createPointerDragController'],
      evidence: ['unit', 'browser', 'typing', 'accessibility', 'security'],
    },
    {
      id: 'keyboard-session',
      module: 'packages/drag-drop/src/session.ts',
      exports: ['KeyboardDragStart'],
      evidence: ['unit', 'browser', 'typing', 'accessibility'],
    },
    {
      id: 'cancellation-cleanup',
      module: 'packages/drag-drop/src/pointer.ts',
      exports: ['PointerCaptureElementLike'],
      evidence: ['unit', 'browser', 'typing', 'accessibility', 'security'],
    },
    {
      id: 'autoscroll',
      module: 'packages/drag-drop/src/autoscroll.ts',
      exports: ['createAutoScroller'],
      evidence: ['unit', 'browser', 'typing', 'performance', 'security'],
    },
  ],
  boundaries: {
    owned: [
      'framework-neutral pointer and keyboard drag session state with explicit activation threshold and immutable snapshots',
      'token-safe drop target registration with pointer rectangle-intersection and closest-center collision strategies',
      'explicit native Pointer Events capture lifecycle for primary mouse pen and touch input',
      'deterministic drop cancellation pointer-cancel capture-loss and disposal completion',
      'bounded edge-proximity autoscroll with caller-supplied frame scheduling and inner-to-outer containers',
      'opaque generic payload and target data transport without rendering parsing serialization or execution',
      'dependency-free server-safe package imports with browser work beginning only after explicit mounted owners are supplied',
    ],
    excluded: [
      'public React components hooks providers sensors renderers drag previews DOM structure styles or component event APIs',
      'collection ordering selection tree state data mutation commands history persistence or optimistic server updates',
      'focus movement restoration ARIA roles names states live announcements or component keyboard tables',
      'automatic item reordering resize rotate lasso selection snapping guides or domain-specific drag constraints',
      'HTML5 DataTransfer file external-window clipboard operating-system or cross-document drag transport',
      'overlay portals positioning animation theme density CSS forced-colors reduced-motion or responsive rendering policy',
      'locale formatting RTL browser scrollLeft normalization IME text commit or translated announcement policy',
      'untrusted callback construction HTML URLs SVG files storage network dynamic code or serialized executable payloads',
      'reference-derived drag-drop parity or future Sortable Grid TaskBoard Scheduler Gantt Diagram Upload components',
      'F0.17 reference baseline analysis or any later-stage capability',
    ],
  },
};
const validate = (contract) =>
  validateDragDropFoundation(contract, {
    sourceExists: (path) =>
      path === 'registry/schemas/drag-drop-foundation.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete drag-drop contract', () => {
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
  duplicate.capabilities[1].id = 'pointer-session';
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
