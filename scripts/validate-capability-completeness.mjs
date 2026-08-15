import {
  AUDITED_STATUSES,
  DISPOSITIONS,
  FORBIDDEN_STATES,
  validateParityDocument,
  validatePendingEntry,
} from './capability-completeness.mjs';
import { exists, fail, files, json, pass, read } from './lib.mjs';

const contract = json('.agent/capability-completeness.json');

if (contract.schemaVersion !== 1) fail('capability completeness contract schemaVersion must be 1');
for (const source of [contract.contract, contract.prompt, contract.decision]) {
  if (typeof source !== 'string' || !exists(source)) {
    fail(`capability completeness contract references a missing authority: ${String(source)}`);
  }
}
for (const name of DISPOSITIONS) {
  if (!(contract.dispositions ?? []).includes(name)) {
    fail(`capability completeness contract omits the disposition ${name}`);
  }
}
for (const state of FORBIDDEN_STATES) {
  if (!(contract.forbiddenStates ?? []).includes(state)) {
    fail(`capability completeness contract omits the forbidden state ${state}`);
  }
}

const entries = files('registry/components')
  .filter((path) => path.endsWith('.json'))
  .map(json);
const audited = entries.filter((entry) => AUDITED_STATUSES.has(entry.status));
const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));

const pending = Array.isArray(contract.pendingRevalidation) ? contract.pendingRevalidation : [];
const pendingSlugs = new Set();
for (const entry of pending) {
  for (const error of validatePendingEntry(entry)) fail(error);
  const component = bySlug.get(entry.slug);
  if (component === undefined) {
    fail(`pending revalidation names an unknown component ${String(entry.slug)}`);
    continue;
  }
  if (component.stage !== entry.stage) {
    fail(`pending revalidation for ${component.name} names stage ${String(entry.stage)}`);
  }
  if (!AUDITED_STATUSES.has(component.status)) {
    fail(`${component.name} is not audited and needs no pending revalidation entry`);
  }
  pendingSlugs.add(entry.slug);
}

let checked = 0;
for (const entry of audited) {
  if (pendingSlugs.has(entry.slug)) continue;
  const document = `specs/components/${entry.slug}.parity.md`;
  if (!exists(document)) {
    fail(`${entry.name}: ${entry.status} requires ${document}`);
    continue;
  }
  const notApplicable = Object.entries(entry.parity ?? {})
    .filter(([, value]) => value === 'not-applicable')
    .map(([dimension]) => dimension);
  for (const error of validateParityDocument(entry.slug, read(document), notApplicable)) {
    fail(error);
  }
  checked += 1;
}

if (process.exitCode !== 1) {
  pass(
    `capability dispositions complete for ${String(checked)} of ${String(audited.length)} audited components; ${String(pending.length)} awaiting governed revalidation`,
  );
}
