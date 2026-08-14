const REQUIRED_CAPABILITIES = [
  'locale-resolution',
  'text-direction',
  'message-catalogs',
  'plural-selection',
  'number-formatting',
  'date-time-formatting',
  'collation',
];
const REQUIRED_EVIDENCE = {
  'locale-resolution': ['unit', 'ssr', 'browser', 'typing'],
  'text-direction': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  'message-catalogs': ['unit', 'ssr', 'browser', 'security', 'typing', 'accessibility'],
  'plural-selection': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  'number-formatting': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  'date-time-formatting': ['unit', 'ssr', 'browser', 'typing', 'accessibility'],
  collation: ['unit', 'ssr', 'browser', 'typing'],
};
const REQUIRED_OWNED = [
  'BCP 47 locale canonicalization and deterministic explicit fallback chains',
  'locale-derived text direction with explicit application override',
  'stable flat message identifiers plain-text catalogs safe interpolation and fallback resolution',
  'cardinal and ordinal plural category selection through the native Intl platform',
  'locale-aware number date-time formatting and string collation through native Intl factories',
  'framework-neutral immutable server-safe behavior with no module-global locale state',
];
const REQUIRED_EXCLUDED = [
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
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateInternationalization = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Internationalization contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/internationalization.schema.json') {
    errors.push('$schema must identify the internationalization schema');
  }
  if (!sourceExists('registry/schemas/internationalization.schema.json')) {
    errors.push('Internationalization schema does not exist');
  }
  if (contract.package !== '@casauran-internal/i18n') {
    errors.push('Internationalization package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Internationalization capabilities must preserve the required inventory');
  }
  for (const id of ids.filter((value, index) => ids.indexOf(value) !== index)) {
    errors.push(`duplicate internationalization capability ${id}`);
  }
  for (const capability of capabilities) {
    if (!sourceExists(capability.module ?? '')) {
      errors.push(`${capability.id} module does not exist: ${capability.module}`);
      continue;
    }
    const source = sourceTexts[capability.module] ?? '';
    const exports = Array.isArray(capability.exports) ? capability.exports : [];
    if (exports.length === 0) errors.push(`${capability.id} must define exports`);
    for (const exported of exports) {
      if (!source.includes(exported)) {
        errors.push(`${capability.id} module does not expose ${exported}`);
      }
    }
    if (!sameMembers(capability.evidence ?? [], REQUIRED_EVIDENCE[capability.id] ?? [])) {
      errors.push(`${capability.id} evidence is incomplete or excessive`);
    }
  }
  if (!sameMembers(contract.boundaries?.owned ?? [], REQUIRED_OWNED)) {
    errors.push('Internationalization owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Internationalization excluded boundary is incomplete or excessive');
  }
  return errors;
};
