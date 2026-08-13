import { files, json, read, fail, pass } from './lib.mjs';

const supported = new Set([
  '@casauran/react',
  '@casauran/tokens',
  '@casauran/theme',
  '@casauran/icons',
]);
for (const p of files('packages').filter((p) => p.endsWith('/package.json'))) {
  const m = json(p);
  if (!m.exports) fail(`${p}: package requires explicit exports`);
  if (supported.has(m.name) && !m.publishConfig)
    fail(`${p}: supported package missing publishConfig`);
}
for (const p of files('packages/react/src').filter((p) => /\.(ts|tsx)$/.test(p))) {
  const text = read(p);
  const externalImports = [...text.matchAll(/(?:from\s+|import\s*\()(['"])([^.'"][^'"]*)\1/g)].map(
    (m) => m[2],
  );
  for (const spec of externalImports) {
    if (!spec.startsWith('@casauran/') && spec !== 'react' && spec !== 'react-dom') {
      fail(`${p}: public React source imports unapproved external runtime module ${spec}`);
    }
  }
}
pass('supported public package/API boundary');
