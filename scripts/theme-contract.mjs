const REQUIRED_LAYERS = ['reset', 'tokens', 'base', 'components', 'utilities', 'overrides'];
const REQUIRED_THEMES = ['light', 'dark'];
const REQUIRED_DENSITIES = ['comfortable', 'compact'];
const COLOR_CONTRAST_PAIRS = [
  ['text.primary', 'surface.canvas'],
  ['text.secondary', 'surface.canvas'],
  ['text.muted', 'surface.canvas'],
  ['text.inverse', 'surface.inverse'],
  ['interactive.on-primary', 'interactive.primary'],
  ['status.danger', 'status.danger-surface'],
  ['status.success', 'status.success-surface'],
  ['status.warning', 'status.warning-surface'],
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const sameMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value) => actual.includes(value));
const cssName = (name) => `--csn-${name.replaceAll('.', '-')}`;
const SYSTEM_COLORS = new Set(['Canvas', 'CanvasText', 'GrayText', 'Highlight', 'HighlightText']);
const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/u.test(value);
const isDimension = (value) =>
  typeof value === 'string' && /^(?:0|\d+(?:\.\d+)?(?:px|rem|em|%))$/u.test(value);

const linearChannel = (hexPair) => {
  const channel = Number.parseInt(hexPair, 16) / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};

const luminance = (color) =>
  0.2126 * linearChannel(color.slice(1, 3)) +
  0.7152 * linearChannel(color.slice(3, 5)) +
  0.0722 * linearChannel(color.slice(5, 7));

export const contrastRatio = (foreground, background) => {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

const assignmentLines = (assignments, semanticByName) =>
  Object.entries(assignments)
    .map(([name, value]) => `    ${semanticByName.get(name).cssVariable}: ${String(value)};`)
    .join('\n');

export const validateThemeContract = (contract, tokenContract, sourceExists = () => true) => {
  const errors = [];
  if (!isObject(contract)) return ['theme contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/theme-contract.schema.json') {
    errors.push('$schema must identify the theme contract schema');
  }
  if (!sourceExists('registry/schemas/theme-contract.schema.json')) {
    errors.push('theme contract schema does not exist');
  }
  if (contract.package !== '@casauran/theme') errors.push('theme package must be @casauran/theme');
  if (
    contract.attributes?.theme !== 'data-theme' ||
    contract.attributes?.density !== 'data-density'
  ) {
    errors.push('theme runtime attributes must be data-theme and data-density');
  }
  if (!sameOrderedMembers(contract.cascadeLayers ?? [], REQUIRED_LAYERS)) {
    errors.push(
      'cascade layers must preserve reset, tokens, base, components, utilities, overrides',
    );
  }

  const semantics = Array.isArray(tokenContract?.semantics) ? tokenContract.semantics : [];
  const semanticByName = new Map(semantics.map((token) => [token.name, token]));
  const themes = Array.isArray(contract.themes) ? contract.themes : [];
  const densities = Array.isArray(contract.densities) ? contract.densities : [];
  const themeNames = themes.map((theme) => theme.name);
  const densityNames = densities.map((density) => density.name);
  if (!sameOrderedMembers(themeNames, REQUIRED_THEMES)) {
    errors.push('theme inventory must be light then dark');
  }
  if (!sameOrderedMembers(densityNames, REQUIRED_DENSITIES)) {
    errors.push('density inventory must be comfortable then compact');
  }
  for (const name of duplicates(themeNames)) errors.push(`duplicate theme ${name}`);
  for (const name of duplicates(densityNames)) errors.push(`duplicate density ${name}`);

  const themedNames = semantics
    .filter((token) => token.type === 'color' || token.type === 'shadow')
    .map((token) => token.name);
  const densityTokenNames = [
    'density.scale',
    'spacing.control-inline',
    'spacing.control-block',
    'spacing.content-gap',
  ];
  const motionTokenNames = [
    'motion.duration-fast',
    'motion.duration-standard',
    'motion.duration-slow',
  ];

  const validateAssignments = (label, assignments, expectedNames) => {
    if (!isObject(assignments)) {
      errors.push(`${label} assignments must be an object`);
      return;
    }
    const names = Object.keys(assignments);
    if (!sameMembers(names, expectedNames))
      errors.push(`${label} assignments are incomplete or excessive`);
    for (const name of names) {
      if (!semanticByName.has(name)) errors.push(`${label} assigns unknown semantic token ${name}`);
    }
  };

  for (const theme of themes) {
    if (theme.colorScheme !== theme.name)
      errors.push(`${theme.name} colorScheme must match its name`);
    validateAssignments(`${theme.name} theme`, theme.assignments, themedNames);
    for (const [name, value] of Object.entries(theme.assignments ?? {})) {
      const token = semanticByName.get(name);
      if (token?.type === 'color' && !isHexColor(value)) {
        errors.push(`${theme.name} ${name} must be a six-digit lowercase hex color`);
      }
      if (token?.type === 'shadow' && (typeof value !== 'string' || value.length === 0)) {
        errors.push(`${theme.name} ${name} must be a non-empty shadow value`);
      }
    }
    for (const [foreground, background] of COLOR_CONTRAST_PAIRS) {
      const foregroundValue = theme.assignments?.[foreground];
      const backgroundValue = theme.assignments?.[background];
      if (
        typeof foregroundValue === 'string' &&
        typeof backgroundValue === 'string' &&
        /^#[0-9a-f]{6}$/u.test(foregroundValue) &&
        /^#[0-9a-f]{6}$/u.test(backgroundValue) &&
        contrastRatio(foregroundValue, backgroundValue) < 4.5
      ) {
        errors.push(`${theme.name} ${foreground} on ${background} does not meet 4.5:1 contrast`);
      }
    }
  }
  for (const density of densities) {
    validateAssignments(`${density.name} density`, density.assignments, densityTokenNames);
    for (const [name, value] of Object.entries(density.assignments ?? {})) {
      const valid =
        name === 'density.scale'
          ? typeof value === 'number' && Number.isFinite(value) && value > 0
          : isDimension(value);
      if (!valid) errors.push(`${density.name} ${name} has an invalid density value`);
    }
  }
  validateAssignments('reduced motion', contract.motion, motionTokenNames);
  if (Object.values(contract.motion ?? {}).some((value) => value !== '0ms')) {
    errors.push('reduced-motion duration assignments must be 0ms');
  }
  validateAssignments('forced colors', contract.forcedColors, themedNames);
  for (const [name, value] of Object.entries(contract.forcedColors ?? {})) {
    const token = semanticByName.get(name);
    if (token?.type === 'color' && !SYSTEM_COLORS.has(value)) {
      errors.push(`forced colors ${name} must use an approved system color`);
    }
    if (token?.type === 'shadow' && value !== 'none') {
      errors.push(`forced colors ${name} must remove decorative elevation`);
    }
  }
  if (tokenContract?.components?.length !== 0) {
    errors.push('F0.06 must not add component token assignments');
  }
  return errors;
};

export const renderThemeCss = (contract, tokenContract) => {
  const semanticByName = new Map(tokenContract.semantics.map((token) => [token.name, token]));
  const primitiveLines = tokenContract.primitives
    .map((token) => `    ${token.cssVariable}: ${String(token.value)};`)
    .join('\n');
  const semanticLines = tokenContract.semantics
    .map((token) => `    ${token.cssVariable}: var(${cssName(`ref-${token.reference}`)});`)
    .join('\n');
  const themeBlocks = contract.themes
    .map(
      (theme) => `  :where(:root[data-theme='${theme.name}'], [data-theme='${theme.name}']) {
    color-scheme: ${theme.colorScheme};
${assignmentLines(theme.assignments, semanticByName)}
  }`,
    )
    .join('\n\n');
  const densityBlocks = contract.densities
    .map(
      (
        density,
      ) => `  :where(:root[data-density='${density.name}'], [data-density='${density.name}']) {
${assignmentLines(density.assignments, semanticByName)}
  }`,
    )
    .join('\n\n');

  return `/* This file is generated by scripts/generate-theme-css.mjs. */
@layer ${contract.cascadeLayers.join(', ')};

@layer reset {
  :where(*, *::before, *::after) {
    box-sizing: border-box;
  }
}

@layer tokens {
  :where(:root) {
${primitiveLines}
${semanticLines}
    color-scheme: light;
  }

${themeBlocks}

${densityBlocks}
}

@layer base {
  :where(:root) {
    background-color: var(--csn-surface-canvas);
    color: var(--csn-text-primary);
    font-family: var(--csn-typography-body-family);
    font-size: var(--csn-typography-body-size);
    font-weight: var(--csn-typography-body-weight);
    line-height: var(--csn-typography-body-line-height);
  }

  :where(body) {
    margin: 0;
  }

  :where(:focus-visible) {
    outline: var(--csn-border-width-strong) solid var(--csn-focus-ring);
    outline-offset: var(--csn-ref-space-1);
  }
}

@media (prefers-reduced-motion: reduce) {
  @layer tokens {
    :where(:root, [data-theme], [data-density]) {
${assignmentLines(contract.motion, semanticByName)}
    }
  }
}

@media (forced-colors: active) {
  @layer tokens {
    :where(:root, [data-theme]) {
${assignmentLines(contract.forcedColors, semanticByName)}
    }
  }
}
`;
};
