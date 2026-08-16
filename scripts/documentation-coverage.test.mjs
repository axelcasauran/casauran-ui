import assert from 'node:assert/strict';
import test from 'node:test';

import {
  publishedTopics,
  validateFeatureCoverage,
  validatePendingCoverage,
  validatePublishedTopics,
} from './documentation-coverage.mjs';

const index = [
  'export const buttonTopics: ComponentTopics = {',
  '  overview: {',
  '    summary: '.concat("'Lead paragraph.',"),
  '    content: <p>prose</p>,',
  '  },',
  '  appearance: {',
  '    summary: '.concat("'Five treatments.',"),
  '    content: <AppearancesExample />,',
  '  },',
  "  'controlled-state': {",
  '    summary: '.concat("'State ownership.',"),
  '    content: <p>prose</p>,',
  '  },',
  '};',
].join('\n');

const examples = [
  '<Button appearance="solid">Solid</Button>',
  '<Button appearance="outline">Outline</Button>',
].join('\n');

const content = { index, examples };

const entry = (coverage, features = ['appearance']) => ({
  name: 'Button',
  features,
  featureCoverage: coverage,
});

const appearanceRule = {
  mode: 'preview',
  anchor: 'appearance',
  attribute: 'data-appearance',
  values: ['solid', 'outline'],
};

test('reads the topics a content module publishes, including quoted keys', () => {
  assert.deepEqual([...publishedTopics(index)].sort(), [
    'appearance',
    'controlled-state',
    'overview',
  ]);
});

test('accepts a complete coverage declaration', () => {
  assert.deepEqual(validateFeatureCoverage(entry({ appearance: appearanceRule }), content), []);
});

test('rejects a component with no coverage declaration at all', () => {
  const errors = validateFeatureCoverage({ name: 'Button', features: ['appearance'] }, content);
  assert.equal(errors.length, 1);
  assert.match(errors[0] ?? '', /declares no featureCoverage/u);
});

test('rejects a declared feature with no coverage entry', () => {
  const errors = validateFeatureCoverage(
    entry({ appearance: appearanceRule }, ['appearance', 'size']),
    content,
  );
  assert.ok(errors.some((error) => /feature size has no documentation coverage/u.test(error)));
});

test('rejects coverage for a feature the component does not declare', () => {
  const errors = validateFeatureCoverage(
    entry({ appearance: appearanceRule, radius: { mode: 'section', anchor: 'overview' } }),
    content,
  );
  assert.ok(errors.some((error) => /which is not a declared feature/u.test(error)));
});

test('rejects an ungoverned coverage mode', () => {
  const errors = validateFeatureCoverage(entry({ appearance: { mode: 'mentioned' } }), content);
  assert.ok(errors.some((error) => /ungoverned mode mentioned/u.test(error)));
});

test('rejects an anchor naming a topic the component does not publish', () => {
  const errors = validateFeatureCoverage(
    entry({ appearance: { ...appearanceRule, anchor: 'events' } }),
    content,
  );
  assert.ok(
    errors.some((error) =>
      /points at topic events, which the component does not publish/u.test(error),
    ),
  );
});

test('rejects an enumerated value that is never previewed', () => {
  const errors = validateFeatureCoverage(
    entry({ appearance: { ...appearanceRule, values: ['solid', 'outline', 'ghost'] } }),
    content,
  );
  assert.ok(
    errors.some((error) => /appearance value ghost is never previewed/u.test(error)),
    'a value present in the type but absent from the documentation must fail',
  );
});

test('rejects an enumerated feature with no reflecting data attribute', () => {
  const errors = validateFeatureCoverage(
    entry({ appearance: { mode: 'preview', anchor: 'appearance', values: ['solid'] } }),
    content,
  );
  assert.ok(errors.some((error) => /must name the data attribute/u.test(error)));
});

test('rejects an empty enumerated value list', () => {
  const errors = validateFeatureCoverage(
    entry({ appearance: { ...appearanceRule, values: [] } }),
    content,
  );
  assert.ok(errors.some((error) => /must list its values/u.test(error)));
});

test('accepts section coverage for behaviour with nothing to render', () => {
  assert.deepEqual(
    validateFeatureCoverage(
      entry({ appearance: { mode: 'section', anchor: 'overview' } }),
      content,
    ),
    [],
  );
});

test('rejects fixture coverage without existing evidence', () => {
  const rule = { mode: 'fixture', evidence: 'tests/browser/missing.spec.ts' };
  const errors = validateFeatureCoverage(entry({ appearance: rule }), content, () => false);
  assert.ok(
    errors.some((error) => /must name an existing browser or visual evidence/u.test(error)),
  );
  assert.deepEqual(
    validateFeatureCoverage(entry({ appearance: rule }), content, () => true),
    [],
  );
});

test('rejects a topic outside the governed model and a missing required topic', () => {
  const model = [
    { id: 'overview', required: true },
    { id: 'api', required: true },
    { id: 'appearance', required: false },
  ];
  const errors = validatePublishedTopics('Button', new Set(['overview', 'invented']), model);
  assert.ok(errors.some((error) => /publishes topic invented/u.test(error)));
  assert.ok(errors.some((error) => /does not publish the required topic api/u.test(error)));
  assert.deepEqual(
    validatePublishedTopics('Button', new Set(['overview', 'api', 'appearance']), model),
    [],
  );
});

test('rejects a pending coverage entry that is unnamed, unowned, or unexplained', () => {
  assert.ok(validatePendingCoverage({}).length >= 5);
  assert.ok(
    validatePendingCoverage({
      component: 'Icon',
      slug: 'icon',
      stage: 'soon',
      reason: 'Documented before ADR-023 required a coverage declaration for every feature it has.',
      requiredBy: 'a governed 1.02 revalidation',
    }).some((error) => /does not name a stage identifier/u.test(error)),
  );
  assert.ok(
    validatePendingCoverage({
      component: 'Icon',
      slug: 'icon',
      stage: '1.02',
      reason: 'legacy',
      requiredBy: 'a governed 1.02 revalidation',
    }).some((error) => /does not explain why it is still pending/u.test(error)),
  );
});

test('accepts a fully described pending coverage entry', () => {
  assert.deepEqual(
    validatePendingCoverage({
      component: 'Icon',
      slug: 'icon',
      stage: '1.02',
      reason: 'Icon was documented before ADR-023 bound every declared feature to a preview.',
      requiredBy: 'a governed 1.02 revalidation that documents its size, tone and flip scales',
    }),
    [],
  );
});
