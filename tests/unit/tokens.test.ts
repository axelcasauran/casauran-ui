import { describe, expect, it } from 'vitest';

import {
  componentTokens,
  getTokenCssVariable,
  getTokenDefinition,
  primitiveTokens,
  resolveTokenValue,
  semanticTokens,
  tokenVariable,
  type TokenName,
} from '../../packages/tokens/src/index.js';

describe('@casauran/tokens', () => {
  it('publishes a complete, unique foundation and component vocabulary', () => {
    const tokens = [...primitiveTokens, ...semanticTokens, ...componentTokens];
    expect(primitiveTokens.length).toBeGreaterThanOrEqual(60);
    expect(semanticTokens.length).toBeGreaterThanOrEqual(50);
    expect(new Set(tokens.map((token) => token.name)).size).toBe(tokens.length);
    expect(new Set(tokens.map((token) => token.cssVariable)).size).toBe(tokens.length);
    expect(componentTokens.length).toBe(17);
    expect(new Set(componentTokens.map((token) => token.component))).toEqual(
      new Set(['Button', 'Icon']),
    );
  });

  it('resolves primitive and semantic values without browser state', () => {
    expect(resolveTokenValue('color.neutral.0')).toBe('#ffffff');
    expect(resolveTokenValue('surface.canvas')).toBe('#ffffff');
    expect(resolveTokenValue('button.background')).toBe('#f1f5f9');
    expect(getTokenDefinition('surface.canvas')).toMatchObject({
      reference: 'color.neutral.0',
      type: 'color',
    });
  });

  it('exposes stable CSS custom-property names without emitting CSS', () => {
    expect(getTokenCssVariable('surface.canvas')).toBe('--csn-surface-canvas');
    expect(tokenVariable('focus.ring')).toBe('var(--csn-focus-ring)');
    expect(tokenVariable('button.background')).toBe('var(--csn-button-background)');
  });

  it('fails predictably for unsupported runtime input', () => {
    expect(() => resolveTokenValue('missing.token' as TokenName)).toThrow('CSN-TOKEN-001');
  });

  it('keeps semantic references type-compatible and resolvable', () => {
    const primitives = new Map(primitiveTokens.map((token) => [token.name, token]));
    for (const semantic of semanticTokens) {
      const primitive = primitives.get(semantic.reference);
      expect(primitive, semantic.name).toBeDefined();
      expect(primitive?.type, semantic.name).toBe(semantic.type);
    }
  });

  it('keeps component references type-compatible and foundation-owned', () => {
    const foundation = new Map(
      [...primitiveTokens, ...semanticTokens].map((token) => [token.name, token]),
    );
    for (const component of componentTokens) {
      const reference = foundation.get(component.reference);
      expect(reference, component.name).toBeDefined();
      expect(reference?.type, component.name).toBe(component.type);
    }
  });
});
