const REQUIRED_ROLES = [
  'maintainer',
  'domain-owner',
  'evidence-reviewer',
  'security-reviewer',
  'release-manager',
];

const REQUIRED_CHANGE_CLASSES = [
  'active-stage',
  'architecture',
  'dependency',
  'public-api',
  'reference-scope',
  'security-sensitive',
  'release',
];

const REQUIRED_STATUSES = ['not-started', 'in-progress', 'complete', 'blocked'];

const REQUIRED_TRANSITIONS = [
  ['not-started', 'in-progress'],
  ['in-progress', 'complete'],
  ['in-progress', 'blocked'],
  ['blocked', 'in-progress'],
];

const REQUIRED_EVIDENCE = [
  'Outcome',
  'Delivered scope',
  'Contracts and files',
  'Validation',
  'Enterprise applicability',
  'Boundary audit',
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const hasSameMembers = (actual, expected) =>
  Array.isArray(actual) &&
  actual.length === expected.length &&
  expected.every((item) => actual.includes(item));

const duplicateValues = (values) =>
  values.filter((value, index) => values.indexOf(value) !== index);

export const renderCodeowners = (contract) => {
  const entries = Array.isArray(contract.pathOwnership) ? contract.pathOwnership : [];
  return [
    '# This file mirrors .agent/repository-governance.json.',
    ...entries.map((entry) => `${entry.pattern} ${entry.owners.join(' ')}`),
    '',
  ].join('\n');
};

export const findStageLedger = (stageId, stageFiles) => {
  const prefix = `.agent/stages/${stageId.toLowerCase()}-`;
  return stageFiles.find((file) => file.toLowerCase().startsWith(prefix));
};

export const validateGovernanceContract = (contract, sourceExists = () => true) => {
  const errors = [];
  if (!isObject(contract)) return ['governance contract must be an object'];

  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');

  const repository = isObject(contract.repository) ? contract.repository : {};
  if (!/^@[-A-Za-z0-9]+$/.test(repository.maintainer ?? '')) {
    errors.push('repository.maintainer must be a GitHub handle');
  }
  if (!/^[^/]+\/[^/]+$/.test(repository.slug ?? '')) {
    errors.push('repository.slug must use owner/repository form');
  }
  if (typeof repository.defaultBranch !== 'string' || repository.defaultBranch.length === 0) {
    errors.push('repository.defaultBranch is required');
  }

  const roles = Array.isArray(contract.roles) ? contract.roles : [];
  const roleIds = roles.map((role) => role.id);
  for (const id of duplicateValues(roleIds)) errors.push(`duplicate role ${id}`);
  for (const id of REQUIRED_ROLES) {
    if (!roleIds.includes(id)) errors.push(`missing required role ${id}`);
  }
  const knownHolders = new Set();
  for (const role of roles) {
    if (!Array.isArray(role.holders) || role.holders.length === 0) {
      errors.push(`${role.id ?? 'unknown role'} must have at least one holder`);
    } else {
      for (const holder of role.holders) {
        if (!/^@[-A-Za-z0-9]+$/.test(holder))
          errors.push(`${role.id} has invalid holder ${holder}`);
        knownHolders.add(holder);
      }
    }
    if (!Array.isArray(role.accountabilities) || role.accountabilities.length === 0) {
      errors.push(`${role.id ?? 'unknown role'} must define accountabilities`);
    }
  }
  if (repository.maintainer && !knownHolders.has(repository.maintainer)) {
    errors.push('repository.maintainer must hold a governance role');
  }

  const authority = Array.isArray(contract.authority) ? contract.authority : [];
  const ranks = authority.map((entry) => entry.rank);
  const expectedRanks = authority.map((_, index) => index + 1);
  if (!hasSameMembers(ranks, expectedRanks))
    errors.push('authority ranks must be contiguous from 1');
  for (const entry of authority) {
    if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
      errors.push(`authority ${entry.id ?? entry.rank} must define sources`);
      continue;
    }
    for (const source of entry.sources) {
      if (!sourceExists(source)) errors.push(`authority source does not exist: ${source}`);
    }
  }

  const changeClasses = Array.isArray(contract.changeClasses) ? contract.changeClasses : [];
  const changeIds = changeClasses.map((entry) => entry.id);
  for (const id of duplicateValues(changeIds)) errors.push(`duplicate change class ${id}`);
  for (const id of REQUIRED_CHANGE_CLASSES) {
    if (!changeIds.includes(id)) errors.push(`missing required change class ${id}`);
  }
  for (const entry of changeClasses) {
    if (!sourceExists(entry.workflow ?? '')) {
      errors.push(`workflow does not exist for ${entry.id}: ${entry.workflow}`);
    }
    if (!Array.isArray(entry.requiredRoles) || entry.requiredRoles.length === 0) {
      errors.push(`${entry.id} must require at least one role`);
    } else {
      for (const role of entry.requiredRoles) {
        if (!roleIds.includes(role)) errors.push(`${entry.id} references unknown role ${role}`);
      }
    }
    if (!Array.isArray(entry.requiredEvidence) || entry.requiredEvidence.length === 0) {
      errors.push(`${entry.id} must require evidence`);
    }
  }

  const pathOwnership = Array.isArray(contract.pathOwnership) ? contract.pathOwnership : [];
  const patterns = pathOwnership.map((entry) => entry.pattern);
  if (!patterns.includes('*')) errors.push('path ownership must include a repository-wide rule');
  for (const pattern of duplicateValues(patterns))
    errors.push(`duplicate ownership pattern ${pattern}`);
  for (const entry of pathOwnership) {
    if (!Array.isArray(entry.owners) || entry.owners.length === 0) {
      errors.push(`${entry.pattern ?? 'unknown path'} must have an owner`);
    } else {
      for (const owner of entry.owners) {
        if (!knownHolders.has(owner))
          errors.push(`${entry.pattern} references unassigned owner ${owner}`);
      }
    }
    if (!Array.isArray(entry.roles) || entry.roles.length === 0) {
      errors.push(`${entry.pattern ?? 'unknown path'} must define owner roles`);
    } else {
      for (const role of entry.roles) {
        if (!roleIds.includes(role))
          errors.push(`${entry.pattern} references unknown role ${role}`);
      }
    }
  }

  const lifecycle = isObject(contract.stageLifecycle) ? contract.stageLifecycle : {};
  if (!hasSameMembers(lifecycle.statuses, REQUIRED_STATUSES)) {
    errors.push('stage lifecycle statuses do not match the governance contract');
  }
  if (!hasSameMembers(lifecycle.terminalStatuses, ['complete', 'blocked'])) {
    errors.push('stage terminal statuses must be complete and blocked');
  }
  const transitions = Array.isArray(lifecycle.allowedTransitions)
    ? lifecycle.allowedTransitions.map((transition) => transition.join(' -> '))
    : [];
  for (const transition of REQUIRED_TRANSITIONS.map((entry) => entry.join(' -> '))) {
    if (!transitions.includes(transition)) errors.push(`missing stage transition ${transition}`);
  }
  if (!hasSameMembers(lifecycle.completionEvidence, REQUIRED_EVIDENCE)) {
    errors.push('completion evidence does not match the governance contract');
  }

  return errors;
};

export const validateStageSequence = (stages) => {
  const errors = [];
  let pendingSeen = false;
  let blockedSeen = false;
  let inProgressCount = 0;

  for (const stage of stages) {
    if (!REQUIRED_STATUSES.includes(stage.status)) {
      errors.push(`${stage.id} has invalid status ${stage.status}`);
      continue;
    }
    if (stage.status === 'in-progress') inProgressCount += 1;
    if (pendingSeen && stage.status !== 'not-started') {
      errors.push(`${stage.id} starts after a not-started stage`);
    }
    if (blockedSeen && stage.status !== 'not-started') {
      errors.push(`${stage.id} starts after a blocked stage`);
    }
    if (stage.status === 'not-started') pendingSeen = true;
    if (stage.status === 'blocked') blockedSeen = true;
  }

  if (inProgressCount > 1) errors.push('at most one stage may be in-progress');
  return errors;
};

export const validateProgramStatus = (stages, status) => {
  const errors = [];
  const activeStages = stages.filter((stage) => stage.status === 'in-progress');
  if (activeStages.length === 0) {
    if (!status.includes('Active stage: NONE')) {
      errors.push('.agent/status.md must record Active stage: NONE');
    }
  } else if (!status.includes(`Active stage: \`${activeStages[0].id}`)) {
    errors.push(`.agent/status.md must identify ${activeStages[0].id} as the active stage`);
  }

  const nextStage = stages.find((stage) => stage.status === 'not-started');
  if (nextStage && !status.includes(`Next stage: \`${nextStage.id}`)) {
    errors.push(`.agent/status.md must identify ${nextStage.id} as the next stage`);
  }
  return errors;
};
