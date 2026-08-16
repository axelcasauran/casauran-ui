import fs from 'node:fs';
import path from 'node:path';
import { files, json, root } from './lib.mjs';
import { renderTokenModule, validateTokenContract } from './token-contract.mjs';

const contract = json('registry/tokens/foundation.json');

// The generator applies the same contract as the gate, including resolving a component's slug
// through its registry entry rather than deriving one from its name.
const slugByComponentName = new Map(
  files('registry/components')
    .filter((source) => source.endsWith('.json'))
    .map(json)
    .map((entry) => [entry.name, entry.slug]),
);

const errors = validateTokenContract(
  contract,
  (source) => fs.existsSync(path.join(root, source)),
  (slug) => json(`registry/components/${slug}.json`).status,
  (name) => slugByComponentName.get(name) ?? '',
);
if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exit(1);
}

const target = path.join(root, 'packages/tokens/src/generated.ts');
fs.writeFileSync(target, renderTokenModule(contract), 'utf8');
console.log(`PASS: generated ${path.relative(root, target).replaceAll(path.sep, '/')}`);
