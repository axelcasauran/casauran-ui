import { files, json, fail, pass, read, exists } from './lib.mjs';
import { validateMechanicalGovernance } from './mechanical-governance.mjs';

const contract = json('.agent/mechanical-governance.json');
const packageManifest = json('package.json');
const governance = json('.agent/repository-governance.json');
const validatorScripts = files('scripts').filter((file) =>
  /^scripts\/validate-[^/]+\.mjs$/u.test(file),
);
const executionSources = [
  ...validatorScripts,
  ...(contract.execution?.supportScripts ?? []),
  contract.execution?.runner,
  contract.ci?.workflow,
].filter((source) => typeof source === 'string');
const sourceTexts = Object.fromEntries(
  [...new Set(executionSources)]
    .filter((source) => exists(source))
    .map((source) => [source, read(source)]),
);

const errors = validateMechanicalGovernance(contract, {
  sourceExists: exists,
  sourceTexts,
  validatorScripts,
  packageScripts: packageManifest.scripts,
  governanceRoles: governance.roles.map((role) => role.id),
});

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(`mechanical governance owns ${contract.validators.length} repository validators`);
}
