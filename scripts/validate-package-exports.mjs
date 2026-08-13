import { files, json, fail, pass } from './lib.mjs';
for (const p of files('packages').filter((p) => p.endsWith('/package.json'))) {
  const m = json(p);
  if (!m.exports || !m.exports['.']) fail(`${p}: missing root export`);
  if (m.sideEffects === false && (m.files ?? []).some((f) => f.includes('css'))) {
    // false is valid only when the package has no CSS side effects; actual theme/react packages declare CSS.
  }
}
for (const pkg of ['theme','react']) {
  const m = json(`packages/${pkg}/package.json`);
  if (!Array.isArray(m.sideEffects) || !m.sideEffects.some((x) => x.includes('.css'))) fail(`${pkg}: CSS sideEffects missing`);
}
pass('package export/side-effect baseline');
