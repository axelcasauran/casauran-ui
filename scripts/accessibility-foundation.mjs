const REQUIRED_CAPABILITIES = [
  'focus',
  'roving-focus',
  'keyboard',
  'live-region',
  'visually-hidden',
];
const REQUIRED_EVIDENCE = {
  focus: ['unit', 'browser'],
  'roving-focus': ['unit', 'browser'],
  keyboard: ['unit', 'browser'],
  'live-region': ['unit', 'browser', 'ssr', 'accessibility-tree', 'security'],
  'visually-hidden': ['browser', 'accessibility-tree'],
};
const REQUIRED_OWNED = [
  'native focusability and tabbability inspection',
  'one-shot focus attempts',
  'pure roving-tab-stop calculation',
  'direction-aware keyboard intent',
  'safe text-only live-region announcements',
  'static visually-hidden utility',
];
const REQUIRED_EXCLUDED = [
  'public React components or hooks',
  'controlled or uncontrolled React state',
  'collection registration or selection',
  'focus traps or overlay focus lifecycle',
  'component-specific ARIA roles or APG behavior',
  'screen-reader certification claims',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateAccessibilityFoundation = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['accessibility foundation contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/accessibility-foundation.schema.json') {
    errors.push('$schema must identify the accessibility foundation schema');
  }
  if (!sourceExists('registry/schemas/accessibility-foundation.schema.json')) {
    errors.push('accessibility foundation schema does not exist');
  }
  if (contract.package !== '@casauran-internal/accessibility') {
    errors.push('accessibility owner package is invalid');
  }
  if (
    contract.baseline?.wcag !== '2.2 AA' ||
    contract.baseline?.semanticHtmlFirst !== true ||
    contract.baseline?.apgPatternSpecific !== true
  ) {
    errors.push('accessibility baseline must require WCAG 2.2 AA, semantic HTML, and pattern APG');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('accessibility capabilities must preserve the required foundation inventory');
  }
  for (const id of duplicates(ids)) errors.push(`duplicate accessibility capability ${id}`);

  for (const capability of capabilities) {
    if (!sourceExists(capability.module ?? '')) {
      errors.push(`${capability.id} module does not exist: ${capability.module}`);
      continue;
    }
    const exports = Array.isArray(capability.exports) ? capability.exports : [];
    if (exports.length === 0) errors.push(`${capability.id} must define exports`);
    const source = sourceTexts[capability.module] ?? '';
    for (const exported of exports) {
      if (!source.includes(exported))
        errors.push(`${capability.id} module does not expose ${exported}`);
    }
    const requiredEvidence = REQUIRED_EVIDENCE[capability.id] ?? [];
    if (!sameMembers(capability.evidence ?? [], requiredEvidence)) {
      errors.push(`${capability.id} evidence is incomplete or excessive`);
    }
  }

  if (!sameMembers(contract.boundaries?.owned ?? [], REQUIRED_OWNED)) {
    errors.push('accessibility owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('accessibility excluded boundary is incomplete or excessive');
  }
  return errors;
};
