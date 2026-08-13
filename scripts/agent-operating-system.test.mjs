import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { resolveAgentRoute, validateAgentOperatingSystem } from './agent-operating-system.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contract = JSON.parse(
  fs.readFileSync(path.join(root, '.agent/agent-operating-system.json'), 'utf8'),
);
const directories = (directory) =>
  fs
    .readdirSync(path.join(root, directory), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
const markdownNames = (directory) =>
  fs
    .readdirSync(path.join(root, directory), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.basename(entry.name, '.md'));
const catalogs = {
  skills: directories('skills'),
  workflows: markdownNames('.agent/workflows'),
  prompts: markdownNames('.agent/prompts'),
};

const cloneContract = () => structuredClone(contract);

test('routes the complete repository Agent OS catalog', () => {
  assert.deepEqual(validateAgentOperatingSystem(contract, catalogs), []);
});

test('combines task, modifier, and domain routes without duplicates', () => {
  const route = resolveAgentRoute(contract, {
    taskClass: 'public-component',
    modifiers: ['complex-widget', 'security-sensitive'],
    domains: ['tree'],
  });
  assert.ok(route.prompts.includes('component-stage'));
  assert.ok(route.prompts.includes('complex-widget'));
  assert.ok(route.workflows.includes('new-component'));
  assert.ok(route.workflows.includes('complex-widget'));
  assert.ok(route.skills.includes('component'));
  assert.ok(route.skills.includes('tree'));
  assert.equal(route.skills.filter((skill) => skill === 'security').length, 1);
});

test('rejects a route that references an unknown skill', () => {
  const invalid = cloneContract();
  invalid.taskClasses[0].skills.push('unknown-skill');
  const errors = validateAgentOperatingSystem(invalid, catalogs);
  assert.ok(errors.includes('unknown skill route unknown-skill'));
});

test('rejects an orphaned workflow catalog entry', () => {
  const errors = validateAgentOperatingSystem(contract, {
    ...catalogs,
    workflows: [...catalogs.workflows, 'orphaned-workflow'],
  });
  assert.ok(errors.includes('unrouted workflow orphaned-workflow'));
});

test('rejects missing lifecycle and task-class coverage', () => {
  const invalid = cloneContract();
  invalid.executionLifecycle = invalid.executionLifecycle.filter((step) => step.id !== 'validate');
  invalid.taskClasses = invalid.taskClasses.filter((route) => route.id !== 'foundation');
  const errors = validateAgentOperatingSystem(invalid, catalogs);
  assert.ok(errors.includes('missing required lifecycle step validate'));
  assert.ok(errors.includes('missing required task class foundation'));
});

test('rejects missing catalog roots', () => {
  const invalid = cloneContract();
  delete invalid.catalogs.skillsRoot;
  const errors = validateAgentOperatingSystem(invalid, catalogs);
  assert.ok(errors.includes('catalog root skillsRoot is required'));
});
