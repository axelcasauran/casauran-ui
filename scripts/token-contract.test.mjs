import assert from 'node:assert/strict';
import test from 'node:test';
import { renderTokenModule, validateTokenContract } from './token-contract.mjs';

const validContract = () => ({
  $schema: '../schemas/token-contract.schema.json',
  schemaVersion: 1,
  package: '@casauran/tokens',
  cssNamespace: 'csn',
  layers: ['primitive', 'semantic', 'component', 'theme'],
  tokenTypes: [
    'color',
    'dimension',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'shadow',
    'duration',
    'easing',
    'number',
    'z-index',
  ],
  primitives: Array.from({ length: 60 }, (_, index) => ({
    name: `color.test.${index}`,
    type: 'color',
    value: '#112233',
    cssVariable: `--csn-ref-color-test-${index}`,
    description: `Primitive ${index}`,
  })),
  semantics: Array.from({ length: 50 }, (_, index) => ({
    name: `surface.test-${index}`,
    type: 'color',
    reference: `color.test.${index % 60}`,
    cssVariable: `--csn-surface-test-${index}`,
    description: `Semantic ${index}`,
  })),
  components: [],
});

test('accepts a complete primitive and semantic token contract', () => {
  assert.deepEqual(validateTokenContract(validContract()), []);
});

test('rejects unknown and type-incompatible semantic references', () => {
  const contract = validContract();
  contract.semantics[0].reference = 'color.missing';
  contract.semantics[1].type = 'dimension';
  const errors = validateTokenContract(contract);
  assert.ok(errors.includes('surface.test-0 references unknown primitive color.missing'));
  assert.ok(
    errors.includes('surface.test-1 type dimension does not match color.test.1 type color'),
  );
});

test('rejects duplicate names and CSS variables', () => {
  const contract = validContract();
  contract.semantics[0].name = contract.primitives[0].name;
  contract.semantics[1].cssVariable = contract.semantics[2].cssVariable;
  const errors = validateTokenContract(contract);
  assert.ok(errors.includes('duplicate token name color.test.0'));
  assert.ok(errors.includes('duplicate token CSS variable --csn-surface-test-2'));
});

test('rejects invalid primitive values and CSS namespace drift', () => {
  const contract = validContract();
  contract.primitives[0].value = 'red';
  contract.primitives[1].cssVariable = '--other-color';
  const errors = validateTokenContract(contract);
  assert.ok(errors.includes('color.test.0 has invalid color value red'));
  assert.ok(errors.includes('color.test.1 has invalid primitive CSS variable --other-color'));
});

test('accepts an owning component token after API approval', () => {
  const contract = validContract();
  contract.components.push({
    component: 'Button',
    name: 'button.background',
    type: 'color',
    reference: 'surface.test-0',
    cssVariable: '--csn-button-background',
    description: 'Button background.',
  });
  assert.deepEqual(validateTokenContract(contract), []);
});

test('rejects premature and invalid component tokens', () => {
  const contract = validContract();
  contract.components.push({
    component: 'Button',
    name: 'other.background',
    type: 'dimension',
    reference: 'surface.test-0',
    cssVariable: '--other-background',
    description: '',
  });
  const errors = validateTokenContract(
    contract,
    () => true,
    () => 'specified',
  );
  assert.ok(errors.some((error) => error.includes('API approval gate')));
  assert.ok(errors.some((error) => error.includes('invalid component token name')));
  assert.ok(errors.some((error) => error.includes('invalid component CSS variable')));
  assert.ok(errors.some((error) => error.includes('must define a description')));
  assert.ok(errors.some((error) => error.includes('does not match')));
});

test('renders deterministic typed token source', () => {
  const output = renderTokenModule(validContract());
  assert.ok(output.startsWith('/* This file is generated'));
  assert.ok(output.includes('export const tokenContractVersion = 1 as const;'));
  assert.ok(output.includes('ComponentTokenName'));
});

test('resolves a component slug through the supplied registry resolver', () => {
  // `SVGIcon` declares the slug `svg-icon`; deriving one from the name yields `svgicon`, so the
  // component token would be reported against a registry entry that does not exist.
  const contract = validContract();
  contract.components.push({
    component: 'SVGIcon',
    name: 'svg-icon.size',
    type: 'color',
    reference: 'surface.test-0',
    cssVariable: '--csn-svg-icon-size',
    description: 'SVGIcon box size.',
  });
  assert.deepEqual(
    validateTokenContract(
      contract,
      (path) =>
        path === 'registry/components/svg-icon.json' || path.startsWith('registry/schemas/'),
      () => 'api-approved',
      (name) => (name === 'SVGIcon' ? 'svg-icon' : ''),
    ),
    [],
  );
});

test('rejects a component token whose component the registry does not declare', () => {
  const contract = validContract();
  contract.components.push({
    component: 'Imaginary',
    name: 'imaginary.size',
    type: 'color',
    reference: 'surface.test-0',
    cssVariable: '--csn-imaginary-size',
    description: 'Imaginary box size.',
  });
  const errors = validateTokenContract(
    contract,
    () => true,
    () => 'api-approved',
    () => '',
  );
  assert.ok(errors.some((error) => error.includes('references unknown component Imaginary')));
});

test('falls back to name derivation when no registry resolver is supplied', () => {
  const contract = validContract();
  contract.components.push({
    component: 'Button',
    name: 'button.background',
    type: 'color',
    reference: 'surface.test-0',
    cssVariable: '--csn-button-background',
    description: 'Button background.',
  });
  assert.deepEqual(validateTokenContract(contract), []);
});
