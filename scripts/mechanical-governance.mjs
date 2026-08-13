import path from 'node:path';

const REQUIRED_OWNER_ROLES = ['maintainer', 'evidence-reviewer'];
const REQUIRED_ROOT_GATES = ['preinstall', 'static', 'full'];
const FORBIDDEN_NODE_MODULES = [
  'child_process',
  'cluster',
  'dgram',
  'dns',
  'http',
  'https',
  'net',
  'tls',
  'worker_threads',
];
const FORBIDDEN_MUTATIONS = [
  'appendFile',
  'chmod',
  'chown',
  'copyFile',
  'cp',
  'link',
  'mkdir',
  'mkdtemp',
  'rename',
  'rm',
  'rmdir',
  'symlink',
  'truncate',
  'unlink',
  'writeFile',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

const validateUnique = (values, label, errors) => {
  for (const value of duplicates(values)) errors.push(`duplicate ${label} ${value}`);
};

const validateExecutionSource = (sourcePath, source, executionSources, errors) => {
  for (const moduleName of FORBIDDEN_NODE_MODULES) {
    if (source.includes(`node:${moduleName}`)) {
      errors.push(`${sourcePath} imports forbidden node:${moduleName}`);
    }
  }
  if (/\bfetch\s*\(/u.test(source)) errors.push(`${sourcePath} may not access the network`);
  for (const operation of FORBIDDEN_MUTATIONS) {
    const mutation = new RegExp(`\\b${operation}(?:Sync)?\\s*\\(`, 'u');
    if (mutation.test(source)) errors.push(`${sourcePath} may not mutate through ${operation}`);
  }

  const imports = source.matchAll(/\b(?:from\s+|import\s*)['"]([^'"]+)['"]/gu);
  for (const match of imports) {
    const specifier = match[1];
    if (specifier.startsWith('node:')) continue;
    if (!specifier.startsWith('.')) {
      errors.push(`${sourcePath} imports non-platform module ${specifier}`);
      continue;
    }
    const resolved = path.posix.normalize(
      path.posix.join(path.posix.dirname(sourcePath), specifier),
    );
    if (!executionSources.has(resolved)) {
      errors.push(`${sourcePath} imports uncatalogued support script ${resolved}`);
    }
  }
};

export const validateMechanicalGovernance = (
  contract,
  {
    sourceExists = () => true,
    sourceTexts = {},
    validatorScripts = [],
    packageScripts = {},
    governanceRoles = [],
  } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['mechanical governance contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== 'mechanical-governance.schema.json') {
    errors.push('$schema must identify mechanical-governance.schema.json');
  }
  if (!sourceExists('.agent/mechanical-governance.schema.json')) {
    errors.push('mechanical governance schema does not exist');
  }

  const ownerRoles = Array.isArray(contract.ownerRoles) ? contract.ownerRoles : [];
  validateUnique(ownerRoles, 'owner role', errors);
  for (const role of REQUIRED_OWNER_ROLES) {
    if (!ownerRoles.includes(role)) errors.push(`missing required owner role ${role}`);
  }
  for (const role of ownerRoles) {
    if (!governanceRoles.includes(role)) errors.push(`unknown contract owner role ${role}`);
  }

  const authorityContracts = Array.isArray(contract.authorityContracts)
    ? contract.authorityContracts
    : [];
  if (authorityContracts.length === 0) errors.push('authorityContracts must not be empty');
  validateUnique(authorityContracts, 'authority contract', errors);
  for (const source of authorityContracts) {
    if (!sourceExists(source)) errors.push(`authority contract does not exist: ${source}`);
  }

  const execution = isObject(contract.execution) ? contract.execution : {};
  if (execution.mode !== 'read-only') errors.push('execution mode must be read-only');
  if (execution.network !== 'forbidden') errors.push('validator network access must be forbidden');
  if (execution.failureMode !== 'collect-and-fail') {
    errors.push('failureMode must be collect-and-fail');
  }
  if (!sourceExists(execution.runner ?? '')) {
    errors.push(`governance runner does not exist: ${execution.runner}`);
  }
  if (packageScripts[execution.packageScript] !== `node ${execution.runner}`) {
    errors.push(`package.json must expose ${execution.packageScript} as node ${execution.runner}`);
  }

  const supportScripts = Array.isArray(execution.supportScripts) ? execution.supportScripts : [];
  if (supportScripts.length === 0) errors.push('execution supportScripts must not be empty');
  validateUnique(supportScripts, 'support script', errors);
  for (const script of supportScripts) {
    if (!sourceExists(script)) errors.push(`support script does not exist: ${script}`);
  }

  const unitTests = isObject(contract.unitTests) ? contract.unitTests : {};
  if (!sourceExists(unitTests.script ?? '')) {
    errors.push(`mechanical governance tests do not exist: ${unitTests.script}`);
  }
  if (packageScripts[unitTests.packageScript] !== `node --test ${unitTests.script}`) {
    errors.push(
      `package.json must expose ${unitTests.packageScript} as node --test ${unitTests.script}`,
    );
  }
  const directUnitTest = (packageScripts.test ?? '').includes(`pnpm ${unitTests.packageScript}`);
  const aggregatedContractTests =
    (packageScripts.test ?? '').includes('pnpm test:contracts') &&
    packageScripts['test:contracts'] === 'node --test scripts/*.test.mjs';
  if (!directUnitTest && !aggregatedContractTests) {
    errors.push(
      `root test gate must include ${unitTests.packageScript} directly or through test:contracts`,
    );
  }

  const validators = Array.isArray(contract.validators) ? contract.validators : [];
  if (validators.length === 0) errors.push('validators must not be empty');
  const ids = validators.map((entry) => entry.id);
  const scripts = validators.map((entry) => entry.script);
  const packageScriptNames = validators.map((entry) => entry.packageScript);
  validateUnique(ids, 'validator id', errors);
  validateUnique(scripts, 'validator script', errors);
  validateUnique(packageScriptNames, 'validator package script', errors);

  const discovered = [...validatorScripts].sort();
  const catalogued = [...scripts].sort();
  if (!sameMembers(catalogued, discovered)) {
    const missing = discovered.filter((script) => !catalogued.includes(script));
    const stale = catalogued.filter((script) => !discovered.includes(script));
    if (missing.length > 0) errors.push(`uncatalogued validator scripts: ${missing.join(', ')}`);
    if (stale.length > 0) errors.push(`catalogued validator scripts missing: ${stale.join(', ')}`);
  }

  for (const entry of validators) {
    if (!isObject(entry)) {
      errors.push('validator entries must be objects');
      continue;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.id ?? '')) {
      errors.push(`invalid validator id ${entry.id}`);
    }
    if (!/^scripts\/validate-[a-z0-9-]+\.mjs$/u.test(entry.script ?? '')) {
      errors.push(`${entry.id} has invalid validator script ${entry.script}`);
    }
    if (!sourceExists(entry.script ?? '')) {
      errors.push(`validator script does not exist: ${entry.script}`);
    }
    if (packageScripts[entry.packageScript] !== `node ${entry.script}`) {
      errors.push(`${entry.id} package script must run node ${entry.script}`);
    }
    if (!Array.isArray(entry.ownerRoles) || entry.ownerRoles.length === 0) {
      errors.push(`${entry.id} must define ownerRoles`);
    } else {
      validateUnique(entry.ownerRoles, `${entry.id} owner role`, errors);
      for (const role of entry.ownerRoles) {
        if (!governanceRoles.includes(role))
          errors.push(`${entry.id} references unknown role ${role}`);
      }
    }
    if (!Array.isArray(entry.contracts) || entry.contracts.length === 0) {
      errors.push(`${entry.id} must identify governed contracts`);
    } else {
      validateUnique(entry.contracts, `${entry.id} contract`, errors);
      for (const source of entry.contracts) {
        if (!sourceExists(source)) errors.push(`${entry.id} contract does not exist: ${source}`);
      }
    }
  }

  const executionSourceList = [...new Set([...scripts, ...supportScripts])];
  const executionSources = new Set(executionSourceList);
  for (const sourcePath of executionSourceList) {
    const source = sourceTexts[sourcePath];
    if (typeof source !== 'string') {
      errors.push(`missing source text for safety audit: ${sourcePath}`);
      continue;
    }
    validateExecutionSource(sourcePath, source, executionSources, errors);
  }

  const rootGates = Array.isArray(contract.rootGates) ? contract.rootGates : [];
  const rootGateIds = rootGates.map((gate) => gate.id);
  validateUnique(rootGateIds, 'root gate', errors);
  if (!sameMembers(rootGateIds, REQUIRED_ROOT_GATES)) {
    errors.push('root gates must be preinstall, static and full');
  }
  for (const gate of rootGates) {
    if (typeof packageScripts[gate.packageScript] !== 'string') {
      errors.push(`${gate.id} references missing package script ${gate.packageScript}`);
    }
    if (!Array.isArray(gate.requiredFor) || gate.requiredFor.length === 0) {
      errors.push(`${gate.id} must define requiredFor contexts`);
    }
  }
  if (!(packageScripts['validate:static'] ?? '').includes('pnpm verify:scaffold')) {
    errors.push('validate:static must include pnpm verify:scaffold');
  }
  if (
    !(packageScripts.validate ?? '').includes('pnpm validate:static') ||
    !(packageScripts.validate ?? '').includes('pnpm test:e2e')
  ) {
    errors.push('validate must include validate:static and test:e2e');
  }

  const ci = isObject(contract.ci) ? contract.ci : {};
  if (!sourceExists(ci.workflow ?? '')) errors.push(`CI workflow does not exist: ${ci.workflow}`);
  const ciSource = sourceTexts[ci.workflow];
  if (typeof ciSource !== 'string' || !ciSource.includes(ci.requiredCommand ?? '')) {
    errors.push(`${ci.workflow} must run ${ci.requiredCommand}`);
  }

  const runnerSource = sourceTexts[execution.runner];
  if (typeof runnerSource !== 'string') {
    errors.push(`missing runner source text: ${execution.runner}`);
  } else {
    if (!runnerSource.includes("'scripts/validate-mechanical-governance.mjs'")) {
      errors.push('runner must always execute the mechanical governance validator');
    }
    if (!runnerSource.includes('contract.validators')) {
      errors.push('runner must derive the validator suite from the mechanical contract');
    }
  }

  return errors;
};
