import fs from 'node:fs';
import path from 'node:path';
import { json, root } from './lib.mjs';
import { renderTokenModule, validateTokenContract } from './token-contract.mjs';

const contract = json('registry/tokens/foundation.json');
const errors = validateTokenContract(contract, (source) => fs.existsSync(path.join(root, source)));
if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exit(1);
}

const target = path.join(root, 'packages/tokens/src/generated.ts');
fs.writeFileSync(target, renderTokenModule(contract), 'utf8');
console.log(`PASS: generated ${path.relative(root, target).replaceAll(path.sep, '/')}`);
