const REQUIRED_CAPABILITIES = [
  'portal-host',
  'layer-stack',
  'dismissable-layer',
  'focus-scope',
  'modal-isolation',
];
const REQUIRED_EVIDENCE = {
  'portal-host': ['unit', 'ssr', 'browser', 'typing'],
  'layer-stack': ['unit', 'ssr', 'typing'],
  'dismissable-layer': ['unit', 'ssr', 'browser', 'accessibility', 'typing', 'security'],
  'focus-scope': ['unit', 'ssr', 'browser', 'accessibility', 'typing'],
  'modal-isolation': ['unit', 'ssr', 'browser', 'accessibility', 'typing'],
};
const REQUIRED_OWNED = [
  'portal host creation cleanup and theme density direction synchronization',
  'token-safe ordered layer registration and top-layer arbitration',
  'top-layer Escape and pointer-outside dismissal intent',
  'nested focus entry containment Tab traversal and restoration',
  'nested modal background isolation with native inert restoration',
];
const REQUIRED_EXCLUDED = [
  'public React components hooks contexts or providers',
  'positioning geometry placement collision viewport constraints or observers',
  'animation transition presence or motion orchestration',
  'component-specific roles names states or APG keyboard tables',
  'application open state controlled state or business workflow',
  'overlay content rendering HTML parsing URL handling or sanitization',
  'scroll locking overscroll or scrollbar compensation policy',
  'component visual styling tokens layout or arrow rendering',
  'F0.11 animation foundation or later public Popup Tooltip Popover Dialog Menu',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateOverlayFoundation = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Overlay foundation contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/overlay-foundation.schema.json') {
    errors.push('$schema must identify the overlay foundation schema');
  }
  if (!sourceExists('registry/schemas/overlay-foundation.schema.json')) {
    errors.push('Overlay foundation schema does not exist');
  }
  if (contract.package !== '@casauran-internal/overlay') {
    errors.push('Overlay foundation package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Overlay capabilities must preserve the required foundation inventory');
  }
  for (const id of ids.filter((value, index) => ids.indexOf(value) !== index)) {
    errors.push(`duplicate overlay capability ${id}`);
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
    errors.push('Overlay owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Overlay excluded boundary is incomplete or excessive');
  }
  return errors;
};
