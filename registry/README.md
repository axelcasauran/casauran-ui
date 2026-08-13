# Registry

Canonical machine-readable inventory. `components/` tracks public components, `capabilities/` shared ownership, and later product layers have separate registries. `tokens/foundation.json` is the versioned authored source for public primitive and semantic token data; `themes/foundation.json` owns light/dark, density, reduced-motion, and forced-color assignments; `accessibility/foundation.json` owns framework-neutral focus, keyboard, live-region, and visually-hidden primitives. `requiredBy` is generated from `composition.uses` rather than hand-maintained.
