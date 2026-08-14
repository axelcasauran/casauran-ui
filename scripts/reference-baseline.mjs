import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const BASELINE_COMMIT = '6a05c926c4f08b89782c25336fc159fea3a3f26b';

const EXPECTED_ALLOWED = [
  'public documentation inventory and observable behavior extraction',
  'documented features states interactions keyboard accessibility integrations and edge cases',
  'relative public-document paths as provenance for independent Casauran specifications',
];
const EXPECTED_FORBIDDEN = [
  'competitor source CSS theme values assets bundles private architecture or undocumented internals',
  'direct production-code generation from reference material',
  'online fallback live documentation search engines tutorials or model memory',
  'silent baseline movement outside the approved reference-sync workflow',
];
const COMPONENT_LIFECYCLES = new Set([
  'unreviewed',
  'reference-analyzed',
  'specified',
  'api-approved',
  'implemented',
  'tested',
  'documented',
  'parity-verified',
  'improved',
]);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const compareText = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

const walkFiles = (rootDirectory) => {
  const output = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`reference corpus may not contain symbolic links: ${absolutePath}`);
      }
      if (entry.isDirectory()) walk(absolutePath);
      else if (entry.isFile()) output.push(absolutePath);
      else throw new Error(`reference corpus contains unsupported entry: ${absolutePath}`);
    }
  };
  walk(rootDirectory);
  return output.sort((left, right) =>
    compareText(
      path.relative(rootDirectory, left).replaceAll(path.sep, '/'),
      path.relative(rootDirectory, right).replaceAll(path.sep, '/'),
    ),
  );
};

export const computeReferenceInventory = (contentRoot, commit = BASELINE_COMMIT) => {
  const aggregateHash = createHash('sha256');
  const domains = new Map();

  for (const absolutePath of walkFiles(contentRoot)) {
    const relativePath = path.relative(contentRoot, absolutePath).replaceAll(path.sep, '/');
    const data = fs.readFileSync(absolutePath);
    const contentHash = sha256(data);
    const record = `${relativePath}\0${data.byteLength}\0${contentHash}\n`;
    const domainPath = relativePath.includes('/')
      ? relativePath.slice(0, relativePath.indexOf('/'))
      : '.';
    const domain = domains.get(domainPath) ?? {
      path: domainPath,
      fileCount: 0,
      byteCount: 0,
      hash: createHash('sha256'),
    };

    domain.fileCount += 1;
    domain.byteCount += data.byteLength;
    domain.hash.update(record);
    domains.set(domainPath, domain);
    aggregateHash.update(record);
  }

  const domainInventory = [...domains.values()]
    .sort((left, right) => compareText(left.path, right.path))
    .map((domain) => ({
      path: domain.path,
      fileCount: domain.fileCount,
      byteCount: domain.byteCount,
      sha256: domain.hash.digest('hex'),
    }));

  return {
    $schema: '../registry/schemas/reference-inventory.schema.json',
    schemaVersion: 1,
    root: 'docs/content',
    commit,
    algorithm: 'sha256',
    aggregate: {
      domainCount: domainInventory.length,
      fileCount: domainInventory.reduce((total, domain) => total + domain.fileCount, 0),
      byteCount: domainInventory.reduce((total, domain) => total + domain.byteCount, 0),
      sha256: aggregateHash.digest('hex'),
    },
    domains: domainInventory,
  };
};

export const sameReferenceInventory = (left, right) =>
  JSON.stringify(left) === JSON.stringify(right);

export const validateReferenceBaseline = (
  { baseline, config, inventory, referenceMap, stages, components },
  { sourceExists = () => true } = {},
) => {
  const errors = [];
  if (!isObject(baseline)) return ['Reference baseline must be an object'];
  if (baseline.$schema !== '../registry/schemas/reference-baseline.schema.json') {
    errors.push('$schema must identify the reference baseline schema');
  }
  if (baseline.schemaVersion !== 1) errors.push('baseline schemaVersion must be 1');
  if (baseline.repository !== 'telerik/kendo-react') errors.push('unexpected reference repository');
  if (baseline.path !== 'docs/content') errors.push('unexpected reference path');
  if (baseline.branch !== 'master') errors.push('unexpected reference branch');
  if (baseline.commit !== BASELINE_COMMIT) errors.push('reference baseline changed without sync');
  if (baseline.capturedAt !== '2026-08-13') errors.push('unexpected baseline capture date');
  if (baseline.purpose !== 'functional-behavioral-reference-only') {
    errors.push('invalid reference purpose');
  }
  if (baseline.policy !== 'KENDO_REFERENCE_POLICY.md') errors.push('invalid reference policy');
  if (baseline.accessMode !== 'local-only') errors.push('baseline access must be local-only');
  if (baseline.localPathEnvironmentVariable !== 'CASAURAN_KENDO_DOCS_PATH') {
    errors.push('unexpected baseline path environment variable');
  }
  if (baseline.defaultLocalPath !== '../references/kendo-react-docs/docs/content') {
    errors.push('unexpected baseline local path');
  }
  if (baseline.onlineFallback !== false) errors.push('online fallback must be disabled');
  if (baseline.repositoryRole !== 'provenance-metadata-only') {
    errors.push('repository metadata must remain provenance-only');
  }
  if (baseline.inventory !== 'reference/kendo-react-inventory.json') {
    errors.push('baseline must identify its immutable inventory');
  }
  if (baseline.referenceMap !== 'reference/reference-map.json') {
    errors.push('baseline must identify its component map');
  }
  if (baseline.syncWorkflow !== '.agent/workflows/reference-sync.md') {
    errors.push('baseline must identify the reference-sync workflow');
  }
  if (baseline.analysisWorkflow !== '.agent/workflows/reference-to-spec.md') {
    errors.push('baseline must identify the reference-to-spec workflow');
  }
  if (!sameMembers(baseline.boundaries?.allowed ?? [], EXPECTED_ALLOWED)) {
    errors.push('reference allowed boundary is incomplete or excessive');
  }
  if (!sameMembers(baseline.boundaries?.forbidden ?? [], EXPECTED_FORBIDDEN)) {
    errors.push('reference forbidden boundary is incomplete or excessive');
  }

  if (!isObject(config)) errors.push('local reference configuration must be an object');
  else {
    if (config.mode !== 'local-only') errors.push('reference mode must be local-only');
    if (config.environmentVariable !== baseline.localPathEnvironmentVariable) {
      errors.push('configuration environment variable must match baseline');
    }
    if (config.defaultRelativePath !== baseline.defaultLocalPath) {
      errors.push('configuration default path must match baseline');
    }
    if (config.onlineFallback !== false) errors.push('configuration online fallback must be false');
    if (config.allowedRoot !== baseline.path) errors.push('configuration root must match baseline');
    if (config.provenanceMetadata !== 'reference/kendo-react-baseline.json') {
      errors.push('configuration must identify baseline provenance');
    }
  }

  if (!isObject(inventory)) errors.push('reference inventory must be an object');
  else {
    if (inventory.$schema !== '../registry/schemas/reference-inventory.schema.json') {
      errors.push('inventory must identify its schema');
    }
    if (inventory.schemaVersion !== 1) errors.push('inventory schemaVersion must be 1');
    if (inventory.root !== baseline.path) errors.push('inventory root must match baseline');
    if (inventory.commit !== baseline.commit) errors.push('inventory commit must match baseline');
    if (inventory.algorithm !== 'sha256') errors.push('inventory algorithm must be sha256');
    const domains = Array.isArray(inventory.domains) ? inventory.domains : [];
    const domainPaths = domains.map((domain) => domain.path);
    if (domains.length === 0) errors.push('reference inventory must contain domains');
    if (new Set(domainPaths).size !== domainPaths.length) errors.push('duplicate inventory domain');
    if ([...domainPaths].sort(compareText).some((value, index) => value !== domainPaths[index])) {
      errors.push('inventory domains must be sorted');
    }
    for (const domain of domains) {
      if (!/^(?:\.|[a-z0-9]+(?:-[a-z0-9]+)*)$/u.test(domain.path ?? '')) {
        errors.push(`invalid inventory domain ${domain.path}`);
      }
      if (!Number.isSafeInteger(domain.fileCount) || domain.fileCount < 1) {
        errors.push(`${domain.path} must have a positive file count`);
      }
      if (!Number.isSafeInteger(domain.byteCount) || domain.byteCount < 1) {
        errors.push(`${domain.path} must have a positive byte count`);
      }
      if (!/^[a-f0-9]{64}$/u.test(domain.sha256 ?? '')) {
        errors.push(`${domain.path} must have a SHA-256 digest`);
      }
    }
    const aggregate = inventory.aggregate ?? {};
    if (aggregate.domainCount !== domains.length) errors.push('inventory domain count drift');
    if (aggregate.fileCount !== domains.reduce((total, domain) => total + domain.fileCount, 0)) {
      errors.push('inventory file count drift');
    }
    if (aggregate.byteCount !== domains.reduce((total, domain) => total + domain.byteCount, 0)) {
      errors.push('inventory byte count drift');
    }
    if (!/^[a-f0-9]{64}$/u.test(aggregate.sha256 ?? '')) {
      errors.push('inventory aggregate must have a SHA-256 digest');
    }
    if (
      baseline.snapshot?.algorithm !== inventory.algorithm ||
      baseline.snapshot?.domainCount !== aggregate.domainCount ||
      baseline.snapshot?.fileCount !== aggregate.fileCount ||
      baseline.snapshot?.byteCount !== aggregate.byteCount ||
      baseline.snapshot?.sha256 !== aggregate.sha256
    ) {
      errors.push('baseline snapshot summary must match inventory');
    }
  }

  const publicStages = Array.isArray(stages)
    ? stages.filter((stage) => stage.type === 'public-component')
    : [];
  const foundationStages = Array.isArray(stages)
    ? stages.filter((stage) => stage.type === 'foundation')
    : [];
  if (
    foundationStages.length !== 17 ||
    foundationStages.some((stage) => stage.status !== 'complete')
  ) {
    errors.push('F0.01-F0.17 must form a complete foundation prefix');
  }
  if (publicStages.length !== 127)
    errors.push('reference map requires 127 public component stages');
  if (publicStages[0]?.id !== '1.01') errors.push('public component sequence must begin at 1.01');

  const map = isObject(referenceMap) ? referenceMap : {};
  const mapNames = Object.keys(map);
  if (mapNames.length !== 127) errors.push('reference map must contain 127 components');
  const componentList = Array.isArray(components) ? components : [];
  if (componentList.length !== 127) errors.push('component registry must contain 127 entries');
  for (const component of componentList) {
    const entry = map[component.name];
    if (!isObject(entry)) {
      errors.push(`reference map missing ${component.name}`);
      continue;
    }
    if (entry.category !== component.category) {
      errors.push(`${component.name} reference category drift`);
    }
    if (
      !/^docs\/content\/[a-z0-9][a-z0-9/-]*$/u.test(entry.path ?? '') ||
      entry.path.includes('..')
    ) {
      errors.push(`${component.name} has an invalid local reference path`);
    }
    if (entry.commit !== baseline.commit || component.reference?.commit !== baseline.commit) {
      errors.push(`${component.name} reference commit drift`);
    }
    if (component.reference?.path !== entry.path)
      errors.push(`${component.name} reference path drift`);
    if (
      !COMPONENT_LIFECYCLES.has(entry.analysisStatus) ||
      entry.analysisStatus !== component.status
    ) {
      errors.push(`${component.name} reference lifecycle drift`);
    }
    const topDomain = entry.path.slice('docs/content/'.length).split('/')[0];
    if (!inventory?.domains?.some((domain) => domain.path === topDomain)) {
      errors.push(`${component.name} references an uninventoried domain ${topDomain}`);
    }
  }
  for (const stage of publicStages) {
    if (!componentList.some((component) => component.name === stage.component)) {
      errors.push(`stage ${stage.id} has no component reference mapping`);
    }
  }

  for (const source of [
    'registry/schemas/reference-baseline.schema.json',
    'registry/schemas/reference-inventory.schema.json',
    'registry/schemas/reference-map.schema.json',
    'specs/foundation/reference-baseline.md',
    'KENDO_REFERENCE_POLICY.md',
    'reference/LOCAL_REFERENCE.md',
    '.agent/workflows/reference-baseline.md',
    '.agent/workflows/reference-sync.md',
    '.agent/workflows/reference-to-spec.md',
  ]) {
    if (!sourceExists(source)) errors.push(`reference baseline contract does not exist: ${source}`);
  }

  return errors;
};
