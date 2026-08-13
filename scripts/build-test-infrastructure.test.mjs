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
      'test:browser': 'pnpm --filter @casauran-internal/visual-tests build && playwright test',
      test: 'pnpm test:contracts && pnpm test:unit',
      'test:e2e': 'pnpm test:browser',
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
      "baseURL: 'http://localhost:3103'; command: 'pnpm --filter @casauran-internal/visual-tests start'; locale: 'en-US'; timezoneId: 'UTC'; animations: 'disabled'; name: 'chromium'; name: 'firefox'; name: 'webkit';",
    'tests/browser/scaffold.spec.ts': "reducedMotion: 'reduce'",
    '.github/workflows/ci.yml':
      'permissions:\n  contents: read\npnpm install --frozen-lockfile\npnpm exec playwright install --with-deps chromium firefox webkit\npnpm validate',
    'BUILD_TEST_INFRASTRUCTURE.md':
      '## Supported environment and reproducibility\n## Build contract\n## Typecheck contract\n## Test layers\n## Browser and visual determinism\n## CI and failure semantics\n## Extending the infrastructure',
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
