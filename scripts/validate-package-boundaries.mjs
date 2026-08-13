import { files, read, fail, pass } from './lib.mjs';

const source = [...files('packages'), ...files('apps')].filter((p) =>
  /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(p),
);
for (const p of source) {
  const text = read(p);
  const imports = [...text.matchAll(/(?:from\s+|import\s*\()(['"])([^'"]+)\1/g)].map((m) => m[2]);
  for (const spec of imports) {
    if (/^@casauran-ui\/.+\/(?:src|internal)(?:\/|$)/.test(spec))
      fail(`${p}: forbidden deep internal import ${spec}`);
    if (/^\.\.\/\.\.\/packages\//.test(spec) || /^\.\.\/packages\//.test(spec))
      fail(
        `${p}: packages must be imported through package exports, not relative package paths (${spec})`,
      );
  }
}
pass('package import boundaries');
