# @casauran/tokens

Framework-neutral, supported design-token data and types for Casauran.

```ts
import { resolveTokenValue, tokenVariable } from '@casauran/tokens';

resolveTokenValue('surface.canvas'); // '#ffffff'
tokenVariable('focus.ring'); // 'var(--csn-focus-ring)'
```

The package publishes primitive and semantic definitions, literal name unions, stable CSS custom-property names, and pure lookup helpers. It is safe to evaluate during SSR and has no runtime dependencies.

The canonical source is `registry/tokens/foundation.json`. Run `pnpm generate:tokens` after intentional registry changes and `pnpm validate:tokens` to prove schema, reference, API, and generated-source consistency. Generated source is never hand-edited.

Prefer semantic intent such as `text.primary` to raw primitives. CSS emission, theme assignment, dark mode, density application, forced-colors behavior, and reduced-motion overrides belong to F0.06 and are not provided by this package.
