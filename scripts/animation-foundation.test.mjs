import assert from 'node:assert/strict';
import test from 'node:test';

import { validateAnimationFoundation } from './animation-foundation.mjs';

const modules = {
  'packages/animation/src/timing.ts': 'parseMotionTime resolveMotionTiming',
  'packages/animation/src/reduced-motion.ts':
    'getReducedMotionPreference createReducedMotionController',
  'packages/animation/src/playback.ts': 'playElementAnimation',
  'packages/animation/src/registry.ts': 'createAnimationRegistry',
  'packages/animation/src/presence.ts': 'createPresenceState transitionPresence completePresence',
};
const evidence = {
  'motion-timing': ['unit', 'ssr', 'typing'],
  'reduced-motion': ['unit', 'ssr', 'browser', 'accessibility', 'typing'],
  'waapi-playback': ['ssr', 'browser', 'accessibility', 'typing', 'performance'],
  'animation-registry': ['unit', 'ssr', 'browser', 'typing', 'performance'],
  'presence-state': ['unit', 'ssr', 'typing'],
};
const moduleById = {
  'motion-timing': 'packages/animation/src/timing.ts',
  'reduced-motion': 'packages/animation/src/reduced-motion.ts',
  'waapi-playback': 'packages/animation/src/playback.ts',
  'animation-registry': 'packages/animation/src/registry.ts',
  'presence-state': 'packages/animation/src/presence.ts',
};
const base = {
  $schema: '../schemas/animation-foundation.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/animation',
  capabilities: Object.entries(moduleById).map(([id, module]) => ({
    id,
    module,
    exports: modules[module].split(' '),
    evidence: evidence[id],
  })),
  boundaries: {
    owned: [
      'finite token-resolved motion time parsing and reduced-motion timing resolution',
      'explicit prefers-reduced-motion observation and disposable change notification',
      'Web Animations API playback completion cancellation abort and reduced-motion finalization',
      'keyed interruption-safe animation ownership and cleanup',
      'revision-safe enter exit presence state without timers or rendering ownership',
    ],
    excluded: [
      'public React components hooks contexts transition groups or providers',
      'component-specific keyframes effect presets choreography or visual design',
      'CSS token values theme assignments or reduced-motion media CSS',
      'positioning layout measurement collision scrolling or viewport observation',
      'gesture physics springs inertia drag scrolling or timeline scrubbing',
      'scroll-driven view-transition canvas SVG or worklet animation policy',
      'semantic roles focus keyboard pointer touch or announcement behavior',
      'unmount rendering DOM insertion content styling or application open state',
      'F0.12 data descriptors processing transport or future public animation components',
    ],
  },
};
const validate = (contract) =>
  validateAnimationFoundation(contract, {
    sourceExists: (path) =>
      path === 'registry/schemas/animation-foundation.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete animation foundation contract', () => {
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
  duplicate.capabilities[1].id = 'motion-timing';
  assert.ok(validate(duplicate).some((error) => error.includes('duplicate')));
});

test('rejects missing modules, exports, and evidence', () => {
  const contract = structuredClone(base);
  contract.capabilities[0].module = 'missing.ts';
  contract.capabilities[1].exports.push('missingExport');
  contract.capabilities[2].evidence = ['ssr'];
  assert.equal(validate(contract).length, 3);
});

test('rejects incomplete ownership boundaries', () => {
  const contract = structuredClone(base);
  contract.boundaries.owned.pop();
  contract.boundaries.excluded.pop();
  assert.equal(validate(contract).length, 2);
});
