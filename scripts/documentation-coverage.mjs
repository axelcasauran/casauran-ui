// Documentation coverage contract (ADR-023), resolved against the topic model (ADR-024).
//
// A component's registry entry already declares what it can do, in `features`. Nothing bound that
// list to what the documentation actually shows, so Button could ship eighteen features and render
// two of them — with `outline`, `ghost` and `link` never appearing at all.
//
// Each declared feature must say how it is demonstrated:
//
//   preview  a rendered example in the topic that owns it; enumerated features show every value
//   section  a published topic, for behaviour that has nothing to render
//   fixture  environment-conditional behaviour (forced colors, reduced motion, RTL, focus)
//            proven by a browser or visual case and described in prose
//
// Since F0.19 a component's documentation is a declared set of topic pages rather than one file,
// so `anchor` names the topic that owns the feature and values are searched across the component's
// content module and its example modules — the same files that render.

export const COVERAGE_MODES = ['preview', 'section', 'fixture'];
const DOCUMENTED_MODES = new Set(['preview', 'section']);
const MINIMUM_PENDING_REASON_CHARACTERS = 60;
const STAGE_REFERENCE = /(?:F0\.\d{2}|\d{1,2}\.\d{2})/u;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Extracts the topic ids a content module publishes. Every topic entry is an object literal whose
 * first key is `summary`, which is what makes this recognisable without parsing TypeScript.
 */
export const publishedTopics = (indexSource) => {
  const found = new Set();
  const pattern = /(?:^|\n)\s*(?:'([a-z][a-z0-9-]*)'|([a-z][a-z0-9-]*)):\s*\{\s*\n\s*summary:/gu;
  for (const match of indexSource.matchAll(pattern)) {
    const id = match[1] ?? match[2];
    if (id !== undefined) found.add(id);
  }
  return found;
};

/**
 * Validates one component's feature coverage declaration against its documentation content.
 *
 * @param {Record<string, unknown>} entry registry/components/<slug>.json contents
 * @param {{ index: string, examples: string, topics?: ReadonlySet<string> }} content
 *        `index` is the component content module; `examples` is every example module concatenated.
 * @param {(path: string) => boolean} sourceExists
 * @returns {string[]} human-readable errors; empty when the component satisfies the contract
 */
export const validateFeatureCoverage = (entry, content, sourceExists = () => true) => {
  const errors = [];
  const name = typeof entry['name'] === 'string' ? entry['name'] : 'unnamed component';
  const features = Array.isArray(entry['features']) ? entry['features'] : [];
  const coverage = isObject(entry['featureCoverage']) ? entry['featureCoverage'] : undefined;
  const index = content.index ?? '';
  const rendered = `${index}\n${content.examples ?? ''}`;
  const topics = content.topics ?? publishedTopics(index);

  if (coverage === undefined) {
    return [
      `${name}: registry entry declares no featureCoverage for its ${features.length} features`,
    ];
  }

  for (const feature of features) {
    if (!(feature in coverage)) {
      errors.push(`${name}: feature ${feature} has no documentation coverage declaration`);
    }
  }
  for (const declared of Object.keys(coverage)) {
    if (!features.includes(declared)) {
      errors.push(`${name}: featureCoverage declares ${declared}, which is not a declared feature`);
    }
  }

  for (const [feature, rawRule] of Object.entries(coverage)) {
    if (!isObject(rawRule)) {
      errors.push(`${name}: coverage for ${feature} must be an object`);
      continue;
    }
    const rule = /** @type {Record<string, unknown>} */ (rawRule);
    const mode = rule['mode'];
    if (typeof mode !== 'string' || !COVERAGE_MODES.includes(mode)) {
      errors.push(`${name}: coverage for ${feature} has an ungoverned mode ${String(mode)}`);
      continue;
    }

    if (DOCUMENTED_MODES.has(mode)) {
      const anchor = rule['anchor'];
      if (typeof anchor !== 'string' || anchor.length === 0) {
        errors.push(`${name}: ${mode} coverage for ${feature} must name a documentation topic`);
      } else if (!topics.has(anchor)) {
        errors.push(
          `${name}: feature ${feature} points at topic ${anchor}, which the component does not publish`,
        );
      }
    }

    if (mode === 'preview') {
      const values = rule['values'];
      if (values !== undefined) {
        if (!Array.isArray(values) || values.length === 0) {
          errors.push(`${name}: enumerated coverage for ${feature} must list its values`);
          continue;
        }
        const attribute = rule['attribute'];
        if (typeof attribute !== 'string' || !attribute.startsWith('data-')) {
          errors.push(
            `${name}: enumerated coverage for ${feature} must name the data attribute that reflects it`,
          );
        }
        // Every value of an enumerated feature needs its own preview. Showing one appearance is
        // not showing the appearance scale. The value must appear as an explicit prop assignment —
        // `radius="sm"` — so that naming it in prose or in the API table cannot satisfy the rule,
        // and so the preview doubles as copy-pasteable source.
        const property =
          typeof attribute === 'string' ? attribute.replace(/^data-/u, '') : String(feature);
        for (const value of values) {
          if (!rendered.includes(`${property}="${String(value)}"`)) {
            errors.push(
              `${name}: ${feature} value ${String(value)} is never previewed in the documentation`,
            );
          }
        }
      }
    }

    if (mode === 'fixture') {
      const evidence = rule['evidence'];
      if (typeof evidence !== 'string' || !sourceExists(evidence)) {
        errors.push(
          `${name}: fixture coverage for ${feature} must name an existing browser or visual evidence file`,
        );
      }
    }
  }

  return errors;
};

/**
 * Validates a component's published topics against the governed topic model.
 *
 * @param {string} name component name, used only in messages
 * @param {ReadonlySet<string>} published
 * @param {readonly {id: string, required: boolean}[]} model
 * @returns {string[]} human-readable errors
 */
export const validatePublishedTopics = (name, published, model) => {
  const errors = [];
  const known = new Set(model.map((topic) => topic.id));
  for (const topic of published) {
    if (!known.has(topic)) {
      errors.push(`${name}: publishes topic ${topic}, which is not in the governed topic model`);
    }
  }
  for (const topic of model) {
    if (topic.required && !published.has(topic.id)) {
      errors.push(`${name}: does not publish the required topic ${topic.id}`);
    }
  }
  return errors;
};

/**
 * Validates one `pendingCoverage` entry. A component documented before this contract existed may
 * wait for its own governed revalidation, but only as a named, owned, explained debt.
 *
 * @param {unknown} entry
 * @returns {string[]} human-readable errors
 */
export const validatePendingCoverage = (entry) => {
  const errors = [];
  if (!isObject(entry)) return ['pending coverage entries must be objects'];
  const record = /** @type {Record<string, unknown>} */ (entry);
  const name = typeof record['slug'] === 'string' ? record['slug'] : 'unnamed entry';
  for (const field of ['component', 'slug', 'stage', 'reason', 'requiredBy']) {
    if (typeof record[field] !== 'string' || record[field] === '') {
      errors.push(`pending coverage ${name} is missing ${field}`);
    }
  }
  const stage = record['stage'];
  if (typeof stage === 'string' && !STAGE_REFERENCE.test(stage)) {
    errors.push(`pending coverage ${name} does not name a stage identifier`);
  }
  const reason = record['reason'];
  if (typeof reason === 'string' && reason.length < MINIMUM_PENDING_REASON_CHARACTERS) {
    errors.push(`pending coverage ${name} does not explain why it is still pending`);
  }
  return errors;
};
