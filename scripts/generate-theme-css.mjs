import fs from 'node:fs';
import path from 'node:path';

import { json, root } from './lib.mjs';
import { renderThemeCss, validateThemeContract } from './theme-contract.mjs';

const contract = json('registry/themes/foundation.json');
const tokens = json('registry/tokens/foundation.json');
const errors = validateThemeContract(contract, tokens, (source) =>
  fs.existsSync(path.join(root, source)),
);
if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exitCode = 1;
} else {
  const target = path.join(root, 'packages/theme/src/theme.css');
  fs.writeFileSync(target, renderThemeCss(contract, tokens), 'utf8');
  console.log('PASS: generated packages/theme/src/theme.css');
}
