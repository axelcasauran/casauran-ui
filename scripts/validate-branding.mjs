import { files, read, json, fail, pass } from './lib.mjs';

const publicPackages = new Set(['react', 'tokens', 'theme', 'icons']);
for (const p of files('packages').filter((p) => p.endsWith('/package.json'))) {
  const m = json(p);
  const pkg = p.split('/')[1];
  const expected = publicPackages.has(pkg) ? `@casauran/${pkg}` : `@casauran-internal/${pkg}`;
  if (m.name !== expected) fail(`${p}: expected ${expected}, got ${m.name}`);
}

const customerFacing = [
  'README.md',
  ...files('apps').filter((p) => /README\.md$|\/app\/.*\.(ts|tsx)$/.test(p)),
];
const forbidden = [
  /Enterprise UI/g,
  /Axuran/g,
  /Lattice UI/g,
  /KendoReact clone/gi,
  /Kendo clone/gi,
];
for (const p of customerFacing) {
  const text = read(p);
  for (const rx of forbidden)
    if (rx.test(text)) fail(`${p}: forbidden customer-facing legacy branding ${rx}`);
}

const theme = read('packages/theme/src/theme.css');
if (/--ui-/.test(theme)) fail('theme CSS still contains legacy --ui-* variables');
if (!/--csn-/.test(theme)) fail('theme CSS does not contain --csn-* namespace');

pass('Casauran branding and namespace contracts');
