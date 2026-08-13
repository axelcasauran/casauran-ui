const REQUIRED_CAPABILITIES = [
  'state-resolution',
  'id-normalization',
  'committed-callback',
  'controllable-state',
  'hydration-state',
];
const REQUIRED_OWNERS = {
  'state-resolution': 'packages/core',
  'id-normalization': 'packages/core',
  'committed-callback': 'packages/react',
  'controllable-state': 'packages/react',
  'hydration-state': 'packages/react',
};
const REQUIRED_EVIDENCE = {
  'state-resolution': ['unit', 'typing'],
  'id-normalization': ['unit', 'ssr', 'typing'],
  'committed-callback': ['unit', 'hydration', 'browser', 'typing'],
  'controllable-state': ['unit', 'ssr', 'hydration', 'browser', 'typing'],
  'hydration-state': ['unit', 'ssr', 'hydration', 'browser', 'typing'],
};
const REQUIRED_OWNED = [
  'framework-neutral controlled value and state update resolution',
  'framework-neutral generated ID normalization',
  'latest committed callback invocation with stable identity',
  'controlled and uncontrolled React state coordination',
  'hydration readiness and hydration-stable React IDs',
];
const REQUIRED_EXCLUDED = [
  'public component implementation',
  'global state stores or context frameworks',
  'collection registration active item selection or typeahead',
  'overlay open state focus lifecycle or dismissal',
  'form validation or field state',
  'persistent or serialized state',
  'component-specific state machines',
  'reference-derived data-binding parity claims',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateReactStateFoundation = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['React state foundation contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/react-state-foundation.schema.json') {
    errors.push('$schema must identify the React state foundation schema');
  }
  if (!sourceExists('registry/schemas/react-state-foundation.schema.json')) {
    errors.push('React state foundation schema does not exist');
  }
  if (
    contract.packages?.core !== '@casauran-internal/core' ||
    contract.packages?.reactEntryPoint !== '@casauran/react/state'
  ) {
    errors.push('React state foundation package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('React state capabilities must preserve the required foundation inventory');
  }
  for (const id of duplicates(ids)) errors.push(`duplicate React state capability ${id}`);

  for (const capability of capabilities) {
    if (capability.owner !== REQUIRED_OWNERS[capability.id]) {
      errors.push(`${capability.id} owner is invalid`);
    }
    const shouldBeClient = capability.owner === 'packages/react';
    if (capability.clientBoundary !== shouldBeClient) {
      errors.push(`${capability.id} client boundary is invalid`);
    }
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
    errors.push('React state owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('React state excluded boundary is incomplete or excessive');
  }
  return errors;
};
