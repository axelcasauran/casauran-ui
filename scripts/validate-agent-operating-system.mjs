import path from 'node:path';
import { exists, fail, files, json, pass, read } from './lib.mjs';
import { validateAgentOperatingSystem } from './agent-operating-system.mjs';

const contract = json('.agent/agent-operating-system.json');
const catalogs = {
  skills: files('skills')
    .filter((file) => file.endsWith('/SKILL.md'))
    .map((file) => file.split('/')[1]),
  workflows: files('.agent/workflows')
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.posix.basename(file, '.md')),
  prompts: files('.agent/prompts')
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.posix.basename(file, '.md')),
};

const errors = validateAgentOperatingSystem(contract, catalogs, exists);
if (!exists(`.agent/${contract.$schema}`)) {
  errors.push(`Agent OS schema does not exist: ${contract.$schema}`);
}
const governance = json('.agent/repository-governance.json');
const governanceRoles = new Set(governance.roles.map((role) => role.id));
for (const role of contract.ownerRoles) {
  if (!governanceRoles.has(role))
    errors.push(`Agent OS references unknown governance role ${role}`);
}

const ownershipPatterns = new Set(governance.pathOwnership.map((entry) => entry.pattern));
for (const pattern of [
  '/AI_AGENT_OPERATING_MODEL.md',
  '/.agent/agent-operating-system*.json',
  '/.agent/protocol.md',
  '/.agent/prompts/**',
  '/.agent/workflows/**',
  '/skills/**',
]) {
  if (!ownershipPatterns.has(pattern)) errors.push(`Agent OS ownership missing ${pattern}`);
}

const requiredSkillHeadings = [
  '## When to load',
  '## Preconditions',
  '## Hard rules',
  '## Analysis checklist',
  '## Enterprise dimensions',
  '## Implementation discipline',
  '## Forbidden shortcuts',
  '## Required records',
  '## Definition of Done',
];
for (const skill of catalogs.skills) {
  const content = read(`skills/${skill}/SKILL.md`);
  for (const heading of requiredSkillHeadings) {
    if (!content.includes(heading)) errors.push(`${skill} skill missing ${heading}`);
  }
}

const requiredWorkflowHeadings = [
  '## Purpose',
  '## Entry conditions',
  '## Procedure',
  '## Hard gates',
  '## Exit',
];
for (const workflow of catalogs.workflows) {
  const content = read(`.agent/workflows/${workflow}.md`);
  for (const heading of requiredWorkflowHeadings) {
    if (!content.includes(heading)) errors.push(`${workflow} workflow missing ${heading}`);
  }
  if (!content.includes('## Records') && !content.includes('## Required records')) {
    errors.push(`${workflow} workflow missing records section`);
  }
}

for (const prompt of catalogs.prompts) {
  if (read(`.agent/prompts/${prompt}.md`).trim().length === 0) {
    errors.push(`${prompt} prompt is empty`);
  }
}

const requiredModelHeadings = [
  '## Authority and conflict handling',
  '## Operating-system layers',
  '## Routing model',
  '## Execution lifecycle',
  '## Autonomy and scope',
  '## Completion, blocking, and handoff',
  '## Context and security discipline',
  '## Ownership and evolution',
];
const model = read('AI_AGENT_OPERATING_MODEL.md');
for (const heading of requiredModelHeadings) {
  if (!model.includes(heading)) errors.push(`AI_AGENT_OPERATING_MODEL.md missing ${heading}`);
}

const protocol = read('.agent/protocol.md');
for (const step of contract.executionLifecycle) {
  const heading = `## ${contract.executionLifecycle.indexOf(step) + 1}.`;
  if (!protocol.includes(heading)) errors.push(`protocol missing ordered step ${step.id}`);
}

const packageManifest = json('package.json');
if (
  packageManifest.scripts?.['validate:agent-os'] !==
  'node scripts/validate-agent-operating-system.mjs'
) {
  errors.push('package.json must expose validate:agent-os');
}
if (
  packageManifest.scripts?.['test:agent-os'] !==
  'node --test scripts/agent-operating-system.test.mjs'
) {
  errors.push('package.json must expose test:agent-os');
}
const mechanicalGovernance = json('.agent/mechanical-governance.json');
if (
  !mechanicalGovernance.validators?.some(
    (validator) => validator.script === 'scripts/validate-agent-operating-system.mjs',
  )
) {
  errors.push('mechanical governance must run Agent OS validation');
}

const stages = json('.agent/stages/index.json');
if (stages.find((stage) => stage.id === 'F0.01')?.status !== 'complete') {
  errors.push('F0.01 must be complete before the Agent Operating System is valid');
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `Agent Operating System routes ${catalogs.skills.length} skills, ${catalogs.workflows.length} workflows and ${catalogs.prompts.length} prompts`,
  );
}
