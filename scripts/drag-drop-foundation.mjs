const REQUIRED_CAPABILITIES = [
  'pointer-session',
  'target-collision',
  'pointer-capture',
  'keyboard-session',
  'cancellation-cleanup',
  'autoscroll',
];
const REQUIRED_EVIDENCE = {
  'pointer-session': ['unit', 'ssr', 'browser', 'typing', 'security'],
  'target-collision': ['unit', 'ssr', 'browser', 'typing', 'performance', 'security'],
  'pointer-capture': ['unit', 'browser', 'typing', 'accessibility', 'security'],
  'keyboard-session': ['unit', 'browser', 'typing', 'accessibility'],
  'cancellation-cleanup': ['unit', 'browser', 'typing', 'accessibility', 'security'],
  autoscroll: ['unit', 'browser', 'typing', 'performance', 'security'],
};
const REQUIRED_OWNED = [
  'framework-neutral pointer and keyboard drag session state with explicit activation threshold and immutable snapshots',
  'token-safe drop target registration with pointer rectangle-intersection and closest-center collision strategies',
  'explicit native Pointer Events capture lifecycle for primary mouse pen and touch input',
  'deterministic drop cancellation pointer-cancel capture-loss and disposal completion',
  'bounded edge-proximity autoscroll with caller-supplied frame scheduling and inner-to-outer containers',
  'opaque generic payload and target data transport without rendering parsing serialization or execution',
  'dependency-free server-safe package imports with browser work beginning only after explicit mounted owners are supplied',
];
const REQUIRED_EXCLUDED = [
  'public React components hooks providers sensors renderers drag previews DOM structure styles or component event APIs',
  'collection ordering selection tree state data mutation commands history persistence or optimistic server updates',
  'focus movement restoration ARIA roles names states live announcements or component keyboard tables',
  'automatic item reordering resize rotate lasso selection snapping guides or domain-specific drag constraints',
  'HTML5 DataTransfer file external-window clipboard operating-system or cross-document drag transport',
  'overlay portals positioning animation theme density CSS forced-colors reduced-motion or responsive rendering policy',
  'locale formatting RTL browser scrollLeft normalization IME text commit or translated announcement policy',
  'untrusted callback construction HTML URLs SVG files storage network dynamic code or serialized executable payloads',
  'reference-derived drag-drop parity or future Sortable Grid TaskBoard Scheduler Gantt Diagram Upload components',
  'F0.17 reference baseline analysis or any later-stage capability',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateDragDropFoundation = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Drag-drop contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/drag-drop-foundation.schema.json') {
    errors.push('$schema must identify the drag-drop foundation schema');
  }
  if (!sourceExists('registry/schemas/drag-drop-foundation.schema.json')) {
    errors.push('Drag-drop foundation schema does not exist');
  }
  if (contract.package !== '@casauran-internal/drag-drop') {
    errors.push('Drag-drop package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Drag-drop capabilities must preserve the required inventory');
  }
  for (const id of ids.filter((value, index) => ids.indexOf(value) !== index)) {
    errors.push(`duplicate drag-drop capability ${id}`);
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
    errors.push('Drag-drop owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Drag-drop excluded boundary is incomplete or excessive');
  }
  return errors;
};
