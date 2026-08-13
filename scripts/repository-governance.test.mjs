import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findStageLedger,
  renderCodeowners,
  validateGovernanceContract,
  validateProgramStatus,
  validateStageSequence,
} from './repository-governance.mjs';

const validContract = () => ({
  schemaVersion: 1,
  repository: {
    slug: 'example/repository',
    defaultBranch: 'main',
    maintainer: '@maintainer',
  },
  roles: [
    'maintainer',
    'domain-owner',
    'evidence-reviewer',
    'security-reviewer',
    'release-manager',
  ].map((id) => ({ id, holders: ['@maintainer'], accountabilities: [`${id} duty`] })),
  authority: [{ rank: 1, id: 'constitution', sources: ['AGENTS.md'] }],
  changeClasses: [
    'active-stage',
    'architecture',
    'dependency',
    'public-api',
    'reference-scope',
    'security-sensitive',
    'release',
  ].map((id) => ({
    id,
    workflow: `${id}.md`,
    requiredRoles: ['maintainer'],
    requiredEvidence: [`${id} evidence`],
  })),
  pathOwnership: [{ pattern: '*', owners: ['@maintainer'], roles: ['maintainer'] }],
  stageLifecycle: {
    statuses: ['not-started', 'in-progress', 'complete', 'blocked'],
    terminalStatuses: ['complete', 'blocked'],
    allowedTransitions: [
      ['not-started', 'in-progress'],
      ['in-progress', 'complete'],
      ['in-progress', 'blocked'],
      ['blocked', 'in-progress'],
    ],
    completionEvidence: [
      'Outcome',
      'Delivered scope',
      'Contracts and files',
      'Validation',
      'Enterprise applicability',
      'Boundary audit',
    ],
  },
});

test('accepts the complete repository governance contract', () => {
  assert.deepEqual(validateGovernanceContract(validContract()), []);
});

test('rejects missing role and change-class coverage', () => {
  const contract = validContract();
  contract.roles = contract.roles.filter((role) => role.id !== 'security-reviewer');
  contract.changeClasses = contract.changeClasses.filter((entry) => entry.id !== 'dependency');
  const errors = validateGovernanceContract(contract);
  assert.ok(errors.includes('missing required role security-reviewer'));
  assert.ok(errors.includes('missing required change class dependency'));
});

test('rejects skipped and concurrent stages', () => {
  const errors = validateStageSequence([
    { id: 'F0.01', status: 'in-progress' },
    { id: 'F0.02', status: 'not-started' },
    { id: 'F0.03', status: 'in-progress' },
  ]);
  assert.ok(errors.includes('F0.03 starts after a not-started stage'));
  assert.ok(errors.includes('at most one stage may be in-progress'));
});

test('renders CODEOWNERS from the canonical ownership entries', () => {
  assert.equal(
    renderCodeowners(validContract()),
    '# This file mirrors .agent/repository-governance.json.\n* @maintainer\n',
  );
});

test('finds stage ledgers without relying on filename case', () => {
  assert.equal(
    findStageLedger('F0.01', ['.agent/stages/F0.01-repository-governance.md']),
    '.agent/stages/F0.01-repository-governance.md',
  );
});

test('requires active and next stage identities to match the ledger', () => {
  const stages = [
    { id: 'F0.01', status: 'complete' },
    { id: 'F0.02', status: 'in-progress' },
    { id: 'F0.03', status: 'not-started' },
  ];
  assert.deepEqual(
    validateProgramStatus(
      stages,
      'Active stage: `F0.02 — Agent Operating System`\nNext stage: `F0.03 — Mechanical Governance`',
    ),
    [],
  );
  assert.ok(
    validateProgramStatus(stages, 'Active stage: NONE\nNext stage: `F0.02`').includes(
      '.agent/status.md must identify F0.02 as the active stage',
    ),
  );
});
