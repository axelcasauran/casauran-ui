import fs from 'node:fs';
import path from 'node:path';
import { files, json, root, pass } from './lib.mjs';
const entries = files('registry/components')
  .filter((p) => p.endsWith('.json'))
  .map(json);
const out = Object.fromEntries(entries.map((e) => [e.name, []]));
for (const e of entries)
  for (const dep of e.composition.uses ?? []) if (out[dep]) out[dep].push(e.name);
for (const v of Object.values(out)) v.sort();
// Emit the same shape Prettier produces at printWidth 100, so `generate` followed by the
// repository format gate is idempotent: a value collapses onto one line when it fits, and expands
// otherwise. Without this the generator and `prettier --check` disagree on every multi-entry list.
const PRINT_WIDTH = 100;
const INDENT = '  ';
const body = Object.entries(out)
  .map(([name, consumers]) => {
    const inline = `${INDENT}${JSON.stringify(name)}: [${consumers
      .map((consumer) => JSON.stringify(consumer))
      .join(', ')}]`;
    if (inline.length <= PRINT_WIDTH) return inline;
    const lines = consumers.map((consumer) => `${INDENT.repeat(2)}${JSON.stringify(consumer)}`);
    return `${INDENT}${JSON.stringify(name)}: [\n${lines.join(',\n')}\n${INDENT}]`;
  })
  .join(',\n');

fs.mkdirSync(path.join(root, 'registry/derived'), { recursive: true });
fs.writeFileSync(path.join(root, 'registry/derived/required-by.json'), `{\n${body}\n}\n`);
pass('generated required-by');
