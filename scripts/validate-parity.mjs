import { files, json, fail, pass } from './lib.mjs';
for (const e of files('registry/components').filter((p) => p.endsWith('.json')).map(json)) {
  if (!['parity-verified','improved'].includes(e.status)) continue;
  const incomplete = Object.entries(e.parity).filter(([,v]) => !['pass','not-applicable'].includes(v));
  if (incomplete.length) fail(`${e.name}: parity state with incomplete dimensions ${incomplete.map(([k])=>k).join(',')}`);
}
pass('parity state consistency');
