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

/**
 * A public component's lifecycle status is owned by its own stage, and by no other.
 *
 * `F0.18` asserted this by naming one component: `registry/components/svg-icon.json` had to stay
 * `unreviewed`, which proved the documentation foundation had not advanced the component stage
 * queued behind it. That assertion could only ever be true until `1.03` ran, and it said nothing
 * about the other 126 components. The rule it was protecting generalises: a component whose stage
 * has not started must not have advanced, and a component whose stage is complete must have.
 *
 * @param {readonly {id: string, type: string, status: string, component?: string}[]} stages
 * @param {readonly {name: string, slug: string, stage: string, status: string}[]} components
 * @returns {string[]} human-readable errors
 */
export const validateComponentLifecycleBoundary = (stages, components) => {
  const errors = [];
  const stageById = new Map(stages.map((stage) => [stage.id, stage]));
  for (const component of components) {
    const stage = stageById.get(component.stage);
    if (stage === undefined) {
      errors.push(`${component.name} names stage ${component.stage}, which does not exist`);
      continue;
    }
    if (stage.type !== 'public-component') {
      errors.push(`${component.name} names ${component.stage}, which is not a component stage`);
      continue;
    }
    if (stage.status === 'not-started' && component.status !== 'unreviewed') {
      errors.push(
        `${component.name} is ${component.status} while stage ${component.stage} has not started`,
      );
    }
    if (stage.status === 'complete' && component.status === 'unreviewed') {
      errors.push(`${component.name} is unreviewed while stage ${component.stage} is complete`);
    }
  }
  return errors;
};
