import { files, json, read, fail, pass } from './lib.mjs';

const entries = files('registry/components').filter((p) => p.endsWith('.json'));
const seen = new Set();
const allowed = new Set([
  'unreviewed',
  'reference-analyzed',
  'specified',
  'api-approved',
  'implemented',
  'tested',
  'documented',
  'parity-verified',
  'improved',
]);
for (const p of entries) {
  const e = json(p);
  for (const key of [
    'name',
    'slug',
    'category',
    'phase',
    'stage',
    'status',
    'package',
    'reference',
    'composition',
    'rendering',
    'parity',
    'features',
  ]) {
    if (!(key in e)) fail(`${p} missing ${key}`);
  }
  if (seen.has(e.name)) fail(`duplicate component ${e.name}`);
  seen.add(e.name);
  if (!allowed.has(e.status)) fail(`${p} invalid status ${e.status}`);
  if (e.package !== '@casauran/react') fail(`${p} unexpected public package`);
}
if (entries.length !== 127) fail(`expected 127 component entries, got ${entries.length}`);

// Capability status must follow shipped source, not intent. A capability left `planned` after its
// owner package ships lets a later stage believe the shared engine does not exist yet and rebuild
// it privately, which is exactly what the capability registry exists to prevent.
const PLACEHOLDER_MODULE = 'export {};';
const packagePaths = new Set(
  files('packages')
    .filter((p) => /^packages\/[^/]+\/package\.json$/.test(p))
    .map((p) => p.split('/').slice(0, 2).join('/')),
);
const shipsSource = (packagePath) =>
  files(`${packagePath}/src`)
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .some((file) => read(file).trim() !== PLACEHOLDER_MODULE);

const capabilityAllowed = new Set(['planned', 'implemented', 'deprecated']);
const capabilities = files('registry/capabilities').filter((p) => p.endsWith('.json'));
for (const p of capabilities) {
  const capability = json(p);
  for (const key of ['name', 'owner', 'status', 'consumers', 'externalAdapterPolicy']) {
    if (!(key in capability)) fail(`${p} missing ${key}`);
  }
  if (!capabilityAllowed.has(capability.status)) {
    fail(`${p} invalid capability status ${capability.status}`);
  }

  const owners = capability.owner.split(/\s*(?:,|\band\b)\s*/).filter(Boolean);
  const unknown = owners.filter((owner) => !packagePaths.has(owner));
  if (unknown.length > 0) {
    fail(`${p} owner does not resolve to a workspace package: ${unknown.join(', ')}`);
    continue;
  }

  // A capability named after its own package is backed by that package's shipped source.
  const named = owners.filter((owner) => owner.split('/')[1] === capability.name);
  const backed = named.filter((owner) => shipsSource(owner));
  if (capability.status === 'planned' && backed.length > 0) {
    fail(`${p} is planned but ${backed.join(', ')} already ships implementation source`);
  }
  if (capability.status === 'implemented' && !owners.some((owner) => shipsSource(owner))) {
    fail(`${p} is implemented but no owner package ships implementation source`);
  }

  for (const consumer of capability.consumers) {
    if (consumer.startsWith('packages/') && !packagePaths.has(consumer)) {
      fail(`${p} names unknown consumer package ${consumer}`);
    }
  }
}

if (process.exitCode !== 1) {
  pass(`127 unique component registry entries and ${capabilities.length} capability owners`);
}
