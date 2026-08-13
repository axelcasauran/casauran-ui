export const themePackage = '@casauran/theme' as const;

export const themeNames = ['light', 'dark'] as const;
export const densityNames = ['comfortable', 'compact'] as const;

export type ThemeName = (typeof themeNames)[number];
export type DensityName = (typeof densityNames)[number];

export interface ThemeOptions {
  readonly theme?: ThemeName;
  readonly density?: DensityName;
}

export interface ThemeAttributes {
  readonly 'data-theme': ThemeName;
  readonly 'data-density': DensityName;
}

export const defaultTheme = 'light' as const satisfies ThemeName;
export const defaultDensity = 'comfortable' as const satisfies DensityName;
export const themeAttribute = 'data-theme' as const;
export const densityAttribute = 'data-density' as const;

export function getThemeAttributes(options: ThemeOptions = {}): ThemeAttributes {
  return {
    'data-theme': options.theme ?? defaultTheme,
    'data-density': options.density ?? defaultDensity,
  };
}

export function getThemeSelector(theme: ThemeName): `[data-theme='${ThemeName}']` {
  return `[data-theme='${theme}']`;
}

export function getDensitySelector(density: DensityName): `[data-density='${DensityName}']` {
  return `[data-density='${density}']`;
}
