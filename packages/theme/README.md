# @casauran/theme

Supported static CSS theme runtime for Casauran UI.

Import the stylesheet once and render explicit server-compatible attributes:

```tsx
import '@casauran/theme/theme.css';
import { getThemeAttributes } from '@casauran/theme';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...getThemeAttributes({ theme: 'dark', density: 'compact' })}>
      <body>{children}</body>
    </html>
  );
}
```

The supported themes are `light` and `dark`; densities are `comfortable` and `compact`. Light and comfortable are defaults. The helpers are pure and safe in Server Components. Applications should resolve persisted or system preference on the server and render the same attributes during hydration.

CSS uses the fixed `reset, tokens, base, components, utilities, overrides` cascade, low-specificity selectors, inherited `--csn-*` properties, forced-color system values, and zero semantic durations under reduced motion. Use logical properties in consumer/component CSS. Portals under `<body>` inherit an `<html>` theme; detached portals for nested theme scopes copy both attributes.

The canonical mapping is `registry/themes/foundation.json`. Run `pnpm generate:theme` after an intentional mapping change and `pnpm validate:theme` to check mapping completeness, contrast, generated drift, package behavior, and browser evidence. Do not edit `theme.css` by hand.

Material-, Bootstrap-, and Fluent-inspired families are not shipped by this foundation stage.
