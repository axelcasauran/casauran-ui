const REQUIRED_CAPABILITIES = [
  'snapshot',
  'registration',
  'active-item',
  'selection',
  'visible-tree',
  'typeahead',
];
const REQUIRED_EVIDENCE = {
  snapshot: ['unit', 'ssr', 'typing', 'large-data'],
  registration: ['unit', 'typing'],
  'active-item': ['unit', 'ssr', 'typing'],
  selection: ['unit', 'ssr', 'typing'],
  'visible-tree': ['unit', 'ssr', 'typing', 'large-data'],
  typeahead: ['unit', 'ssr', 'typing', 'security'],
};
const REQUIRED_OWNED = [
  'immutable ordered and tree collection snapshots',
  'mutation-safe keyed registration and cleanup',
  'enabled active-item resolution and logical movement',
  'single multiple toggle and range selection models',
  'expanded-tree visible key projection',
  'caller-timed text-value typeahead matching',
];
const REQUIRED_EXCLUDED = [
  'public React components hooks contexts or providers',
  'keyboard event to navigation intent mapping',
  'DOM focus roving tabindex or overlay focus lifecycle',
  'component-specific ARIA roles states or APG policies',
  'virtualization measurement scrolling or paging',
  'data sorting filtering grouping or transport',
  'locale ownership translation or collation policy',
  'persistent serialized or server-synchronized selection',
  'F0.10 overlay portal dismissal or positioning',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateCollectionEngine = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Collection engine contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/collection-engine.schema.json') {
    errors.push('$schema must identify the collection engine schema');
  }
  if (!sourceExists('registry/schemas/collection-engine.schema.json')) {
    errors.push('Collection engine schema does not exist');
  }
  if (contract.package !== '@casauran-internal/collections') {
    errors.push('Collection engine package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Collection engine capabilities must preserve the required inventory');
  }
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of duplicateIds) errors.push(`duplicate collection engine capability ${id}`);
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
    errors.push('Collection engine owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Collection engine excluded boundary is incomplete or excessive');
  }
  return errors;
};
