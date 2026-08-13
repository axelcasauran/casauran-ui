import path from 'node:path';
import { exists, fail, files, json, pass, read } from './lib.mjs';
import {
  findStageLedger,
  renderCodeowners,
  validateGovernanceContract,
  validateProgramStatus,
  validateStageSequence,
} from './repository-governance.mjs';

const globRegex = (pattern) =>
  new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*')}$`);

const sourceExists = (source) => {
  if (!source.includes('*')) return exists(source);
  const wildcard = source.indexOf('*');
  const prefix = source.slice(0, wildcard);
  const directory = path.posix.dirname(prefix);
  const candidates = files(directory === '.' ? '' : directory);
  const matcher = globRegex(source);
  return candidates.some((candidate) => matcher.test(candidate));
};

const contract = json('.agent/repository-governance.json');
const errors = validateGovernanceContract(contract, sourceExists);

const expectedCodeowners = renderCodeowners(contract);
if (read('.github/CODEOWNERS').replaceAll('\r\n', '\n') !== expectedCodeowners) {
  errors.push('.github/CODEOWNERS does not mirror pathOwnership');
}

const governance = read('GOVERNANCE.md');
for (const heading of [
  '## Roles and current assignment',
  '## Ownership model',
  '## Change classification and approval',
  '## Stage lifecycle',
  '## Required stage evidence',
  '## Pull request and merge gates',
  '## Exceptions and urgent changes',
  '## Mechanical enforcement',
]) {
  if (!governance.includes(heading)) errors.push(`GOVERNANCE.md missing ${heading}`);
}

const packageManifest = json('package.json');
if (
  packageManifest.scripts?.['validate:governance'] !==
  'node scripts/validate-repository-governance.mjs'
) {
  errors.push('package.json must expose validate:governance');
}
if (
  packageManifest.scripts?.['test:governance'] !==
  'node --test scripts/repository-governance.test.mjs'
) {
  errors.push('package.json must expose test:governance');
}
const mechanicalGovernance = json('.agent/mechanical-governance.json');
if (
  !mechanicalGovernance.validators?.some(
    (validator) => validator.script === 'scripts/validate-repository-governance.mjs',
  )
) {
  errors.push('mechanical governance must run repository governance validation');
}

const stages = json('.agent/stages/index.json');
errors.push(...validateStageSequence(stages));

const stageFiles = files('.agent/stages').filter((file) => file.endsWith('.md'));
for (const stage of stages.filter((entry) => ['complete', 'blocked'].includes(entry.status))) {
  const stageFile = findStageLedger(stage.id, stageFiles);
  if (!stageFile) {
    errors.push(`${stage.id} has no stage ledger file`);
    continue;
  }
  const ledger = read(stageFile);
  if (!ledger.includes(`Status: ${stage.status}`)) {
    errors.push(`${stage.id} ledger status does not match the stage index`);
  }
  for (const section of contract.stageLifecycle.completionEvidence) {
    if (!ledger.includes(`## ${section}`))
      errors.push(`${stage.id} missing evidence section ${section}`);
  }
  const expectedOutcome = stage.status === 'complete' ? 'COMPLETE' : 'BLOCKED';
  if (!ledger.includes(`Outcome: ${expectedOutcome}`)) {
    errors.push(`${stage.id} ledger must record Outcome: ${expectedOutcome}`);
  }
}

errors.push(...validateProgramStatus(stages, read('.agent/status.md')));

for (const error of errors) fail(error);
if (errors.length === 0) pass('repository governance contract and stage evidence');
