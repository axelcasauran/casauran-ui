const REQUIRED_CAPABILITIES = [
  'global-shell',
  'brand-header',
  'category-navigation',
  'page-table-of-contents',
  'responsive-layout',
  'stable-routing',
  'examples-and-source',
  'api-reference',
  'accessibility-and-keyboard',
  'callouts',
  'presentation-controls',
  'search-metadata',
  'registry-integration',
  'application-accessibility',
  'ssr-rsc',
  'deterministic-visual-coverage',
  // F0.19 (ADR-024)
  'capability-topic-model',
  'generated-topic-routes',
  'interactive-examples',
  'verified-example-source',
];
const REQUIRED_OWNED = [
  'private documentation application shell and information architecture',
  'documentation-only presentation primitives and component-page composition',
  'registry-derived navigation and search metadata',
  'local post-hydration documentation presentation controls',
  'production documentation host browser and visual evidence',
  'declared topic model, generated component topic routes, and interactive example islands',
];
const REQUIRED_EXCLUDED = [
  'public React components hooks packages or supported consumer APIs',
  'component behavior feature parity or lifecycle advancement',
  'external search content management analytics authentication or deployment services',
  'raw HTML executable source remote modules untrusted URLs or dynamic code execution',
  'apps playground engineering sandbox ownership',
  'SVGIcon or any stage 1.03 implementation',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateDocumentationExperience = (contract, { sourceExists = () => true } = {}) => {
  const errors = [];
  if (!isObject(contract)) return ['Documentation experience contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/documentation-experience.schema.json') {
    errors.push('$schema must identify the documentation experience schema');
  }
  if (!sourceExists('registry/schemas/documentation-experience.schema.json')) {
    errors.push('Documentation experience schema does not exist');
  }
  if (contract.owner !== 'apps/docs')
    errors.push('Documentation experience owner must be apps/docs');
  if (contract.sourceRegistry !== '.agent/stages/index.json') {
    errors.push('Documentation metadata must derive from the stage registry');
  }
  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  if (!sameOrderedMembers(capabilities, REQUIRED_CAPABILITIES)) {
    errors.push('Documentation capabilities must preserve the required inventory');
  }
  if (!sameMembers(contract.boundaries?.owned ?? [], REQUIRED_OWNED)) {
    errors.push('Documentation owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Documentation excluded boundary is incomplete or excessive');
  }
  return errors;
};
