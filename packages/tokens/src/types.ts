export type TokenType =
  | 'color'
  | 'dimension'
  | 'font-family'
  | 'font-size'
  | 'font-weight'
  | 'line-height'
  | 'shadow'
  | 'duration'
  | 'easing'
  | 'number'
  | 'z-index';

export type TokenValue = string | number;
export type TokenCssVariable = `--csn-${string}`;

export interface PrimitiveTokenDefinition {
  readonly name: string;
  readonly type: TokenType;
  readonly value: TokenValue;
  readonly cssVariable: TokenCssVariable;
  readonly description: string;
}

export interface SemanticTokenDefinition {
  readonly name: string;
  readonly type: TokenType;
  readonly reference: string;
  readonly cssVariable: TokenCssVariable;
  readonly description: string;
}

export type TokenDefinition = PrimitiveTokenDefinition | SemanticTokenDefinition;
