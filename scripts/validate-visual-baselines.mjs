import { fail, files, json, pass, read } from './lib.mjs';
import { validateVisualBaselines } from './visual-baselines.mjs';

const contract = json('.agent/build-test-infrastructure.json');
const visual = contract.visualBaselines;
const baselineFiles = files(visual.root).filter((file) => file.endsWith(visual.extension));

const errors = validateVisualBaselines(contract, {
  workflowSource: read(contract.ci.workflow),
  baselineFiles,
  browserProjects: contract.browserProjects,
});

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${baselineFiles.length} visual baselines cover ${contract.browserProjects.length} browsers on the CI platform`,
  );
}
