const REQUIRED_CAPABILITIES = [
  'axis-windowing',
  'dynamic-measurement',
  'scroll-anchoring',
  'focus-pinning',
  'two-dimensional-windowing',
  'element-measurement',
];
const REQUIRED_EVIDENCE = {
  'axis-windowing': ['unit', 'ssr', 'browser', 'typing', 'performance'],
  'dynamic-measurement': ['unit', 'browser', 'typing', 'performance', 'security'],
  'scroll-anchoring': ['unit', 'browser', 'typing'],
  'focus-pinning': ['unit', 'browser', 'typing', 'accessibility'],
  'two-dimensional-windowing': ['unit', 'ssr', 'browser', 'typing', 'performance'],
  'element-measurement': ['unit', 'browser', 'typing', 'security'],
};
const REQUIRED_OWNED = [
  'framework-neutral one-dimensional estimated and measured window calculation with item overscan',
  'stable-key dynamic size measurement with bounded count and finite positive geometry validation',
  'explicit scroll adjustment that preserves a stable anchor across measurement and count changes',
  'disjoint pinned indexes that keep caller-owned focused or active items mounted',
  'two-dimensional row and column window composition without materializing a cell matrix',
  'explicit native ResizeObserver bridge that starts only after a browser constructor and elements are supplied',
  'dependency-free server-safe package imports with logarithmic offset lookup and measurement updates',
];
const REQUIRED_EXCLUDED = [
  'public React components hooks providers renderers DOM structure styles or component event APIs',
  'collection registration active state selection tree projection or data processing',
  'focus movement restoration keyboard mapping ARIA roles names states announcements or tab order',
  'scroll container ownership event subscription scheduling rendering or browser scroll mutation',
  'automatic adaptive overscan velocity prediction infinite loading pagination or remote transport',
  'masonry lane packing sticky headers merged cells frozen panes or spreadsheet formulas',
  'locale formatting RTL browser scrollLeft normalization theme density CSS or responsive layout policy',
  'HTML URLs SVG files serialized executable data storage network or dynamic code execution',
  'reference-derived virtualization parity or future public list grid tree scheduler spreadsheet components',
  'F0.16 drag and drop autoscroll or any later-stage capability',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateVirtualizationFoundation = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Virtualization contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/virtualization-foundation.schema.json') {
    errors.push('$schema must identify the virtualization foundation schema');
  }
  if (!sourceExists('registry/schemas/virtualization-foundation.schema.json')) {
    errors.push('Virtualization foundation schema does not exist');
  }
  if (contract.package !== '@casauran-internal/virtualization') {
    errors.push('Virtualization package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Virtualization capabilities must preserve the required inventory');
  }
  for (const id of ids.filter((value, index) => ids.indexOf(value) !== index)) {
    errors.push(`duplicate virtualization capability ${id}`);
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
    errors.push('Virtualization owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Virtualization excluded boundary is incomplete or excessive');
  }
  return errors;
};
