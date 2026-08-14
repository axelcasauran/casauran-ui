import assert from 'node:assert/strict';
import test from 'node:test';

import { BASELINE_COMMIT, validateReferenceBaseline } from './reference-baseline.mjs';

const digest = 'a'.repeat(64);
const component = {
  name: 'Button',
  category: 'buttons',
  status: 'unreviewed',
  reference: { path: 'docs/content/buttons', commit: BASELINE_COMMIT },
  features: [],
};
const base = {
  baseline: {
    $schema: '../registry/schemas/reference-baseline.schema.json',
    schemaVersion: 1,
    repository: 'telerik/kendo-react',
    path: 'docs/content',
    branch: 'master',
    commit: BASELINE_COMMIT,
    capturedAt: '2026-08-13',
    purpose: 'functional-behavioral-reference-only',
    policy: 'KENDO_REFERENCE_POLICY.md',
    accessMode: 'local-only',
    localPathEnvironmentVariable: 'CASAURAN_KENDO_DOCS_PATH',
    defaultLocalPath: '../references/kendo-react-docs/docs/content',
    onlineFallback: false,
    repositoryRole: 'provenance-metadata-only',
    inventory: 'reference/kendo-react-inventory.json',
    referenceMap: 'reference/reference-map.json',
    syncWorkflow: '.agent/workflows/reference-sync.md',
    analysisWorkflow: '.agent/workflows/reference-to-spec.md',
    snapshot: {
      algorithm: 'sha256',
      domainCount: 1,
      fileCount: 1,
      byteCount: 1,
      sha256: digest,
    },
    boundaries: {
      allowed: [
        'public documentation inventory and observable behavior extraction',
        'documented features states interactions keyboard accessibility integrations and edge cases',
        'relative public-document paths as provenance for independent Casauran specifications',
      ],
      forbidden: [
        'competitor source CSS theme values assets bundles private architecture or undocumented internals',
        'direct production-code generation from reference material',
        'online fallback live documentation search engines tutorials or model memory',
        'silent baseline movement outside the approved reference-sync workflow',
      ],
    },
  },
  config: {
    mode: 'local-only',
    environmentVariable: 'CASAURAN_KENDO_DOCS_PATH',
    defaultRelativePath: '../references/kendo-react-docs/docs/content',
    onlineFallback: false,
    purpose: 'public-documentation-reference-only',
    allowedRoot: 'docs/content',
    provenanceMetadata: 'reference/kendo-react-baseline.json',
  },
  inventory: {
    $schema: '../registry/schemas/reference-inventory.schema.json',
    schemaVersion: 1,
    root: 'docs/content',
    commit: BASELINE_COMMIT,
    algorithm: 'sha256',
    aggregate: { domainCount: 1, fileCount: 1, byteCount: 1, sha256: digest },
    domains: [{ path: 'buttons', fileCount: 1, byteCount: 1, sha256: digest }],
  },
  referenceMap: {
    Button: {
      category: 'buttons',
      path: 'docs/content/buttons',
      commit: BASELINE_COMMIT,
      analysisStatus: 'unreviewed',
    },
  },
  stages: [
    ...Array.from({ length: 17 }, (_, index) => ({
      id: `F0.${String(index + 1).padStart(2, '0')}`,
      type: 'foundation',
      status: 'complete',
    })),
    { id: '1.01', type: 'public-component', component: 'Button', status: 'not-started' },
  ],
  components: [component],
};

const expandToProgramSize = (contract) => {
  for (let index = 1; index < 127; index += 1) {
    const name = `Component${index}`;
    contract.referenceMap[name] = {
      category: 'buttons',
      path: 'docs/content/buttons',
      commit: BASELINE_COMMIT,
      analysisStatus: 'unreviewed',
    };
    contract.components.push({ ...component, name });
    contract.stages.push({
      id: `X.${String(index).padStart(3, '0')}`,
      type: 'public-component',
      component: name,
      status: 'not-started',
    });
  }
  return contract;
};

const validate = (contract) =>
  validateReferenceBaseline(contract, {
    sourceExists: () => true,
  });

test('accepts the complete reference baseline contract', () => {
  assert.deepEqual(validate(expandToProgramSize(structuredClone(base))), []);
});

test('rejects provenance and clean-room boundary drift', () => {
  const contract = expandToProgramSize(structuredClone(base));
  contract.baseline.commit = 'b'.repeat(40);
  contract.baseline.boundaries.forbidden.pop();
  assert.ok(validate(contract).some((error) => error.includes('without sync')));
  assert.ok(validate(contract).some((error) => error.includes('forbidden boundary')));
});

test('rejects inventory totals and snapshot digest drift', () => {
  const contract = expandToProgramSize(structuredClone(base));
  contract.inventory.aggregate.fileCount = 2;
  contract.baseline.snapshot.sha256 = 'b'.repeat(64);
  assert.ok(validate(contract).some((error) => error.includes('file count drift')));
  assert.ok(validate(contract).some((error) => error.includes('snapshot summary')));
});

test('rejects reference map and component registry disagreement', () => {
  const contract = expandToProgramSize(structuredClone(base));
  contract.components[0].reference.path = 'docs/content/inputs';
  contract.referenceMap.Button.analysisStatus = 'reference-analyzed';
  assert.ok(validate(contract).some((error) => error.includes('reference path drift')));
  assert.ok(validate(contract).some((error) => error.includes('lifecycle')));
});

test('rejects an incomplete foundation prefix', () => {
  const contract = expandToProgramSize(structuredClone(base));
  contract.stages.find((stage) => stage.id === 'F0.17').status = 'in-progress';
  assert.ok(validate(contract).some((error) => error.includes('complete foundation prefix')));
});
