import assert from 'node:assert/strict';
import test from 'node:test';

import { contrastRatio, renderThemeCss, validateThemeContract } from './theme-contract.mjs';

const semantics = [
  ...[
    'surface.canvas',
    'surface.subtle',
    'surface.raised',
    'surface.inverse',
    'text.primary',
    'text.secondary',
    'text.muted',
    'text.inverse',
    'border.default',
    'border.strong',
    'interactive.primary',
    'interactive.primary-hover',
    'interactive.primary-active',
    'interactive.on-primary',
    'interactive.secondary',
    'interactive.secondary-hover',
    'focus.ring',
    'status.danger',
    'status.danger-surface',
    'status.success',
    'status.success-surface',
    'status.warning',
    'status.warning-surface',
  ].map((name) => ({ name, type: 'color', cssVariable: `--csn-${name.replaceAll('.', '-')}` })),
  ...['elevation.surface', 'elevation.overlay'].map((name) => ({
    name,
    type: 'shadow',
    cssVariable: `--csn-${name.replaceAll('.', '-')}`,
  })),
  ...['density.scale'].map((name) => ({
    name,
    type: 'number',
    cssVariable: `--csn-${name.replaceAll('.', '-')}`,
  })),
  ...['spacing.control-inline', 'spacing.control-block', 'spacing.content-gap'].map((name) => ({
    name,
    type: 'dimension',
    cssVariable: `--csn-${name.replaceAll('.', '-')}`,
  })),
  ...['motion.duration-fast', 'motion.duration-standard', 'motion.duration-slow'].map((name) => ({
    name,
    type: 'duration',
    cssVariable: `--csn-${name.replaceAll('.', '-')}`,
  })),
];
const themed = Object.fromEntries(
  semantics
    .filter((token) => token.type === 'color' || token.type === 'shadow')
    .map((token) => [token.name, token.type === 'color' ? '#000000' : 'none']),
);
Object.assign(themed, {
  'surface.canvas': '#ffffff',
  'surface.subtle': '#ffffff',
  'surface.raised': '#ffffff',
  'surface.inverse': '#000000',
  'text.inverse': '#ffffff',
  'interactive.primary': '#000000',
  'interactive.on-primary': '#ffffff',
  'status.danger-surface': '#ffffff',
  'status.success-surface': '#ffffff',
  'status.warning-surface': '#ffffff',
});
const density = {
  'density.scale': 1,
  'spacing.control-inline': '1rem',
  'spacing.control-block': '1rem',
  'spacing.content-gap': '1rem',
};
const forcedColors = Object.fromEntries(
  semantics
    .filter((token) => token.type === 'color' || token.type === 'shadow')
    .map((token) => [token.name, token.type === 'color' ? 'CanvasText' : 'none']),
);
const fixture = {
  $schema: '../schemas/theme-contract.schema.json',
  schemaVersion: 1,
  package: '@casauran/theme',
  attributes: { theme: 'data-theme', density: 'data-density' },
  cascadeLayers: ['reset', 'tokens', 'base', 'components', 'utilities', 'overrides'],
  themes: [
    { name: 'light', colorScheme: 'light', assignments: { ...themed } },
    { name: 'dark', colorScheme: 'dark', assignments: { ...themed } },
  ],
  densities: [
    { name: 'comfortable', assignments: { ...density } },
    { name: 'compact', assignments: { ...density } },
  ],
  motion: {
    'motion.duration-fast': '0ms',
    'motion.duration-standard': '0ms',
    'motion.duration-slow': '0ms',
  },
  forcedColors,
};
const tokens = {
  primitives: [{ name: 'color.black', cssVariable: '--csn-ref-color-black', value: '#000000' }],
  semantics,
  components: [],
};

test('accepts complete light, dark, density, and adaptive contracts', () => {
  assert.deepEqual(validateThemeContract(fixture, tokens), []);
});

test('rejects incomplete theme and density assignments', () => {
  const contract = structuredClone(fixture);
  delete contract.themes[0].assignments['text.primary'];
  delete contract.densities[1].assignments['density.scale'];
  const errors = validateThemeContract(contract, tokens);
  assert.ok(errors.some((error) => error.includes('light theme assignments')));
  assert.ok(errors.some((error) => error.includes('compact density assignments')));
});

test('rejects contrast below the WCAG AA normal-text threshold', () => {
  const contract = structuredClone(fixture);
  contract.themes[0].assignments['text.primary'] = '#777777';
  contract.themes[0].assignments['surface.canvas'] = '#ffffff';
  assert.ok(
    validateThemeContract(contract, tokens).some((error) => error.includes('does not meet 4.5:1')),
  );
  assert.ok(contrastRatio('#777777', '#ffffff') < 4.5);
});

test('rejects cascade order and selector identity drift', () => {
  const contract = structuredClone(fixture);
  contract.cascadeLayers.reverse();
  contract.attributes.theme = 'class';
  const errors = validateThemeContract(contract, tokens);
  assert.ok(errors.some((error) => error.includes('cascade layers')));
  assert.ok(errors.some((error) => error.includes('runtime attributes')));
});

test('rejects nonzero reduced-motion durations', () => {
  const contract = structuredClone(fixture);
  contract.motion['motion.duration-fast'] = '1ms';
  assert.ok(validateThemeContract(contract, tokens).some((error) => error.includes('must be 0ms')));
});

test('rejects malformed theme, density, and forced-color values', () => {
  const contract = structuredClone(fixture);
  contract.themes[0].assignments['text.primary'] = 'red';
  contract.densities[0].assignments['spacing.content-gap'] = '-1px';
  contract.forcedColors['focus.ring'] = '#000000';
  const errors = validateThemeContract(contract, tokens);
  assert.ok(errors.some((error) => error.includes('six-digit lowercase hex color')));
  assert.ok(errors.some((error) => error.includes('invalid density value')));
  assert.ok(errors.some((error) => error.includes('approved system color')));
});

test('renders deterministic layered CSS with adaptive media queries', () => {
  const tokenContract = structuredClone(tokens);
  tokenContract.components.push({
    name: 'button.background',
    reference: 'surface.canvas',
    cssVariable: '--csn-button-background',
  });
  const first = renderThemeCss(fixture, tokenContract);
  assert.equal(first, renderThemeCss(fixture, tokenContract));
  assert.match(first, /@layer reset, tokens, base, components, utilities, overrides;/u);
  assert.match(first, /prefers-reduced-motion: reduce/u);
  assert.match(first, /forced-colors: active/u);
  assert.match(first, /--csn-button-background: var\(--csn-surface-canvas\)/u);
  assert.match(first, /:where\(:root, \[data-theme\], \[data-density\]\)/u);
});
