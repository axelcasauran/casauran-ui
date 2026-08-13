import { describe, expect, it } from 'vitest';

import {
  defaultDensity,
  defaultTheme,
  densityAttribute,
  densityNames,
  getDensitySelector,
  getThemeAttributes,
  getThemeSelector,
  themeAttribute,
  themeNames,
} from '../../packages/theme/src/index.js';

describe('@casauran/theme', () => {
  it('publishes stable theme and density identifiers', () => {
    expect(themeNames).toEqual(['light', 'dark']);
    expect(densityNames).toEqual(['comfortable', 'compact']);
    expect(themeAttribute).toBe('data-theme');
    expect(densityAttribute).toBe('data-density');
  });

  it('returns hydration-stable default attributes', () => {
    expect(defaultTheme).toBe('light');
    expect(defaultDensity).toBe('comfortable');
    expect(getThemeAttributes()).toEqual({
      'data-theme': 'light',
      'data-density': 'comfortable',
    });
  });

  it('returns explicit attributes without reading browser state', () => {
    expect(getThemeAttributes({ theme: 'dark', density: 'compact' })).toEqual({
      'data-theme': 'dark',
      'data-density': 'compact',
    });
  });

  it('builds documented low-specificity attribute selectors', () => {
    expect(getThemeSelector('dark')).toBe("[data-theme='dark']");
    expect(getDensitySelector('compact')).toBe("[data-density='compact']");
  });
});
