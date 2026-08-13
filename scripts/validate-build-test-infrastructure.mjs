import path from 'node:path';
import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateBuildTestInfrastructure } from './build-test-infrastructure.mjs';

const contract = json('.agent/build-test-infrastructure.json');
const packageManifest = json('package.json');
const governance = json('.agent/repository-governance.json');
const libraryManifests = files(contract.build.libraryRoot)
  .filter((file) => /^packages\/[^/]+\/package\.json$/u.test(file))
  .map((manifestPath) => {
    const directory = path.posix.dirname(manifestPath);
    return {
      path: directory,
      manifest: json(manifestPath),
      tsconfig: json(`${directory}/tsconfig.json`),
    };
  });
const hostManifests = contract.hosts.map((declared) => {
  const directory = `apps/${declared.id}`;
  return {
    id: declared.id,
    path: directory,
    manifest: json(`${directory}/package.json`),
    tsconfig: json(`${directory}/tsconfig.json`),
  };
});
const sourcePaths = [
  '.node-version',
  '.gitignore',
  'vitest.config.mts',
  'playwright.config.ts',
  'tests/browser/scaffold.spec.ts',
  contract.ci.workflow,
  'BUILD_TEST_INFRASTRUCTURE.md',
];
const sourceTexts = Object.fromEntries(
  sourcePaths.filter(exists).map((source) => [source, read(source)]),
);

const errors = validateBuildTestInfrastructure(contract, {
  sourceExists: exists,
  sourceTexts,
  packageManifest,
  baseTsconfig: json('tsconfig.base.json'),
  libraries: libraryManifests,
  hosts: hostManifests,
  governanceRoles: governance.roles.map((role) => role.id),
  trackedGeneratedArtifacts: contract.hosts
    .map((host) => `apps/${host.id}/tsconfig.tsbuildinfo`)
    .filter(exists),
});

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `build/test infrastructure covers ${libraryManifests.length} libraries, ${hostManifests.length} hosts and ${contract.browserProjects.length} browsers`,
  );
}
