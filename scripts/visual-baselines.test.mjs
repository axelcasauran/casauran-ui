import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseBaselineFileName,
  resolveRunnerPlatform,
  validateVisualBaselines,
} from './visual-baselines.mjs';

const projects = ['chromium', 'firefox', 'webkit'];

const baselinesFor = (name, platform, directory = 'tests/browser/button.spec.ts-snapshots') =>
  projects.map((project) => `${directory}/${name}-${project}-${platform}.png`);

const validFixture = () => ({
  contract: {
    browserProjects: projects,
    visualBaselines: {
      root: 'tests/browser',
      snapshotDirectorySuffix: '-snapshots',
      extension: '.png',
      runnerPlatforms: { ubuntu: 'linux', macos: 'darwin', windows: 'win32' },
      rationale: 'baselines must exist for the platform CI verifies',
    },
  },
  context: {
    workflowSource: 'jobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n',
    baselineFiles: [
      ...baselinesFor('button-matrix', 'linux'),
      ...baselinesFor(
        'docs-shell-dark-compact-rtl',
        'linux',
        'tests/browser/docs.spec.ts-snapshots',
      ),
    ],
    browserProjects: projects,
  },
});

test('accepts baselines that cover every browser on the CI platform', () => {
  const { contract, context } = validFixture();
  assert.deepEqual(validateVisualBaselines(contract, context), []);
});

test('accepts extra platforms alongside the required one', () => {
  const { contract, context } = validFixture();
  context.baselineFiles.push(...baselinesFor('button-matrix', 'win32'));
  assert.deepEqual(validateVisualBaselines(contract, context), []);
});

test('rejects baselines that exist only for a non-CI platform', () => {
  const { contract, context } = validFixture();
  context.baselineFiles = baselinesFor('button-matrix', 'win32');
  const errors = validateVisualBaselines(contract, context);
  assert.ok(
    errors.some((error) =>
      error.startsWith('3 visual baselines are missing for linux, the platform CI runs on'),
    ),
  );
  assert.ok(errors.some((error) => error.includes('--update-snapshots')));
});

test('rejects a snapshot name covering only some browsers', () => {
  const { contract, context } = validFixture();
  context.baselineFiles = [
    'tests/browser/button.spec.ts-snapshots/button-matrix-chromium-linux.png',
    'tests/browser/button.spec.ts-snapshots/button-matrix-firefox-linux.png',
  ];
  assert.ok(
    validateVisualBaselines(contract, context).some((error) =>
      error.includes('button-matrix [webkit]'),
    ),
  );
});

test('rejects an unparseable baseline file name', () => {
  const { contract, context } = validFixture();
  context.baselineFiles.push('tests/browser/button.spec.ts-snapshots/button-matrix.png');
  assert.ok(
    validateVisualBaselines(contract, context).includes(
      'unparseable visual baseline name: tests/browser/button.spec.ts-snapshots/button-matrix.png',
    ),
  );
});

test('rejects a baseline outside a snapshot directory', () => {
  const { contract, context } = validFixture();
  context.baselineFiles.push('tests/browser/button-matrix-chromium-linux.png');
  assert.ok(
    validateVisualBaselines(contract, context).some((error) =>
      error.startsWith('visual baseline outside a -snapshots directory'),
    ),
  );
});

test('rejects a CI runner that maps to no known platform', () => {
  const { contract, context } = validFixture();
  context.workflowSource = 'jobs:\n  validate:\n    runs-on: freebsd-14\n';
  assert.ok(
    validateVisualBaselines(contract, context).includes(
      'CI runner freebsd-14 maps to no known Playwright platform',
    ),
  );
});

test('rejects a workflow with no runner', () => {
  const { contract, context } = validFixture();
  context.workflowSource = 'jobs:\n  validate:\n    steps:\n';
  assert.ok(
    validateVisualBaselines(contract, context).includes(
      'CI workflow does not declare a runs-on runner',
    ),
  );
});

test('rejects an incomplete visual baseline contract', () => {
  const { contract, context } = validFixture();
  delete contract.visualBaselines.rationale;
  contract.visualBaselines.runnerPlatforms = {};
  const errors = validateVisualBaselines(contract, context);
  assert.ok(errors.includes('visual baseline platform rule must record its rationale'));
  assert.ok(errors.includes('visual baselines must map CI runner labels to Playwright platforms'));
});

test('parses and resolves the declared naming and runner contracts', () => {
  assert.deepEqual(parseBaselineFileName('docs-shell-mobile-webkit-linux.png', projects, '.png'), {
    name: 'docs-shell-mobile',
    project: 'webkit',
    platform: 'linux',
  });
  assert.equal(parseBaselineFileName('button-matrix-opera-linux.png', projects, '.png'), null);
  assert.deepEqual(
    resolveRunnerPlatform('    runs-on: macos-15\n', { ubuntu: 'linux', macos: 'darwin' }),
    { runner: 'macos-15', platform: 'darwin' },
  );
});
