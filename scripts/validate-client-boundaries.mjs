import { files, read, fail, pass } from './lib.mjs';
for (const p of files('packages')) {
  if (!/\/src\/index\.(ts|tsx)$/.test(p)) continue;
  if (/^[\s\n]*['"]use client['"]/.test(read(p))) fail(`${p}: broad package-root client boundary`);
}
pass('no broad package-root use-client directive');
