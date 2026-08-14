const REQUIRED_CAPABILITIES = [
  'data-descriptors',
  'field-access',
  'filtering',
  'sorting',
  'aggregation',
  'grouping',
  'paging-processing',
];
const REQUIRED_EVIDENCE = {
  'data-descriptors': ['unit', 'ssr', 'typing'],
  'field-access': ['unit', 'ssr', 'security', 'typing'],
  filtering: ['unit', 'ssr', 'security', 'typing', 'performance'],
  sorting: ['unit', 'ssr', 'typing', 'performance'],
  aggregation: ['unit', 'ssr', 'typing'],
  grouping: ['unit', 'ssr', 'typing', 'performance'],
  'paging-processing': ['unit', 'ssr', 'browser', 'typing', 'performance'],
};
const REQUIRED_OWNED = [
  'serializable filter sort group aggregate page and composite data-state descriptors',
  'own-property field access with missing fields represented as undefined',
  'deterministic immutable filtering stable sorting grouping aggregation and paging',
  'provider-neutral client and server state processing without transport assumptions',
  'bounded runtime validation for untrusted recursive filter descriptor structures',
];
const REQUIRED_EXCLUDED = [
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
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateDataEngine = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Data engine contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/data-engine.schema.json') {
    errors.push('$schema must identify the data engine schema');
  }
  if (!sourceExists('registry/schemas/data-engine.schema.json')) {
    errors.push('Data engine schema does not exist');
  }
  if (contract.package !== '@casauran-internal/data') {
    errors.push('Data engine package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Data capabilities must preserve the required engine inventory');
  }
  for (const id of ids.filter((value, index) => ids.indexOf(value) !== index)) {
    errors.push(`duplicate data capability ${id}`);
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
    errors.push('Data owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Data excluded boundary is incomplete or excessive');
  }
  return errors;
};
