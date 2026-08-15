const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Playwright names a baseline `<name>-<project>-<platform>.png`. A snapshot name may itself contain
 * hyphens, so the two trailing segments are authoritative and everything before them is the name.
 */
export const parseBaselineFileName = (fileName, projects, extension) => {
  if (!fileName.endsWith(extension)) return null;
  const segments = fileName.slice(0, -extension.length).split('-');
  if (segments.length < 3) return null;
  const platform = segments.at(-1);
  const project = segments.at(-2);
  const name = segments.slice(0, -2).join('-');
  if (name.length === 0 || !projects.includes(project)) return null;
  return { name, project, platform };
};

/**
 * The gate is authoritative on the CI runner, so the runner label is the single source of truth for
 * which platform baselines must exist. Declaring the platform separately would let it drift.
 */
export const resolveRunnerPlatform = (workflowSource, runnerPlatforms) => {
  const runner = /^\s*runs-on:\s*(\S+)\s*$/mu.exec(workflowSource ?? '')?.[1];
  if (runner === undefined) return { runner: null, platform: null };
  const prefix = Object.keys(runnerPlatforms).find((candidate) => runner.startsWith(candidate));
  return { runner, platform: prefix === undefined ? null : runnerPlatforms[prefix] };
};

export const validateVisualBaselines = (
  contract,
  { workflowSource = '', baselineFiles = [], browserProjects = [] } = {},
) => {
  const errors = [];
  const visual = isObject(contract.visualBaselines) ? contract.visualBaselines : {};
  const extension = typeof visual.extension === 'string' ? visual.extension : '';
  const suffix =
    typeof visual.snapshotDirectorySuffix === 'string' ? visual.snapshotDirectorySuffix : '';
  const runnerPlatforms = isObject(visual.runnerPlatforms) ? visual.runnerPlatforms : {};

  if (extension.length === 0) errors.push('visual baseline extension must be declared');
  if (suffix.length === 0) errors.push('visual snapshot directory suffix must be declared');
  if (Object.keys(runnerPlatforms).length === 0) {
    errors.push('visual baselines must map CI runner labels to Playwright platforms');
  }
  if (typeof visual.rationale !== 'string' || visual.rationale.trim().length === 0) {
    errors.push('visual baseline platform rule must record its rationale');
  }
  if (browserProjects.length === 0) errors.push('no browser projects are declared');
  if (errors.length > 0) return errors;

  const { runner, platform } = resolveRunnerPlatform(workflowSource, runnerPlatforms);
  if (runner === null) {
    errors.push('CI workflow does not declare a runs-on runner');
    return errors;
  }
  if (platform === null) {
    errors.push(`CI runner ${runner} maps to no known Playwright platform`);
    return errors;
  }

  // name -> directory -> set of projects that have a baseline on the CI platform
  const covered = new Map();
  const names = new Map();
  for (const file of baselineFiles) {
    const segments = file.split('/');
    const fileName = segments.at(-1) ?? '';
    const directory = segments.slice(0, -1).join('/');
    if (!directory.endsWith(suffix)) {
      errors.push(`visual baseline outside a ${suffix} directory: ${file}`);
      continue;
    }
    const parsed = parseBaselineFileName(fileName, browserProjects, extension);
    if (parsed === null) {
      errors.push(`unparseable visual baseline name: ${file}`);
      continue;
    }
    const key = `${directory}/${parsed.name}`;
    names.set(key, directory);
    if (parsed.platform !== platform) continue;
    const projects = covered.get(key) ?? new Set();
    projects.add(parsed.project);
    covered.set(key, projects);
  }

  const missing = [];
  for (const [key] of [...names].sort()) {
    const projects = covered.get(key) ?? new Set();
    const absent = browserProjects.filter((project) => !projects.has(project));
    if (absent.length > 0) missing.push(`${key} [${absent.join(', ')}]`);
  }

  if (missing.length > 0) {
    const total = missing.reduce((sum, entry) => sum + entry.split(',').length, 0);
    errors.push(
      `${total} visual baselines are missing for ${platform}, the platform CI runs on (${runner}): ${missing.join('; ')}`,
    );
    errors.push(
      `regenerate on the CI platform with \`pnpm exec playwright test --update-snapshots\`, review each image as evidence, and commit the ${platform} set`,
    );
  }

  return errors;
};
