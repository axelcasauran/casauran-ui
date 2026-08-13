import { files, json, fail, pass } from './lib.mjs';

const manifests = files('packages').filter((p) => p.endsWith('/package.json'));
for (const p of manifests) {
  const m = json(p);
  for (const [name, version] of Object.entries(m.dependencies ?? {})) {
    if (!name.startsWith('@casauran/') && !name.startsWith('@casauran-internal/'))
      fail(`${p}: external runtime dependency ${name}@${version}`);
  }
  if (m.name === '@casauran/react') {
    for (const peer of Object.keys(m.peerDependencies ?? {})) {
      if (!['react', 'react-dom'].includes(peer)) fail(`${p}: unexpected peer ${peer}`);
    }
  }
}
pass('library runtime dependencies are internal-only; React is peer-only');
