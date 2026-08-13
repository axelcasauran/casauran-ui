import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
export const json = (p) => JSON.parse(read(p));
export const exists = (p) => fs.existsSync(path.join(root, p));
export const files = (dir) => {
  const base = path.join(root, dir);
  if (!fs.existsSync(base)) return [];
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out.push(path.relative(root, p).replaceAll(path.sep, '/'));
    }
  };
  walk(base);
  return out;
};
export const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
export const pass = (message) => console.log(`PASS: ${message}`);
