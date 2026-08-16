import { exists, fail, files, json, pass, read } from './lib.mjs';
import { renderTokenModule, validateTokenContract } from './token-contract.mjs';

const contract = json('registry/tokens/foundation.json');

// A component's slug is declared in its registry entry, not derived from its name: `SVGIcon` is
// `svg-icon` and `PDFViewer` is `pdf-viewer`, which no mechanical derivation from the name
// produces. Resolving through the registry keeps one source of truth for the mapping.
const slugByComponentName = new Map(
  files('registry/components')
    .filter((path) => path.endsWith('.json'))
    .map(json)
    .map((entry) => [entry.name, entry.slug]),
);

const errors = validateTokenContract(
  contract,
  exists,
  (slug) => json(`registry/components/${slug}.json`).status,
  (name) => slugByComponentName.get(name) ?? '',
);

if (
  read('packages/tokens/src/generated.ts').replaceAll('\r\n', '\n') !== renderTokenModule(contract)
) {
  errors.push('generated token module is stale; run pnpm generate:tokens');
}

const packageManifest = json('packages/tokens/package.json');
if (packageManifest.name !== '@casauran/tokens' || packageManifest.private === true) {
  errors.push('@casauran/tokens must remain a supported public package');
}
if (packageManifest.dependencies !== undefined || packageManifest.peerDependencies !== undefined) {
  errors.push('@casauran/tokens must remain runtime dependency-free');
}
if (packageManifest.exports?.['.']?.import !== './dist/index.js') {
  errors.push('@casauran/tokens must expose its ESM root');
}

const capability = json('registry/capabilities/tokens.json');
if (capability.owner !== 'packages/tokens' || capability.status !== 'implemented') {
  errors.push('token capability registry must be implemented and owned by packages/tokens');
}

const specification = read('specs/foundation/tokens.md');
for (const heading of [
  '## Scope and ownership',
  '## Token layers',
  '## Public API contract',
  '## Naming and CSS variables',
  '## Accessibility and theme obligations',
  '## SSR, security, and performance',
  '## Compatibility and evolution',
  '## F0.06 boundary',
]) {
  if (!specification.includes(heading)) errors.push(`token specification missing ${heading}`);
}

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `${contract.primitives.length} primitive, ${contract.semantics.length} semantic and ${contract.components.length} component tokens`,
  );
}
