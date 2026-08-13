import fs from 'node:fs';
import path from 'node:path';
import { root, fail, pass } from './lib.mjs';

const configured =
  process.env.CASAURAN_KENDO_DOCS_PATH ?? '../references/kendo-react-docs/docs/content';

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

const expectedDomains = [
  'buttons',
  'inputs',
  'dropdowns',
  'dateinputs',
  'grid',
  'scheduler',
  'gantt',
  'editor',
  'diagram',
  'charts',
];

const missing = expectedDomains.filter((domain) => !fs.existsSync(path.join(resolved, domain)));

if (missing.length > 0) {
  fail(`local reference corpus is missing expected domains: ${missing.join(', ')}`);
  process.exit(1);
}

pass(`local KendoReact docs: ${resolved}`);
pass(`expected documentation domains present: ${expectedDomains.length}`);
pass('reference access mode: LOCAL-ONLY');
pass('online fallback: DISABLED');
