import path from 'node:path';

const REQUIRED_OWNER_ROLES = ['maintainer', 'evidence-reviewer'];
const REQUIRED_TEST_LAYERS = ['contracts', 'unit', 'browser'];
const REQUIRED_HOSTS = ['docs', 'playground', 'showcase', 'visual-tests'];
const REQUIRED_BROWSERS = ['chromium', 'firefox', 'webkit'];
const REQUIRED_STRICT_OPTIONS = [
  'strict',
  'noUncheckedIndexedAccess',
  'exactOptionalPropertyTypes',
  'noImplicitOverride',
  'noPropertyAccessFromIndexSignature',
  'useUnknownInCatchVariables',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));

const validateUnique = (values, label, errors) => {
  for (const value of duplicates(values)) errors.push(`duplicate ${label} ${value}`);
};

export const validateLibraryBuildOutputs = (libraries, outputExists = () => true) => {
  const errors = [];
  for (const library of libraries) {
    const rootExport = library.manifest.exports?.['.'];
    if (!isObject(rootExport)) {
      errors.push(`${library.path}/package.json has no structured root export`);
      continue;
    }
    for (const [kind, target] of [
      ['ESM', rootExport.import],
      ['declaration', rootExport.types],
    ]) {
      if (typeof target !== 'string') {
        errors.push(`${library.path} has no ${kind} root export target`);
        continue;
      }
      const relativeTarget = target.replace(/^\.\//u, '');
      const output = path.posix.join(library.path, relativeTarget);
      if (!outputExists(output))
        errors.push(`${library.path} missing ${kind} output ${relativeTarget}`);
      if (!outputExists(`${output}.map`))
        errors.push(`${library.path} missing map for ${relativeTarget}`);
    }
  }
  return errors;
};

export const validateBuildTestInfrastructure = (
  contract,
  {
    sourceExists = () => true,
    sourceTexts = {},
    packageManifest = {},
    baseTsconfig = {},
    libraries = [],
    hosts = [],
    governanceRoles = [],
    trackedGeneratedArtifacts = [],
  } = {},
) => {
  const errors = [];
  if (!isObject(contract)) return ['build/test infrastructure contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== 'build-test-infrastructure.schema.json') {
    errors.push('$schema must identify build-test-infrastructure.schema.json');
  }
  if (!sourceExists('.agent/build-test-infrastructure.schema.json')) {
    errors.push('build/test infrastructure schema does not exist');
  }

  const ownerRoles = Array.isArray(contract.ownerRoles) ? contract.ownerRoles : [];
  validateUnique(ownerRoles, 'owner role', errors);
  for (const role of REQUIRED_OWNER_ROLES) {
    if (!ownerRoles.includes(role)) errors.push(`missing required owner role ${role}`);
  }
  for (const role of ownerRoles) {
    if (!governanceRoles.includes(role)) errors.push(`unknown contract owner role ${role}`);
  }
  for (const source of contract.authorityContracts ?? []) {
    if (!sourceExists(source)) errors.push(`authority contract does not exist: ${source}`);
  }

  const environment = isObject(contract.environment) ? contract.environment : {};
  if (packageManifest.engines?.node !== environment.nodeRange) {
    errors.push('package.json Node range does not match the infrastructure contract');
  }
  if (packageManifest.packageManager !== environment.packageManager) {
    errors.push('packageManager does not match the infrastructure contract');
  }
  if ((sourceTexts['.node-version'] ?? '').trim() !== environment.nodeBaseline) {
    errors.push('.node-version does not match the infrastructure baseline');
  }
  for (const source of [environment.lockfile, contract.build?.outputVerifier]) {
    if (!sourceExists(source ?? '')) errors.push(`required build source does not exist: ${source}`);
  }

  const strictOptions = baseTsconfig.compilerOptions ?? {};
  for (const option of REQUIRED_STRICT_OPTIONS) {
    if (strictOptions[option] !== true) errors.push(`tsconfig.base.json must enable ${option}`);
  }
  if (strictOptions.module !== 'ESNext' || strictOptions.moduleResolution !== 'Bundler') {
    errors.push('base TypeScript configuration must use ESNext with Bundler resolution');
  }

  const build = isObject(contract.build) ? contract.build : {};
  if (libraries.length !== build.libraryCount) {
    errors.push(`expected ${build.libraryCount} libraries, found ${libraries.length}`);
  }
  if (hosts.length !== build.hostCount) {
    errors.push(`expected ${build.hostCount} hosts, found ${hosts.length}`);
  }
  const expectedBuildCommand = `${build.workspaceBuildScript} && node ${build.outputVerifier}`;
  if (packageManifest.scripts?.[build.packageScript] !== expectedBuildCommand) {
    errors.push(`${build.packageScript} must build workspaces and verify emitted outputs`);
  }

  for (const library of libraries) {
    const manifest = library.manifest;
    const compiler = library.tsconfig?.compilerOptions ?? {};
    if (manifest.type !== 'module') errors.push(`${library.path} must emit as an ESM package`);
    if (manifest.scripts?.build !== 'tsc -p tsconfig.json') {
      errors.push(`${library.path} must use the TypeScript library build`);
    }
    if (manifest.scripts?.typecheck !== 'tsc -p tsconfig.json --noEmit') {
      errors.push(`${library.path} must expose strict no-emit typecheck`);
    }
    if (manifest.scripts?.test !== undefined) {
      errors.push(`${library.path} must not run a duplicate package-level test suite`);
    }
    if (
      compiler.outDir !== build.outputDirectory ||
      compiler.declaration !== build.declarations ||
      compiler.sourceMap !== build.sourceMaps ||
      compiler.declarationMap !== true
    ) {
      errors.push(`${library.path} TypeScript emit does not match the build contract`);
    }
    if (manifest.exports?.['.']?.import !== './dist/index.js') {
      errors.push(`${library.path} root import must target ./dist/index.js`);
    }
    if (manifest.exports?.['.']?.types !== './dist/index.d.ts') {
      errors.push(`${library.path} root types must target ./dist/index.d.ts`);
    }
  }

  const declaredHostIds = (contract.hosts ?? []).map((host) => host.id);
  validateUnique(declaredHostIds, 'host id', errors);
  if (!sameMembers(declaredHostIds, REQUIRED_HOSTS)) {
    errors.push('host inventory must contain docs, playground, showcase and visual-tests');
  }
  const ports = (contract.hosts ?? []).map((host) => host.port);
  validateUnique(ports, 'host port', errors);
  for (const declared of contract.hosts ?? []) {
    const actual = hosts.find((host) => host.id === declared.id);
    if (!actual) continue;
    if (actual.manifest.name !== declared.package) {
      errors.push(`${declared.id} package name does not match the host contract`);
    }
    for (const [script, expected] of [
      ['dev', `next dev -p ${declared.port}`],
      ['start', `next start -p ${declared.port}`],
      ['build', 'next build'],
      ['typecheck', 'next typegen && tsc --noEmit'],
    ]) {
      if (actual.manifest.scripts?.[script] !== expected) {
        errors.push(`${declared.id} ${script} command does not match the host contract`);
      }
    }
    const buildInfo = actual.tsconfig?.compilerOptions?.tsBuildInfoFile;
    if (buildInfo !== '.next/cache/tsconfig.tsbuildinfo') {
      errors.push(`${declared.id} must keep TypeScript build info under .next`);
    }
  }

  const typecheck = isObject(contract.typecheck) ? contract.typecheck : {};
  const expectedTypecheck = `pnpm ${typecheck.workspaceScript} && pnpm ${typecheck.testsScript} && pnpm ${typecheck.toolingScript}`;
  if (packageManifest.scripts?.[typecheck.packageScript] !== expectedTypecheck) {
    errors.push('root typecheck must cover workspaces, tests and tooling exactly once');
  }
  if (packageManifest.scripts?.[typecheck.workspaceScript] !== 'pnpm -r --if-present typecheck') {
    errors.push('workspace typecheck command is invalid');
  }
  if (packageManifest.scripts?.[typecheck.testsScript] !== 'tsc -p tests/tsconfig.json --noEmit') {
    errors.push('test typecheck command is invalid');
  }
  if (
    packageManifest.scripts?.[typecheck.toolingScript] !== 'tsc -p tsconfig.tooling.json --noEmit'
  ) {
    errors.push('tooling typecheck command is invalid');
  }
  for (const config of typecheck.configs ?? []) {
    if (!sourceExists(config)) errors.push(`typecheck config does not exist: ${config}`);
  }

  const layers = Array.isArray(contract.testLayers) ? contract.testLayers : [];
  const layerIds = layers.map((layer) => layer.id);
  validateUnique(layerIds, 'test layer', errors);
  if (!sameMembers(layerIds, REQUIRED_TEST_LAYERS)) {
    errors.push('test layers must be contracts, unit and browser');
  }
  const layerById = Object.fromEntries(layers.map((layer) => [layer.id, layer]));
  const expectedTestCommands = {
    [layerById.contracts?.packageScript]: 'node --test scripts/*.test.mjs',
    [layerById.unit?.packageScript]: 'vitest run --config vitest.config.mts',
    [layerById.browser?.packageScript]:
      'pnpm --filter @casauran-internal/visual-tests build && playwright test',
  };
  for (const [script, expected] of Object.entries(expectedTestCommands)) {
    if (script === 'undefined' || packageManifest.scripts?.[script] !== expected) {
      errors.push(`test package script ${script} must be ${expected}`);
    }
  }
  if (packageManifest.scripts?.test !== 'pnpm test:contracts && pnpm test:unit') {
    errors.push('root test must run contract and unit layers once');
  }
  if (packageManifest.scripts?.['test:e2e'] !== 'pnpm test:browser') {
    errors.push('test:e2e must delegate to the production browser layer');
  }
  for (const layer of layers) {
    if (layer.config && !sourceExists(layer.config)) {
      errors.push(`${layer.id} config does not exist: ${layer.config}`);
    }
  }

  const vitestSource = sourceTexts['vitest.config.mts'] ?? '';
  for (const marker of [
    "environment: 'node'",
    "'packages/**/*.test.ts'",
    "'tests/unit/**/*.test.ts'",
    'clearMocks: true',
    'restoreMocks: true',
  ]) {
    if (!vitestSource.includes(marker)) errors.push(`Vitest config missing ${marker}`);
  }
  if (vitestSource.includes('passWithNoTests'))
    errors.push('Vitest root config may not pass with no tests');
  if (sourceExists('vitest.config.ts')) errors.push('legacy vitest.config.ts must not remain');

  const browsers = Array.isArray(contract.browserProjects) ? contract.browserProjects : [];
  if (!sameMembers(browsers, REQUIRED_BROWSERS)) {
    errors.push('browser projects must be chromium, firefox and webkit');
  }
  const playwrightSource = sourceTexts['playwright.config.ts'] ?? '';
  for (const marker of [
    "baseURL: 'http://localhost:3103'",
    "command: 'pnpm --filter @casauran-internal/visual-tests start'",
    "locale: 'en-US'",
    "timezoneId: 'UTC'",
    "animations: 'disabled'",
    "name: 'chromium'",
    "name: 'firefox'",
    "name: 'webkit'",
  ]) {
    if (!playwrightSource.includes(marker)) errors.push(`Playwright config missing ${marker}`);
  }
  const browserProbeSource = sourceTexts['tests/browser/scaffold.spec.ts'] ?? '';
  if (!browserProbeSource.includes("reducedMotion: 'reduce'")) {
    errors.push('browser harness must emulate reduced motion');
  }
  if (playwrightSource.includes('reuseExistingServer: true')) {
    errors.push('Playwright may not reuse an unverified local server');
  }
  for (const source of [
    'tests/unit/infrastructure.test.ts',
    'tests/browser/scaffold.spec.ts',
    'apps/visual-tests/app/infrastructure/page.tsx',
    'apps/visual-tests/app/infrastructure/client-probe.tsx',
  ]) {
    if (!sourceExists(source))
      errors.push(`required infrastructure probe does not exist: ${source}`);
  }

  const ci = isObject(contract.ci) ? contract.ci : {};
  const ciSource = sourceTexts[ci.workflow] ?? '';
  for (const marker of [
    'permissions:',
    'contents: read',
    ci.installCommand,
    ci.browserInstallCommand,
    ci.validateCommand,
  ]) {
    if (!ciSource.includes(marker ?? '')) errors.push(`CI workflow missing ${marker}`);
  }
  if (ciSource.includes('else')) errors.push('CI install may not fall back to an unlocked install');

  const gitignore = sourceTexts['.gitignore'] ?? '';
  for (const artifact of contract.generatedArtifacts ?? []) {
    const normalized = artifact.replace(/^\*\*\//u, '').replace(/\/\*\*$/u, '');
    if (!gitignore.includes(normalized))
      errors.push(`.gitignore missing generated artifact ${artifact}`);
  }
  for (const artifact of trackedGeneratedArtifacts) {
    errors.push(`generated artifact is tracked: ${artifact}`);
  }

  const documentation = sourceTexts['BUILD_TEST_INFRASTRUCTURE.md'] ?? '';
  for (const heading of [
    '## Supported environment and reproducibility',
    '## Build contract',
    '## Typecheck contract',
    '## Test layers',
    '## Browser and visual determinism',
    '## CI and failure semantics',
    '## Extending the infrastructure',
  ]) {
    if (!documentation.includes(heading)) errors.push(`build/test policy missing ${heading}`);
  }

  return errors;
};
