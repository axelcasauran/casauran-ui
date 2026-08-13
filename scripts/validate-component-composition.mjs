import { files, json, read, fail, pass } from './lib.mjs';

const interactiveTags = ['button', 'input', 'select', 'textarea'];
const entries = files('registry/components')
  .filter((p) => p.endsWith('.json'))
  .map(json);
for (const e of entries) {
  if (!e.composition?.uses?.length) continue;
  const base = `packages/react/src/components/${e.category}/${e.slug}`;
  const sourceFiles = files(base).filter((p) => /\.(tsx|jsx)$/.test(p));
  const allowed = new Set((e.composition.nativeInteractiveExceptions ?? []).map((x) => x.element));
  for (const p of sourceFiles) {
    const text = read(p);
    for (const tag of interactiveTags) {
      const rx = new RegExp(`<${tag}(?:\\s|>)`, 'i');
      if (rx.test(text) && !allowed.has(tag)) {
        fail(
          `${e.name}: ${p} directly renders <${tag}> in a composite with canonical dependencies; add a justified registry exception or compose the owning component`,
        );
      }
    }
  }
}
pass('component composition source check');
