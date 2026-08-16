const REQUIRED_LAYERS = ['primitive', 'semantic', 'component', 'theme'];
const REQUIRED_TOKEN_TYPES = [
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
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const sameOrderedMembers = (actual, expected) =>
  actual.length === expected.length && expected.every((value, index) => actual[index] === value);
const expectedVariable = (layer, name) =>
  `--csn-${layer === 'primitive' ? 'ref-' : ''}${name.replaceAll('.', '-')}`;

const validatePrimitiveValue = (token) => {
  const { type, value } = token;
  if (type === 'color') return typeof value === 'string' && /^#[0-9a-f]{6}$/u.test(value);
  if (type === 'dimension' || type === 'font-size') {
    return typeof value === 'string' && /^(?:0|\d+(?:\.\d+)?(?:px|rem|em|%))$/u.test(value);
  }
  if (type === 'font-family') return typeof value === 'string' && value.length > 0;
  if (type === 'font-weight') return Number.isInteger(value) && value >= 1 && value <= 1000;
  if (type === 'line-height' || type === 'number') {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
  }
  if (type === 'shadow') return typeof value === 'string' && value.length > 0;
  if (type === 'duration') return typeof value === 'string' && /^\d+(?:\.\d+)?ms$/u.test(value);
  if (type === 'easing') {
    return typeof value === 'string' && /^cubic-bezier\([\d., -]+\)$/u.test(value);
  }
  if (type === 'z-index') return Number.isInteger(value);
  return false;
};

// A hyphen is deliberately absent: it is not a metacharacter outside a character class, and `u`
// mode rejects `\-` there as an invalid escape.
const escapeRegExp = (value) => value.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);

/**
 * Last-resort slug derivation, used only when no registry resolver is supplied.
 *
 * The derivation cannot express an acronym boundary: `SVGIcon` becomes `svgicon` and `PDFViewer`
 * becomes `pdfviewer`, neither of which is the slug those components declare. `registry/components`
 * is the source of truth for a slug, so the real gate passes a resolver backed by it and this
 * derivation exists only to keep the contract module free of filesystem access.
 */
const componentSlug = (name) =>
  name
    .replaceAll(/([a-z0-9])([A-Z])/gu, '$1-$2')
    .replaceAll(/[^A-Za-z0-9]+/gu, '-')
    .replaceAll(/^-|-$/gu, '')
    .toLowerCase();

const COMPONENT_TOKEN_STATUSES = new Set([
  'api-approved',
  'implemented',
  'tested',
  'documented',
  'parity-verified',
  'improved',
]);

export const validateTokenContract = (
  contract,
  sourceExists = () => true,
  componentStatus = () => 'api-approved',
  componentSlugByName = componentSlug,
) => {
  const errors = [];
  if (!isObject(contract)) return ['token contract must be an object'];
  if (contract.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (contract.$schema !== '../schemas/token-contract.schema.json') {
    errors.push('$schema must identify the token contract schema');
  }
  if (!sourceExists('registry/schemas/token-contract.schema.json')) {
    errors.push('token contract schema does not exist');
  }
  if (contract.package !== '@casauran/tokens')
    errors.push('token package must be @casauran/tokens');
  if (contract.cssNamespace !== 'csn') errors.push('token CSS namespace must be csn');
  if (!sameOrderedMembers(contract.layers ?? [], REQUIRED_LAYERS)) {
    errors.push('token layers must be primitive, semantic, component and theme');
  }
  if (!sameOrderedMembers(contract.tokenTypes ?? [], REQUIRED_TOKEN_TYPES)) {
    errors.push('token types do not cover the required foundation dimensions');
  }

  const primitives = Array.isArray(contract.primitives) ? contract.primitives : [];
  const semantics = Array.isArray(contract.semantics) ? contract.semantics : [];
  const components = Array.isArray(contract.components) ? contract.components : [];
  if (primitives.length < 60) errors.push('foundation requires at least 60 primitive tokens');
  if (semantics.length < 50) errors.push('foundation requires at least 50 semantic tokens');

  const primitiveNames = primitives.map((token) => token.name);
  const semanticNames = semantics.map((token) => token.name);
  const componentNames = components.map((token) => token.name);
  const allNames = [...primitiveNames, ...semanticNames, ...componentNames];
  const allVariables = [...primitives, ...semantics, ...components].map(
    (token) => token.cssVariable,
  );
  for (const name of duplicates(allNames)) errors.push(`duplicate token name ${name}`);
  for (const variable of duplicates(allVariables))
    errors.push(`duplicate token CSS variable ${variable}`);

  const primitiveByName = new Map(primitives.map((token) => [token.name, token]));
  for (const token of primitives) {
    if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u.test(token.name ?? '')) {
      errors.push(`invalid primitive token name ${token.name}`);
    }
    if (!REQUIRED_TOKEN_TYPES.includes(token.type)) {
      errors.push(`${token.name} has unknown token type ${token.type}`);
    }
    if (token.cssVariable !== expectedVariable('primitive', token.name)) {
      errors.push(`${token.name} has invalid primitive CSS variable ${token.cssVariable}`);
    }
    if (typeof token.description !== 'string' || token.description.length === 0) {
      errors.push(`${token.name} must define a description`);
    }
    if (!validatePrimitiveValue(token)) {
      errors.push(`${token.name} has invalid ${token.type} value ${String(token.value)}`);
    }
  }

  for (const token of semantics) {
    if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u.test(token.name ?? '')) {
      errors.push(`invalid semantic token name ${token.name}`);
    }
    if (token.cssVariable !== expectedVariable('semantic', token.name)) {
      errors.push(`${token.name} has invalid semantic CSS variable ${token.cssVariable}`);
    }
    if (typeof token.description !== 'string' || token.description.length === 0) {
      errors.push(`${token.name} must define a description`);
    }
    const primitive = primitiveByName.get(token.reference);
    if (!primitive) {
      errors.push(`${token.name} references unknown primitive ${token.reference}`);
    } else if (primitive.type !== token.type) {
      errors.push(
        `${token.name} type ${token.type} does not match ${token.reference} type ${primitive.type}`,
      );
    }
  }

  const referencesByName = new Map(
    [...primitives, ...semantics].map((token) => [token.name, token]),
  );
  for (const token of components) {
    const slug = componentSlugByName(token.component ?? '') ?? '';
    if (slug.length === 0 || !sourceExists(`registry/components/${slug}.json`)) {
      errors.push(`${token.name} references unknown component ${String(token.component)}`);
    } else if (!COMPONENT_TOKEN_STATUSES.has(componentStatus(slug))) {
      errors.push(`${token.name} cannot precede the ${token.component} API approval gate`);
    }
    // A `u`-mode regex rejects `\-` as an invalid escape, so the slug is escaped with the standard
    // metacharacter set rather than by hand. Before this, any slug containing a hyphen — the first
    // being `svg-icon` — threw instead of validating.
    if (
      !new RegExp(`^${escapeRegExp(slug)}\\.[a-z0-9]+(?:[.-][a-z0-9]+)*$`, 'u').test(
        token.name ?? '',
      )
    ) {
      errors.push(`invalid component token name ${token.name}`);
    }
    if (token.cssVariable !== expectedVariable('component', token.name)) {
      errors.push(`${token.name} has invalid component CSS variable ${token.cssVariable}`);
    }
    if (typeof token.description !== 'string' || token.description.length === 0) {
      errors.push(`${token.name} must define a description`);
    }
    const reference = referencesByName.get(token.reference);
    if (!reference) {
      errors.push(`${token.name} references unknown foundation token ${token.reference}`);
    } else if (reference.type !== token.type) {
      errors.push(
        `${token.name} type ${token.type} does not match ${token.reference} type ${reference.type}`,
      );
    }
  }

  return errors;
};

export const renderTokenModule = (contract) => {
  const cssVariables = Object.fromEntries(
    [...contract.primitives, ...contract.semantics, ...contract.components].map((token) => [
      token.name,
      token.cssVariable,
    ]),
  );
  const semanticReferences = Object.fromEntries(
    contract.semantics.map((token) => [token.name, token.reference]),
  );
  return `/* This file is generated by scripts/generate-token-module.mjs. */
import type { ComponentTokenDefinition, PrimitiveTokenDefinition, SemanticTokenDefinition } ${'from'} './types.js';

export const tokenContractVersion = ${contract.schemaVersion} as const;
export const primitiveTokens = ${JSON.stringify(contract.primitives, null, 2)} as const satisfies readonly PrimitiveTokenDefinition[];
export const semanticTokens = ${JSON.stringify(contract.semantics, null, 2)} as const satisfies readonly SemanticTokenDefinition[];
export const componentTokens = ${JSON.stringify(contract.components, null, 2)} as const satisfies readonly ComponentTokenDefinition[];
export const tokenCssVariables = ${JSON.stringify(cssVariables, null, 2)} as const;
export const semanticTokenReferences = ${JSON.stringify(semanticReferences, null, 2)} as const;

export type PrimitiveTokenName = (typeof primitiveTokens)[number]['name'];
export type SemanticTokenName = (typeof semanticTokens)[number]['name'];
export type ComponentTokenName = (typeof componentTokens)[number]['name'];
export type TokenName = PrimitiveTokenName | SemanticTokenName | ComponentTokenName;
`;
};
