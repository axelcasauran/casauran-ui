import path from 'node:path';
import { exists, fail, files, json, pass } from './lib.mjs';
import { validateLibraryBuildOutputs } from './build-test-infrastructure.mjs';

const libraries = files('packages')
  .filter((file) => /^packages\/[^/]+\/package\.json$/u.test(file))
  .map((manifestPath) => ({
    path: path.posix.dirname(manifestPath),
    manifest: json(manifestPath),
  }));
const errors = validateLibraryBuildOutputs(libraries, exists);
for (const error of errors) fail(error);
if (errors.length === 0)
  pass(`verified ESM, declarations and maps for ${libraries.length} libraries`);
