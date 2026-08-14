import assert from 'node:assert/strict';
import test from 'node:test';

import { validateInternationalization } from './internationalization.mjs';

const modules = {
  'packages/i18n/src/locale.ts': 'canonicalizeLocale getLocaleFallbackChain',
  'packages/i18n/src/direction.ts': 'getLocaleDirection resolveDirection TextDirection',
  'packages/i18n/src/messages.ts':
    'createMessageCatalog formatMessage resolveMessage MessageCatalog MessageParameter ResolvedMessage',
  'packages/i18n/src/plural.ts': 'selectPluralMessage PluralMessageSet PluralSelection',
  'packages/i18n/src/number.ts': 'createNumberFormatter formatNumber NumberFormatter',
  'packages/i18n/src/date-time.ts': 'createDateTimeFormatter formatDateTime DateTimeFormatter',
  'packages/i18n/src/collation.ts': 'createCollator compareLocalized LocalizedCollator',
};
const evidence = {
  'locale-resolution': ['unit', 'ssr', 'browser', 'typing'],
  'text-direction': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  'message-catalogs': ['unit', 'ssr', 'browser', 'security', 'typing', 'accessibility'],
  'plural-selection': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  'number-formatting': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  'date-time-formatting': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  collation: ['unit', 'ssr', 'browser', 'typing'],
};
const capabilityIds = Object.keys(evidence);
const base = {
  $schema: '../schemas/internationalization.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/i18n',
  capabilities: capabilityIds.map((id, index) => {
    const module = Object.keys(modules)[index];
    return { id, module, exports: modules[module].split(' '), evidence: evidence[id] };
  }),
  boundaries: {
    owned: [
      'BCP 47 locale canonicalization and deterministic explicit fallback chains',
      'locale-derived text direction with explicit application override',
      'stable flat message identifiers plain-text catalogs safe interpolation and fallback resolution',
      'cardinal and ordinal plural category selection through the native Intl platform',
      'locale-aware number date-time formatting and string collation through native Intl factories',
      'framework-neutral immutable server-safe behavior with no module-global locale state',
    ],
    excluded: [
      'public React components hooks providers contexts renderers or component event APIs',
      'calendar date range time arithmetic timezone conversion or F0.14 date-math implementation',
      'recurrence parsing generation expansion or scheduling rules',
      'number date time duration message or locale parsing from user input',
      'translation authoring loading fetching persistence storage routing or locale negotiation from requests',
      'trusted HTML rich-text templates dynamic code execution URLs SVG files or sanitization',
      'CSS mirroring string reversal focus keyboard pointer touch or IME composition ownership',
      'global mutable locale catalog formatter or collator singletons',
      'external localization adapters runtime dependencies or third-party public types',
      'reference-derived platform parity or future public localized components',
      'F0.14 date-math runtime or any later-stage capability',
    ],
  },
};
const validate = (contract) =>
  validateInternationalization(contract, {
    sourceExists: (path) =>
      path === 'registry/schemas/internationalization.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete internationalization contract', () => {
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
  duplicate.capabilities[1].id = 'locale-resolution';
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
