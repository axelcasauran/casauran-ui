import { json, fail, pass } from './lib.mjs';

const stages = json('.agent/stages/index.json');
const components = stages.filter((s) => s.type === 'public-component');
const names = new Set();
const ids = new Set();
for (const s of stages) {
  if (ids.has(s.id)) fail(`duplicate stage id ${s.id}`);
  ids.add(s.id);
}
for (const s of components) {
  if (!s.component) fail(`${s.id} missing component`);
  if (names.has(s.component)) fail(`component in multiple stages: ${s.component}`);
  names.add(s.component);
}
if (components.length !== 127)
  fail(`expected 127 public component stages, got ${components.length}`);
else pass('one unique component per 127 public-component stages');
