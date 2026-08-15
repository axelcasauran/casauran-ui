import fs from 'node:fs';
import path from 'node:path';
import { root, fail, json, pass } from './lib.mjs';
import { computeReferenceInventory, sameReferenceInventory } from './reference-baseline.mjs';

const configured =
  process.env.CASAURAN_KENDO_DOCS_PATH ?? 'kdocs/references/kendo-react-docs/docs/content';

const resolved = path.resolve(root, configured);

if (!fs.existsSync(resolved)) {
  fail(`local KendoReact documentation corpus not found: ${resolved}`);
  console.error('Expected CASAURAN_KENDO_DOCS_PATH or the documented sibling path.');
  process.exit(1);
}

if (!fs.statSync(resolved).isDirectory()) {
  fail(`reference path is not a directory: ${resolved}`);
  process.exit(1);
}

// Require a docs/content root, not a full competitor repository.
if (path.basename(resolved) !== 'content' || path.basename(path.dirname(resolved)) !== 'docs') {
  fail(`reference path must point specifically to docs/content: ${resolved}`);
  process.exit(1);
}

const baseline = json('reference/kendo-react-baseline.json');
const pinnedInventory = json('reference/kendo-react-inventory.json');
const actualInventory = computeReferenceInventory(resolved, baseline.commit);
if (!sameReferenceInventory(actualInventory, pinnedInventory)) {
  fail('local reference corpus does not match the pinned file/domain inventory');
  console.error(`Expected digest: ${pinnedInventory.aggregate?.sha256 ?? '<missing>'}`);
  console.error(`Actual digest:   ${actualInventory.aggregate.sha256}`);
  process.exit(1);
}

const referenceMap = json('reference/reference-map.json');
const missingMappings = [];
for (const [component, entry] of Object.entries(referenceMap)) {
  const relativePath = entry.path?.replace(/^docs\/content\/?/u, '');
  const candidate = path.resolve(resolved, relativePath ?? '');
  if (
    typeof relativePath !== 'string' ||
    relativePath.length === 0 ||
    (!candidate.startsWith(`${resolved}${path.sep}`) && candidate !== resolved) ||
    !fs.existsSync(candidate) ||
    !fs.statSync(candidate).isDirectory()
  ) {
    missingMappings.push(`${component}: ${entry.path}`);
  }
}
if (missingMappings.length > 0) {
  fail(`local reference corpus is missing mapped component paths: ${missingMappings.join(', ')}`);
  process.exit(1);
}

pass(`local KendoReact docs: ${resolved}`);
pass(
  `pinned snapshot: ${actualInventory.aggregate.fileCount} files across ${actualInventory.aggregate.domainCount} domains (${actualInventory.aggregate.sha256})`,
);
pass(`mapped component paths present: ${Object.keys(referenceMap).length}`);
pass('reference access mode: LOCAL-ONLY');
pass('online fallback: DISABLED');
