import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseSpecificationHeader,
  validateFoundationSpecifications,
} from './foundation-specifications.mjs';

const specification = (stage, status, { closing = '## Stage boundary' } = {}) =>
  [
    '# Example Foundation Specification',
    '',
    `Stage: \`${stage}\``,
    `Status: ${status}`,
    '',
    '## Scope and ownership',
    '',
    'Owner package and excluded capabilities.',
    '',
    '## Contract one',
    '',
    'body',
    '',
    '## Contract two',
    '',
    'body',
    '',
    '## Contract three',
    '',
    'body',
    '',
    '## Accessibility and interaction requirements',
    '',
    'body',
    '',
    '## SSR, security, and performance',
    '',
    'body',
    '',
    '## Compatibility and integration',
    '',
    'body',
    '',
    closing,
    '',
    'The next owner is named here.',
    '',
    ...Array.from({ length: 12 }, (_, index) => `Filler line ${index}.`),
  ].join('\n');

const validFixture = () => {
  const contract = {
    $schema: 'foundation-specifications.schema.json',
    schemaVersion: 1,
    ownerRoles: ['maintainer', 'evidence-reviewer'],
    specificationRoot: 'specs/foundation',
    statusVocabulary: [
      { id: 'approved', stageStatuses: ['not-started', 'in-progress'] },
      { id: 'implemented', stageStatuses: ['complete'] },
    ],
    stages: [
      {
        stage: 'F0.01',
        title: 'Repository Governance',
        specification: null,
        exemptReason: 'governance contract stage',
      },
      { stage: 'F0.02', title: 'Tokens', specification: 'specs/foundation/tokens.md' },
      { stage: 'F0.03', title: 'Overlay', specification: 'specs/foundation/overlay.md' },
    ],
  };
  return {
    contract,
    context: {
      stages: [
        { id: 'F0.01', type: 'foundation', title: 'Repository Governance', status: 'complete' },
        { id: 'F0.02', type: 'foundation', title: 'Tokens', status: 'complete' },
        { id: 'F0.03', type: 'foundation', title: 'Overlay', status: 'not-started' },
        { id: '1.01', type: 'public-component', title: 'Button', status: 'complete' },
      ],
      specificationSources: {
        'specs/foundation/tokens.md': specification('F0.02', 'implemented'),
        'specs/foundation/overlay.md': specification('F0.03', 'approved'),
      },
      specificationFiles: ['specs/foundation/tokens.md', 'specs/foundation/overlay.md'],
      governanceRoles: ['maintainer', 'evidence-reviewer'],
    },
  };
};

test('accepts a complete foundation specification binding', () => {
  const { contract, context } = validFixture();
  assert.deepEqual(validateFoundationSpecifications(contract, context), []);
});

test('parses the governed specification header', () => {
  assert.deepEqual(parseSpecificationHeader('Stage: `F0.09`\nStatus: implemented\n'), {
    stage: 'F0.09',
    status: 'implemented',
  });
  assert.deepEqual(parseSpecificationHeader('Status: approved for F0.09 implementation'), {
    stage: null,
    status: null,
  });
});

test('rejects a specification status that contradicts its stage status', () => {
  const { contract, context } = validFixture();
  context.specificationSources['specs/foundation/tokens.md'] = specification('F0.02', 'approved');
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'specs/foundation/tokens.md status approved contradicts F0.02 stage status complete',
    ),
  );
});

test('rejects an ungoverned specification status vocabulary', () => {
  const { contract, context } = validFixture();
  context.specificationSources['specs/foundation/tokens.md'] = specification('F0.02', 'shipped');
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'specs/foundation/tokens.md uses ungoverned status shipped',
    ),
  );
});

test('rejects a specification whose declared stage disagrees with its binding', () => {
  const { contract, context } = validFixture();
  context.specificationSources['specs/foundation/tokens.md'] = specification(
    'F0.03',
    'implemented',
  );
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'specs/foundation/tokens.md declares F0.03 but is bound to F0.02',
    ),
  );
});

test('rejects a foundation stage with no specification binding', () => {
  const { contract, context } = validFixture();
  context.stages.push({
    id: 'F0.04',
    type: 'foundation',
    title: 'Data Engine',
    status: 'complete',
  });
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'foundation stage F0.04 has no specification binding',
    ),
  );
});

test('rejects an unbound specification file', () => {
  const { contract, context } = validFixture();
  context.specificationFiles.push('specs/foundation/orphan.md');
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'unbound foundation specification: specs/foundation/orphan.md',
    ),
  );
});

test('rejects an exempt stage with no recorded reason', () => {
  const { contract, context } = validFixture();
  delete contract.stages[0].exemptReason;
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'F0.01 must record why it owns no specification',
    ),
  );
});

test('rejects a self-referential stage boundary', () => {
  const { contract, context } = validFixture();
  context.specificationSources['specs/foundation/tokens.md'] = specification(
    'F0.02',
    'implemented',
    { closing: '## F0.02 boundary' },
  );
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'specs/foundation/tokens.md closes with a self-referential F0.02 boundary',
    ),
  );
});

test('rejects a boundary that names a stage outside the ledger', () => {
  const { contract, context } = validFixture();
  context.specificationSources['specs/foundation/tokens.md'] = specification(
    'F0.02',
    'implemented',
    { closing: '## F0.99 boundary' },
  );
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'specs/foundation/tokens.md boundary names unknown stage F0.99',
    ),
  );
});

test('rejects a specification without a closing boundary section', () => {
  const { contract, context } = validFixture();
  context.specificationSources['specs/foundation/tokens.md'] = specification(
    'F0.02',
    'implemented',
    { closing: '## Closing thoughts' },
  );
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'specs/foundation/tokens.md must close with an explicit stage boundary section',
    ),
  );
});

test('rejects a shallow specification', () => {
  const { contract, context } = validFixture();
  context.specificationSources['specs/foundation/tokens.md'] = [
    '# Thin',
    '',
    'Stage: `F0.02`',
    'Status: implemented',
    '',
    '## Scope and ownership',
    '',
    '## Stage boundary',
  ].join('\n');
  const errors = validateFoundationSpecifications(contract, context);
  assert.ok(errors.some((error) => error.includes('expected >= 40')));
  assert.ok(errors.some((error) => error.includes('expected >= 8')));
});

test('rejects a binding title that disagrees with the stage ledger', () => {
  const { contract, context } = validFixture();
  contract.stages[1].title = 'Design Tokens';
  assert.ok(
    validateFoundationSpecifications(contract, context).includes(
      'F0.02 specification binding title does not match the stage ledger',
    ),
  );
});
