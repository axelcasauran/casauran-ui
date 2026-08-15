import { files, json, read, fail, pass } from './lib.mjs';

const stages = json('.agent/stages/index.json');
const components = stages.filter((s) => s.type === 'public-component');
const names = new Set();
const ids = new Set();
for (const s of stages) {
  if (ids.has(s.id)) fail(`duplicate stage id ${s.id}`);
  ids.add(s.id);
}
for (const s of components) {
  if (!s.component) fail(`${s.id} missing component`);
  if (names.has(s.component)) fail(`component in multiple stages: ${s.component}`);
  names.add(s.component);
}
if (components.length !== 127)
  fail(`expected 127 public component stages, got ${components.length}`);

// Stage inventory published anywhere in the repository is derived truth. `index.json` and the
// accepted-decision directory are the sources; every mirror is compared against them so an ADR
// that inserts a stage cannot leave a stale count behind.
const countByType = (type) => stages.filter((stage) => stage.type === type).length;
const acceptedDecisions = files('.agent/decisions').filter(
  (file) => file.endsWith('.md') && !file.endsWith('/ADR-TEMPLATE.md'),
).length;
const inventory = {
  foundationStages: countByType('foundation'),
  totalStages: stages.length,
  acceptedADRs: acceptedDecisions,
};

const manifest = json('scaffold-manifest.json').inventory ?? {};
for (const [key, expected] of Object.entries(inventory)) {
  if (manifest[key] !== expected) {
    fail(`scaffold-manifest.json inventory.${key} is ${manifest[key]}; expected ${expected}`);
  }
}
if (manifest.publicComponentStages !== components.length) {
  fail(
    `scaffold-manifest.json inventory.publicComponentStages is ${manifest.publicComponentStages}; expected ${components.length}`,
  );
}

const mirrors = [
  {
    path: '.agent/stages/README.md',
    expectations: [
      [`${inventory.totalStages} stages total`, 'total stage count'],
      [`- ${inventory.foundationStages} foundation`, 'foundation stage count'],
    ],
  },
  {
    path: 'VERIFICATION_REPORT.md',
    expectations: [
      [`Foundation stages: **${inventory.foundationStages}**`, 'foundation stage count'],
      [`Total execution stages: **${inventory.totalStages}**`, 'total stage count'],
      [`Accepted architecture ADRs: **${inventory.acceptedADRs}**`, 'accepted ADR count'],
    ],
  },
];
for (const mirror of mirrors) {
  const content = read(mirror.path);
  for (const [marker, label] of mirror.expectations) {
    if (!content.includes(marker)) fail(`${mirror.path} does not publish the current ${label}`);
  }
}

// Every foundation stage in the plan must appear in the human-readable Phase 0 table.
const promptPlan = read('.agent/PROMPT_PLAN.md');
for (const stage of stages.filter((candidate) => candidate.type === 'foundation')) {
  if (!promptPlan.includes(`\`${stage.id}\``)) {
    fail(`.agent/PROMPT_PLAN.md does not list foundation stage ${stage.id}`);
  }
}

if (process.exitCode !== 1) {
  pass(
    `one unique component per 127 public-component stages; ${inventory.totalStages} stages and ${inventory.acceptedADRs} decisions mirrored consistently`,
  );
}
