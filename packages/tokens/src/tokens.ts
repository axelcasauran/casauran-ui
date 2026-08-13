import { primitiveTokens, semanticTokens, type TokenName } from './generated.js';
import type {
  PrimitiveTokenDefinition,
  SemanticTokenDefinition,
  TokenCssVariable,
  TokenDefinition,
  TokenValue,
} from './types.js';

const primitivesByName: ReadonlyMap<string, PrimitiveTokenDefinition> = new Map(
  primitiveTokens.map((token) => [token.name, token]),
);
const semanticsByName: ReadonlyMap<string, SemanticTokenDefinition> = new Map(
  semanticTokens.map((token) => [token.name, token]),
);

function unknownToken(name: string): RangeError {
  return new RangeError(`CSN-TOKEN-001: Unknown token "${name}".`);
}

export function getTokenDefinition(name: TokenName): TokenDefinition {
  const definition = primitivesByName.get(name) ?? semanticsByName.get(name);
  if (definition === undefined) {
    throw unknownToken(name);
  }
  return definition;
}

export function resolveTokenValue(name: TokenName): TokenValue {
  const definition = getTokenDefinition(name);
  if ('value' in definition) {
    return definition.value;
  }

  const primitive = primitivesByName.get(definition.reference);
  if (primitive === undefined) {
    throw new Error(
      `CSN-TOKEN-002: Semantic token "${name}" has an unresolved primitive reference.`,
    );
  }
  return primitive.value;
}

export function getTokenCssVariable(name: TokenName): TokenCssVariable {
  return getTokenDefinition(name).cssVariable;
}

export function tokenVariable(name: TokenName): `var(${TokenCssVariable})` {
  return `var(${getTokenCssVariable(name)})`;
}
