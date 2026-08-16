import assert from 'node:assert/strict';
import test from 'node:test';
import {
  validateBuildTestInfrastructure,
  validateLibraryBuildOutputs,
} from './build-test-infrastructure.mjs';

const hostIds = ['docs', 'playground', 'showcase', 'visual-tests'];
const validFixture = () => {
  const hosts = hostIds.map((id, index) => ({
    id,
    package: `@casauran-internal/${id}`,
    port: 3100 + index,
    purpose: `${id} purpose`,
  }));
  const contract = {
    $schema: 'build-test-infrastructure.schema.json',
    schemaVersion: 1,
    ownerRoles: ['maintainer', 'evidence-reviewer'],
    authorityContracts: ['AGENTS.md'],
    environment: {
      nodeRange: '>=24.18.0 <27',
      nodeBaseline: '24.18.0',
      packageManager: 'pnpm@11.17.0',
      lockfile: 'pnpm-lock.yaml',
      installCommand: 'pnpm install --frozen-lockfile',
    },
    build: {
      packageScript: 'build',
      workspaceBuildScript: 'pnpm -r --if-present build',
      libraryRoot: 'packages',
      libraryCount: 1,
      hostRoot: 'apps',
      hostCount: 4,
      libraryCompiler: 'typescript',
      moduleFormat: 'esm',
      declarations: true,
      sourceMaps: true,
      outputDirectory: 'dist',
      outputVerifier: 'scripts/verify-build-output.mjs',
    },
    typecheck: {
      packageScript: 'typecheck',
      workspaceScript: 'typecheck:workspaces',
      testsScript: 'typecheck:tests',
      toolingScript: 'typecheck:tooling',
      configs: ['tsconfig.base.json', 'tests/tsconfig.json', 'tsconfig.tooling.json'],
    },
    testLayers: [
      {
        id: 'contracts',
        runner: 'node:test',
        packageScript: 'test:contracts',
        roots: ['scripts/*.test.mjs'],
        purpose: 'contracts',
      },
      {
        id: 'unit',
        runner: 'vitest',
        packageScript: 'test:unit',
        config: 'vitest.config.mts',
        roots: ['tests/unit/**/*.test.ts'],
        purpose: 'unit',
      },
      {
        id: 'browser',
        runner: 'playwright',
        packageScript: 'test:browser',
        config: 'playwright.config.ts',
        roots: ['tests/browser'],
        purpose: 'browser',
        productionHost: true,
      },
    ],
    hosts,
    browserProjects: ['chromium', 'firefox', 'webkit'],
    hostEntrypoints: {
      rootDevScript: 'dev',
      defaultHost: 'docs',
      dependencyBuildFilter: '^...',
      devScripts: {
        docs: 'dev:docs',
        playground: 'dev:playground',
        showcase: 'dev:showcase',
        'visual-tests': 'dev:visual',
      },
      rationale: 'dev servers resolve workspace specifiers into dist',
      browserLayerRationale: 'browser hosts resolve workspace specifiers into dist',
    },
    rootGate: {
      staticScript: 'validate:static',
      fullScript: 'validate',
      staticSequence: [
        'verify:scaffold',
        'format',
        'build',
        'lint',
        'typecheck',
        'architecture',
        'test',
      ],
      fullSequence: ['validate:static', 'test:e2e'],
      compiledOutputConsumers: ['lint', 'typecheck', 'architecture', 'test'],
      rationale: 'compiled output must exist before cross-package resolution',
    },
    ci: {
      workflow: '.github/workflows/ci.yml',
      permissions: 'contents: read',
      installCommand: 'pnpm install --frozen-lockfile',
      browserInstallCommand: 'pnpm exec playwright install --with-deps chromium firefox webkit',
      validateCommand: 'pnpm validate',
    },
    generatedArtifacts: [
      '**/.next/**',
      '**/dist/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/*.tsbuildinfo',
    ],
  };
  const manifest = {
    packageManager: 'pnpm@11.17.0',
    engines: { node: '>=24.18.0 <27' },
    scripts: {
      build: 'pnpm -r --if-present build && node scripts/verify-build-output.mjs',
      'typecheck:workspaces': 'pnpm -r --if-present typecheck',
      'typecheck:tests': 'tsc -p tests/tsconfig.json --noEmit',
      'typecheck:tooling': 'tsc -p tsconfig.tooling.json --noEmit',
      typecheck: 'pnpm typecheck:workspaces && pnpm typecheck:tests && pnpm typecheck:tooling',
      'test:contracts': 'node --test scripts/*.test.mjs',
      'test:unit': 'vitest run --config vitest.config.mts',
      'test:browser':
        'pnpm --filter "@casauran-internal/visual-tests..." --filter "@casauran-internal/docs..." build && playwright test',
      dev: 'pnpm dev:docs',
      'dev:docs':
        'pnpm --filter "@casauran-internal/docs^..." build && pnpm --filter @casauran-internal/docs dev',
      'dev:playground':
        'pnpm --filter "@casauran-internal/playground^..." build && pnpm --filter @casauran-internal/playground dev',
      'dev:showcase':
        'pnpm --filter "@casauran-internal/showcase^..." build && pnpm --filter @casauran-internal/showcase dev',
      'dev:visual':
        'pnpm --filter "@casauran-internal/visual-tests^..." build && pnpm --filter @casauran-internal/visual-tests dev',
      test: 'pnpm test:contracts && pnpm test:unit',
      'test:e2e': 'pnpm test:browser',
      'verify:scaffold': 'node scripts/verify-scaffold.mjs',
      format: 'prettier --check .',
      lint: 'eslint .',
      architecture: 'dependency-cruiser packages apps --config dependency-cruiser.config.cjs',
      'validate:static':
        'pnpm verify:scaffold && pnpm format && pnpm build && pnpm lint && pnpm typecheck && pnpm architecture && pnpm test',
      validate: 'pnpm validate:static && pnpm test:e2e',
    },
  };
  const library = {
    path: 'packages/core',
    manifest: {
      type: 'module',
      scripts: { build: 'tsc -p tsconfig.json', typecheck: 'tsc -p tsconfig.json --noEmit' },
      exports: { '.': { import: './dist/index.js', types: './dist/index.d.ts' } },
    },
    tsconfig: {
      compilerOptions: { outDir: 'dist', declaration: true, declarationMap: true, sourceMap: true },
    },
  };
  const actualHosts = hosts.map((host) => ({
    id: host.id,
    path: `apps/${host.id}`,
    manifest: {
      name: host.package,
      scripts: {
        dev: `next dev -p ${host.port}`,
        start: `next start -p ${host.port}`,
        build: 'next build',
        typecheck: 'next typegen && tsc --noEmit',
      },
    },
    tsconfig: { compilerOptions: { tsBuildInfoFile: '.next/cache/tsconfig.tsbuildinfo' } },
  }));
  const sources = new Set([
    '.agent/build-test-infrastructure.schema.json',
    'AGENTS.md',
    'pnpm-lock.yaml',
    'scripts/verify-build-output.mjs',
    'tsconfig.base.json',
    'tests/tsconfig.json',
    'tsconfig.tooling.json',
    'vitest.config.mts',
    'playwright.config.ts',
    '.github/workflows/ci.yml',
    'tests/unit/infrastructure.test.ts',
    'tests/browser/scaffold.spec.ts',
    'apps/visual-tests/app/infrastructure/page.tsx',
    'apps/visual-tests/app/infrastructure/client-probe.tsx',
    'BUILD_TEST_INFRASTRUCTURE.md',
  ]);
  const sourceTexts = {
    '.node-version': '24.18.0\n',
    '.gitignore': '.next\ndist\ncoverage\nplaywright-report\ntest-results\n*.tsbuildinfo\n',
    'vitest.config.mts':
      "environment: 'node'; 'packages/**/*.test.ts'; 'tests/unit/**/*.test.ts'; clearMocks: true; restoreMocks: true;",
    'playwright.config.ts':
      "baseURL: 'http://localhost:3103'; command: 'pnpm --filter @casauran-internal/visual-tests start'; command: 'pnpm --filter @casauran-internal/docs start'; locale: 'en-US'; timezoneId: 'UTC'; animations: 'disabled'; name: 'chromium'; name: 'firefox'; name: 'webkit';",
    'tests/browser/scaffold.spec.ts': "reducedMotion: 'reduce'",
    '.github/workflows/ci.yml':
      'permissions:\n  contents: read\npnpm install --frozen-lockfile\npnpm exec playwright install --with-deps chromium firefox webkit\npnpm validate',
    'BUILD_TEST_INFRASTRUCTURE.md':
      '## Supported environment and reproducibility\n## Build contract\n## Typecheck contract\n## Test layers\n## Root gate ordering\n## Host entry points\n## Browser and visual determinism\n## CI and failure semantics\n## Extending the infrastructure',
  };
  return {
    contract,
    context: {
      sourceExists: (source) => sources.has(source),
      sourceTexts,
      packageManifest: manifest,
      baseTsconfig: {
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'Bundler',
          strict: true,
          noUncheckedIndexedAccess: true,
          exactOptionalPropertyTypes: true,
          noImplicitOverride: true,
          noPropertyAccessFromIndexSignature: true,
          useUnknownInCatchVariables: true,
        },
      },
      libraries: [library],
      hosts: actualHosts,
      governanceRoles: ['maintainer', 'evidence-reviewer'],
      trackedGeneratedArtifacts: [],
    },
  };
};

test('accepts the complete build/test infrastructure contract', () => {
  const { contract, context } = validFixture();
  assert.deepEqual(validateBuildTestInfrastructure(contract, context), []);
});

test('rejects a static gate that resolves cross-package specifiers before building', () => {
  const { contract, context } = validFixture();
  contract.rootGate.staticSequence = [
    'verify:scaffold',
    'format',
    'lint',
    'typecheck',
    'architecture',
    'test',
    'build',
  ];
  context.packageManifest.scripts['validate:static'] =
    'pnpm verify:scaffold && pnpm format && pnpm lint && pnpm typecheck && pnpm architecture && pnpm test && pnpm build';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(errors.includes('static gate must run build before lint'));
  assert.ok(errors.includes('static gate must run build before typecheck'));
  assert.ok(errors.includes('static gate must run build before architecture'));
  assert.ok(errors.includes('static gate must run build before test'));
});

test('rejects a dev entry point that starts a host without emitting its dependencies', () => {
  const { contract, context } = validFixture();
  context.packageManifest.scripts['dev:docs'] = 'pnpm --filter @casauran-internal/docs dev';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(
    errors.includes('dev:docs must build host dependencies before starting the docs dev server'),
  );
});

test('rejects a dependency build filter that would also build the host itself', () => {
  const { contract, context } = validFixture();
  contract.hostEntrypoints.dependencyBuildFilter = '...';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(
    errors.includes('host dev entry points must select dependencies with the pnpm ^... filter'),
  );
});

test('rejects a host with no declared dev entry point', () => {
  const { contract, context } = validFixture();
  delete contract.hostEntrypoints.devScripts.showcase;
  contract.hostEntrypoints.devScripts.legacy = 'dev:legacy';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(errors.includes('host showcase has no declared root dev entry point'));
  assert.ok(errors.includes('dev entry point declared for unknown host legacy'));
});

test('rejects a root dev script that bypasses its default host entry point', () => {
  const { contract, context } = validFixture();
  context.packageManifest.scripts.dev = 'pnpm --filter @casauran-internal/docs dev';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(errors.includes('dev must delegate to dev:docs'));
});

test('rejects a browser layer that builds hosts without their dependencies', () => {
  const { contract, context } = validFixture();
  context.packageManifest.scripts['test:browser'] =
    'pnpm --filter @casauran-internal/visual-tests build && pnpm --filter @casauran-internal/docs build && playwright test';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(
    errors.includes(
      'test package script test:browser must be pnpm --filter "@casauran-internal/visual-tests..." --filter "@casauran-internal/docs..." build && playwright test',
    ),
  );
});

test('rejects host entry points that record no ordering rationale', () => {
  const { contract, context } = validFixture();
  contract.hostEntrypoints.rationale = '   ';
  delete contract.hostEntrypoints.browserLayerRationale;
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(errors.includes('host dev entry point ordering must record its rationale'));
  assert.ok(errors.includes('browser layer host build must record its rationale'));
});

test('rejects a static gate that never builds', () => {
  const { contract, context } = validFixture();
  contract.rootGate.staticSequence = ['verify:scaffold', 'format', 'lint', 'typecheck', 'test'];
  context.packageManifest.scripts['validate:static'] =
    'pnpm verify:scaffold && pnpm format && pnpm lint && pnpm typecheck && pnpm test';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(errors.includes('static gate must run the build step'));
  assert.ok(errors.includes('static gate is missing compiled-output consumer architecture'));
});

test('rejects a declared gate sequence that disagrees with the package script', () => {
  const { contract, context } = validFixture();
  context.packageManifest.scripts['validate:static'] = 'pnpm verify:scaffold && pnpm build';
  assert.ok(
    validateBuildTestInfrastructure(contract, context).some((error) =>
      error.startsWith('validate:static must run exactly '),
    ),
  );
});

test('rejects a full gate that skips the static gate', () => {
  const { contract, context } = validFixture();
  contract.rootGate.fullSequence = ['test:e2e'];
  context.packageManifest.scripts.validate = 'pnpm test:e2e';
  assert.ok(
    validateBuildTestInfrastructure(contract, context).includes(
      'validate must run the validate:static gate',
    ),
  );
});

test('rejects a gate step that is not a package script', () => {
  const { contract, context } = validFixture();
  contract.rootGate.staticSequence = [...contract.rootGate.staticSequence, 'invented:step'];
  assert.ok(
    validateBuildTestInfrastructure(contract, context).includes(
      'root gate step invented:step is not a package script',
    ),
  );
});

test('rejects duplicate package-level test execution', () => {
  const { contract, context } = validFixture();
  context.libraries[0].manifest.scripts.test = 'vitest run --passWithNoTests';
  assert.ok(
    validateBuildTestInfrastructure(contract, context).includes(
      'packages/core must not run a duplicate package-level test suite',
    ),
  );
});

test('rejects incomplete typecheck and empty-test bypasses', () => {
  const { contract, context } = validFixture();
  context.packageManifest.scripts.typecheck = 'pnpm typecheck:workspaces';
  context.sourceTexts['vitest.config.mts'] += ' passWithNoTests: true;';
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(
    errors.includes('root typecheck must cover workspaces, tests and tooling exactly once'),
  );
  assert.ok(errors.includes('Vitest root config may not pass with no tests'));
});

test('rejects development-server browser coverage and missing engines', () => {
  const { contract, context } = validFixture();
  contract.browserProjects = ['chromium'];
  context.sourceTexts['playwright.config.ts'] = context.sourceTexts['playwright.config.ts'].replace(
    ' start',
    ' dev',
  );
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(errors.includes('browser projects must be chromium, firefox and webkit'));
  assert.ok(errors.some((error) => error.includes('Playwright config missing')));
});

test('rejects unlocked CI fallback and tracked generated artifacts', () => {
  const { contract, context } = validFixture();
  context.sourceTexts['.github/workflows/ci.yml'] += '\nelse pnpm install';
  context.trackedGeneratedArtifacts.push('apps/docs/tsconfig.tsbuildinfo');
  const errors = validateBuildTestInfrastructure(contract, context);
  assert.ok(errors.includes('CI install may not fall back to an unlocked install'));
  assert.ok(errors.includes('generated artifact is tracked: apps/docs/tsconfig.tsbuildinfo'));
});

test('verifies emitted ESM declarations and source maps', () => {
  const library = {
    path: 'packages/core',
    manifest: { exports: { '.': { import: './dist/index.js', types: './dist/index.d.ts' } } },
  };
  const outputs = new Set([
    'packages/core/dist/index.js',
    'packages/core/dist/index.js.map',
    'packages/core/dist/index.d.ts',
    'packages/core/dist/index.d.ts.map',
  ]);
  assert.deepEqual(
    validateLibraryBuildOutputs([library], (output) => outputs.has(output)),
    [],
  );
  outputs.delete('packages/core/dist/index.d.ts.map');
  assert.ok(
    validateLibraryBuildOutputs([library], (output) => outputs.has(output)).includes(
      'packages/core missing map for dist/index.d.ts',
    ),
  );
});
