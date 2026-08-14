const REQUIRED_CAPABILITIES = [
  'motion-timing',
  'reduced-motion',
  'waapi-playback',
  'animation-registry',
  'presence-state',
];
const REQUIRED_EVIDENCE = {
  'motion-timing': ['unit', 'ssr', 'typing'],
  'reduced-motion': ['unit', 'ssr', 'browser', 'accessibility', 'typing'],
  'waapi-playback': ['ssr', 'browser', 'accessibility', 'typing', 'performance'],
  'animation-registry': ['unit', 'ssr', 'browser', 'typing', 'performance'],
  'presence-state': ['unit', 'ssr', 'typing'],
};
const REQUIRED_OWNED = [
  'finite token-resolved motion time parsing and reduced-motion timing resolution',
  'explicit prefers-reduced-motion observation and disposable change notification',
  'Web Animations API playback completion cancellation abort and reduced-motion finalization',
  'keyed interruption-safe animation ownership and cleanup',
  'revision-safe enter exit presence state without timers or rendering ownership',
];
const REQUIRED_EXCLUDED = [
  'public React components hooks contexts transition groups or providers',
  'component-specific keyframes effect presets choreography or visual design',
  'CSS token values theme assignments or reduced-motion media CSS',
  'positioning layout measurement collision scrolling or viewport observation',
  'gesture physics springs inertia drag scrolling or timeline scrubbing',
  'scroll-driven view-transition canvas SVG or worklet animation policy',
  'semantic roles focus keyboard pointer touch or announcement behavior',
  'unmount rendering DOM insertion content styling or application open state',
  'F0.12 data descriptors processing transport or future public animation components',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

export const validateAnimationFoundation = (
  contract,
  { sourceExists = () => true, sourceTexts = {} } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['Animation foundation contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/animation-foundation.schema.json') {
    errors.push('$schema must identify the animation foundation schema');
  }
  if (!sourceExists('registry/schemas/animation-foundation.schema.json')) {
    errors.push('Animation foundation schema does not exist');
  }
  if (contract.package !== '@casauran-internal/animation') {
    errors.push('Animation foundation package ownership is invalid');
  }

  const capabilities = Array.isArray(contract.capabilities) ? contract.capabilities : [];
  const ids = capabilities.map((capability) => capability.id);
  if (!sameOrderedMembers(ids, REQUIRED_CAPABILITIES)) {
    errors.push('Animation capabilities must preserve the required foundation inventory');
  }
  for (const id of ids.filter((value, index) => ids.indexOf(value) !== index)) {
    errors.push(`duplicate animation capability ${id}`);
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
    errors.push('Animation owned boundary is incomplete or excessive');
  }
  if (!sameMembers(contract.boundaries?.excluded ?? [], REQUIRED_EXCLUDED)) {
    errors.push('Animation excluded boundary is incomplete or excessive');
  }
  return errors;
};
