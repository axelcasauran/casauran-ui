import { exists, files, json, fail, pass } from './lib.mjs';
import { validateReferenceBaseline } from './reference-baseline.mjs';

const components = files('registry/components')
  .filter((file) => file.endsWith('.json'))
  .map(json);
const baseline = json('reference/kendo-react-baseline.json');
const inventory = json('reference/kendo-react-inventory.json');
const errors = validateReferenceBaseline(
  {
    baseline,
    config: json('reference/local-reference.json'),
    inventory,
    referenceMap: json('reference/reference-map.json'),
    stages: json('.agent/stages/index.json'),
    components,
  },
  { sourceExists: exists },
);

for (const error of errors) fail(error);
if (errors.length === 0) {
  pass(
    `reference baseline pins ${inventory.aggregate.fileCount} files, ${inventory.aggregate.domainCount} domains and ${components.length} component mappings`,
  );
}
