import { files, json, fail, pass } from './lib.mjs';

const entries = files('registry/components').filter((p) => p.endsWith('.json'));
const seen = new Set();
const allowed = new Set(['unreviewed','reference-analyzed','specified','api-approved','implemented','tested','documented','parity-verified','improved']);
for (const p of entries) {
  const e = json(p);
  for (const key of ['name','slug','category','phase','stage','status','package','reference','composition','rendering','parity','features']) {
    if (!(key in e)) fail(`${p} missing ${key}`);
  }
  if (seen.has(e.name)) fail(`duplicate component ${e.name}`);
  seen.add(e.name);
  if (!allowed.has(e.status)) fail(`${p} invalid status ${e.status}`);
  if (e.package !== '@casauran/react') fail(`${p} unexpected public package`);
}
if (entries.length !== 127) fail(`expected 127 component entries, got ${entries.length}`);
else pass('127 unique component registry entries');
