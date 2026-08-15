import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateFoundationSpecifications } from './foundation-specifications.mjs';

const contract = json('.agent/foundation-specifications.json');
const specificationFiles = files(contract.specificationRoot).filter((file) => file.endsWith('.md'));
const specificationSources = Object.fromEntries(
  specificationFiles.map((file) => [file, read(file)]),
);
const governance = json('.agent/repository-governance.json');

const errors = validateFoundationSpecifications(contract, {
  stages: json('.agent/stages/index.json'),
  specificationSources,
  specificationFiles,
  governanceRoles: governance.roles.map((role) => role.id),
});

if (!exists('.agent/foundation-specifications.schema.json')) {
  errors.push('foundation specification schema does not exist');
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  const bound = contract.stages.filter((entry) => entry.specification !== null).length;
  pass(
    `${bound} foundation specifications bound to stage status across ${contract.stages.length} Phase 0 stages`,
  );
}
