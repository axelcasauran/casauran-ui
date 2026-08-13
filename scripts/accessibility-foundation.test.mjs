import assert from 'node:assert/strict';
import test from 'node:test';

import { validateAccessibilityFoundation } from './accessibility-foundation.mjs';

const capabilities = [
  ['focus', ['isElementTabbable', 'getTabbableElements', 'tryFocus'], ['unit', 'browser']],
  [
    'roving-focus',
    ['resolveRovingTabStop', 'getRovingTabIndex', 'moveRovingFocus'],
    ['unit', 'browser'],
  ],
  [
    'keyboard',
    [
      'getDirectionalNavigationIntent',
      'isActivationKey',
      'isDismissKey',
      'isKeyboardEventModified',
    ],
    ['unit', 'browser'],
  ],
  [
    'live-region',
    ['getLiveRegionAttributes', 'createLiveRegionController'],
    ['unit', 'browser', 'ssr', 'accessibility-tree', 'security'],
  ],
  ['visually-hidden', ['data-csn-visually-hidden'], ['browser', 'accessibility-tree']],
].map(([id, exports, evidence]) => ({
  id,
  module: `packages/accessibility/src/${id}.ts`,
  exports,
  evidence,
}));
capabilities[4].module = 'packages/accessibility/src/accessibility.css';

const fixture = {
  $schema: '../schemas/accessibility-foundation.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/accessibility',
  baseline: { wcag: '2.2 AA', semanticHtmlFirst: true, apgPatternSpecific: true },
  capabilities,
  boundaries: {
    owned: [
      'native focusability and tabbability inspection',
      'one-shot focus attempts',
      'pure roving-tab-stop calculation',
      'direction-aware keyboard intent',
      'safe text-only live-region announcements',
      'static visually-hidden utility',
    ],
    excluded: [
      'public React components or hooks',
      'controlled or uncontrolled React state',
      'collection registration or selection',
      'focus traps or overlay focus lifecycle',
      'component-specific ARIA roles or APG behavior',
      'screen-reader certification claims',
    ],
  },
};
const sources = Object.fromEntries(
  capabilities.map((capability) => [capability.module, capability.exports.join(' ')]),
);
const options = {
  sourceExists: () => true,
  sourceTexts: sources,
};

test('accepts the complete accessibility foundation contract', () => {
  assert.deepEqual(validateAccessibilityFoundation(fixture, options), []);
});

test('rejects baseline and owner package drift', () => {
  const contract = structuredClone(fixture);
  contract.package = '@casauran/accessibility';
  contract.baseline.semanticHtmlFirst = false;
  const errors = validateAccessibilityFoundation(contract, options);
  assert.ok(errors.some((error) => error.includes('owner package')));
  assert.ok(errors.some((error) => error.includes('baseline')));
});

test('rejects missing, reordered, and duplicate capabilities', () => {
  const contract = structuredClone(fixture);
  contract.capabilities.reverse();
  contract.capabilities.push(structuredClone(contract.capabilities[0]));
  const errors = validateAccessibilityFoundation(contract, options);
  assert.ok(errors.some((error) => error.includes('required foundation inventory')));
  assert.ok(errors.some((error) => error.includes('duplicate accessibility capability')));
});

test('rejects missing modules and declared export drift', () => {
  const contract = structuredClone(fixture);
  contract.capabilities[0].module = 'missing.ts';
  contract.capabilities[1].exports.push('missingExport');
  const errors = validateAccessibilityFoundation(contract, {
    sourceExists: (source) => source !== 'missing.ts',
    sourceTexts: sources,
  });
  assert.ok(errors.some((error) => error.includes('module does not exist')));
  assert.ok(errors.some((error) => error.includes('does not expose missingExport')));
});

test('rejects incomplete evidence and ownership boundaries', () => {
  const contract = structuredClone(fixture);
  contract.capabilities[3].evidence.pop();
  contract.boundaries.owned.pop();
  contract.boundaries.excluded.pop();
  const errors = validateAccessibilityFoundation(contract, options);
  assert.ok(errors.some((error) => error.includes('evidence is incomplete')));
  assert.ok(errors.some((error) => error.includes('owned boundary')));
  assert.ok(errors.some((error) => error.includes('excluded boundary')));
});
