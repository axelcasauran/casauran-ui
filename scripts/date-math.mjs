const REQUIRED_CAPABILITIES = [
  'calendar-dates',
  'calendar-arithmetic',
  'week-arithmetic',
  'date-ranges',
  'wall-time-arithmetic',
  'time-zone-strategy',
];
const REQUIRED_EVIDENCE = {
  'calendar-dates': ['unit', 'ssr', 'browser', 'typing'],
  'calendar-arithmetic': ['unit', 'ssr', 'browser', 'typing'],
  'week-arithmetic': ['unit', 'ssr', 'browser', 'typing', 'i18n'],
  'date-ranges': ['unit', 'ssr', 'browser', 'typing'],
  'wall-time-arithmetic': ['unit', 'ssr', 'browser', 'typing'],
  'time-zone-strategy': ['unit', 'ssr', 'browser', 'security', 'typing', 'i18n'],
};
const REQUIRED_OWNED = [
  'immutable validated proleptic Gregorian calendar dates for years 1 through 9999',
  'calendar day month year week and ISO week arithmetic with explicit overflow behavior',
  'inclusive ordered calendar-date ranges with containment clamping intersection length and shifting',
  'validated wall-clock time and local date-time arithmetic with explicit day overflow',
  'provider-independent timezone strategy with native Intl IANA-zone conversion and explicit DST disambiguation',
  'framework-neutral dependency-free server-safe behavior with no global clock locale or timezone state',
];
const REQUIRED_EXCLUDED = [
  'public React components hooks providers contexts renderers or component event APIs',
  'locale messages number date-time display formatting collation or text direction owned by i18n',
  'recurrence parsing generation expansion exceptions or scheduling rules',
  'natural-language ISO date duration timezone or user-input parsing',
  'business calendars holidays working hours fiscal calendars or locale week-data policy',
  'mutable Date objects global current time implicit system timezone or request locale negotiation',
  'timezone database shipping updating persistence network lookup or external runtime adapters',
  'DOM CSS rendering focus keyboard pointer touch IME or accessibility semantics',
  'HTML URLs SVG files serialized executable input storage transport or dynamic code execution',
  'reference-derived date-math parity or future public calendar planning components',
  'F0.15 virtualization runtime or any later-stage capability',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateDateMath = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Date-math contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/date-math.schema.json') {
    errors.push('$schema must identify the date-math schema');
  }
  if (!sourceExists('registry/schemas/date-math.schema.json')) {
    errors.push('Date-math schema does not exist');
  }
  if (contract.package !== '@casauran-internal/date-math') {
    errors.push('Date-math package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Date-math capabilities must preserve the required inventory');
  }
  for (const id of ids.filter((value, index) => ids.indexOf(value) !== index)) {
    errors.push(`duplicate date-math capability ${id}`);
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
      if (!source.includes(exported))
        errors.push(`${capability.id} module does not expose ${exported}`);
    }
    if (!sameMembers(capability.evidence ?? [], REQUIRED_EVIDENCE[capability.id] ?? [])) {
      errors.push(`${capability.id} evidence is incomplete or excessive`);
    }
  }
  if (!sameMembers(contract.boundaries?.owned ?? [], REQUIRED_OWNED)) {
    errors.push('Date-math owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Date-math excluded boundary is incomplete or excessive');
  }
  return errors;
};
