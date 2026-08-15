import fs from 'node:fs';
import path from 'node:path';

import { root } from './lib.mjs';
import { computeReferenceInventory } from './reference-baseline.mjs';

if (!process.argv.includes('--write')) {
  console.error('Usage: node scripts/reference-inventory.mjs --write');
  process.exit(1);
}

const baseline = JSON.parse(
  fs.readFileSync(path.join(root, 'reference/kendo-react-baseline.json'), 'utf8'),
);
const configured =
  process.env.CASAURAN_KENDO_DOCS_PATH ?? 'kdocs/references/kendo-react-docs/docs/content';
const resolved = path.resolve(root, configured);

if (path.basename(resolved) !== 'content' || path.basename(path.dirname(resolved)) !== 'docs') {
  console.error(`FAIL: reference path must point specifically to docs/content: ${resolved}`);
  process.exit(1);
}

const inventory = computeReferenceInventory(resolved, baseline.commit);
fs.writeFileSync(
  path.join(root, 'reference/kendo-react-inventory.json'),
  `${JSON.stringify(inventory, null, 2)}\n`,
);
console.log(
  `PASS: wrote ${inventory.aggregate.fileCount} files across ${inventory.aggregate.domainCount} domains (${inventory.aggregate.sha256})`,
);
