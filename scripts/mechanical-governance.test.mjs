import assert from 'node:assert/strict';
import test from 'node:test';
import { validateMechanicalGovernance } from './mechanical-governance.mjs';

const validFixture = () => {
  const contract = {
    $schema: 'mechanical-governance.schema.json',
    schemaVersion: 1,
    ownerRoles: ['maintainer', 'evidence-reviewer'],
    authorityContracts: ['AGENTS.md'],
    execution: {
      runner: 'scripts/verify-scaffold.mjs',
      packageScript: 'verify:scaffold',
      mode: 'read-only',
      network: 'forbidden',
      failureMode: 'collect-and-fail',
      supportScripts: ['scripts/lib.mjs'],
    },
    unitTests: {
      script: 'scripts/mechanical-governance.test.mjs',
      packageScript: 'test:mechanical-governance',
    },
    validators: [
      {
        id: 'mechanical-governance',
        script: 'scripts/validate-mechanical-governance.mjs',
        packageScript: 'validate:mechanical-governance',
        ownerRoles: ['maintainer', 'evidence-reviewer'],
        contracts: ['MECHANICAL_GOVERNANCE.md'],
      },
    ],
    rootGates: [
      { id: 'preinstall', packageScript: 'verify:scaffold', requiredFor: ['preflight'] },
      { id: 'static', packageScript: 'validate:static', requiredFor: ['integration'] },
      { id: 'full', packageScript: 'validate', requiredFor: ['stage close'] },
    ],
    ci: { workflow: '.github/workflows/ci.yml', requiredCommand: 'pnpm validate' },
  };
  const sources = new Set([
    '.agent/mechanical-governance.schema.json',
    'AGENTS.md',
    'MECHANICAL_GOVERNANCE.md',
    'scripts/verify-scaffold.mjs',
    'scripts/lib.mjs',
    'scripts/validate-mechanical-governance.mjs',
    'scripts/mechanical-governance.test.mjs',
    '.github/workflows/ci.yml',
  ]);
  return {
    contract,
    context: {
      sourceExists: (source) => sources.has(source),
      sourceTexts: {
        'scripts/lib.mjs': "import fs from 'node:fs';",
        'scripts/validate-mechanical-governance.mjs': "import './lib.mjs';",
        'scripts/verify-scaffold.mjs':
          "const mandatory = 'scripts/validate-mechanical-governance.mjs'; contract.validators;",
        '.github/workflows/ci.yml': 'run: pnpm validate',
      },
      validatorScripts: ['scripts/validate-mechanical-governance.mjs'],
      packageScripts: {
        'verify:scaffold': 'node scripts/verify-scaffold.mjs',
        'test:mechanical-governance': 'node --test scripts/mechanical-governance.test.mjs',
        'validate:mechanical-governance': 'node scripts/validate-mechanical-governance.mjs',
        'validate:static': 'pnpm verify:scaffold && pnpm test',
        validate: 'pnpm validate:static && pnpm test:e2e',
        test: 'pnpm test:mechanical-governance',
      },
      governanceRoles: ['maintainer', 'evidence-reviewer'],
    },
  };
};

test('accepts a complete read-only mechanical governance contract', () => {
  const { contract, context } = validFixture();
  assert.deepEqual(validateMechanicalGovernance(contract, context), []);
});

test('rejects validator inventory drift', () => {
  const { contract, context } = validFixture();
  context.validatorScripts.push('scripts/validate-orphan.mjs');
  assert.ok(
    validateMechanicalGovernance(contract, context).includes(
      'uncatalogued validator scripts: scripts/validate-orphan.mjs',
    ),
  );
});

test('rejects package command drift', () => {
  const { contract, context } = validFixture();
  context.packageScripts['validate:mechanical-governance'] = 'node scripts/other.mjs';
  assert.ok(
    validateMechanicalGovernance(contract, context).includes(
      'mechanical-governance package script must run node scripts/validate-mechanical-governance.mjs',
    ),
  );
});

test('rejects unknown ownership and missing governed contracts', () => {
  const { contract, context } = validFixture();
  contract.validators[0].ownerRoles.push('unassigned-role');
  contract.validators[0].contracts.push('missing-policy.md');
  const errors = validateMechanicalGovernance(contract, context);
  assert.ok(errors.includes('mechanical-governance references unknown role unassigned-role'));
  assert.ok(errors.includes('mechanical-governance contract does not exist: missing-policy.md'));
});

test('rejects network access and filesystem mutation in validator execution sources', () => {
  const { contract, context } = validFixture();
  context.sourceTexts['scripts/validate-mechanical-governance.mjs'] =
    "import https from 'node:https'; writeFile('result.txt', 'unsafe');";
  const errors = validateMechanicalGovernance(contract, context);
  assert.ok(
    errors.includes('scripts/validate-mechanical-governance.mjs imports forbidden node:https'),
  );
  assert.ok(
    errors.includes('scripts/validate-mechanical-governance.mjs may not mutate through writeFile'),
  );
});

test('rejects uncatalogued relative support scripts', () => {
  const { contract, context } = validFixture();
  context.sourceTexts['scripts/validate-mechanical-governance.mjs'] =
    "import value from './hidden-helper.mjs';";
  assert.ok(
    validateMechanicalGovernance(contract, context).includes(
      'scripts/validate-mechanical-governance.mjs imports uncatalogued support script scripts/hidden-helper.mjs',
    ),
  );
});

test('rejects broken root and CI gate linkage', () => {
  const { contract, context } = validFixture();
  context.packageScripts['validate:static'] = 'pnpm lint';
  context.sourceTexts['.github/workflows/ci.yml'] = 'run: pnpm lint';
  const errors = validateMechanicalGovernance(contract, context);
  assert.ok(errors.includes('validate:static must include pnpm verify:scaffold'));
  assert.ok(errors.includes('.github/workflows/ci.yml must run pnpm validate'));
});

test('accepts contract tests through the central Node test suite', () => {
  const { contract, context } = validFixture();
  context.packageScripts.test = 'pnpm test:contracts && pnpm test:unit';
  context.packageScripts['test:contracts'] = 'node --test scripts/*.test.mjs';
  assert.deepEqual(validateMechanicalGovernance(contract, context), []);
});
