# Theme Matrix

Typography `1.04` passes light/dark and comfortable/compact scoped themes, inherited RTL, semantic
tones, and custom `--csn-typography-font-family`/`-font-size`/`-font-weight`/`-line-height`/`-color`
overrides written in the `overrides` layer. Every role, size, weight and tone assigns its component
tokens at the same specificity including the defaults, so an override behaves identically for a
default and for an explicit value. Type sizes deliberately do not change with density: density
governs control spacing on this platform, and rescaling body text by density would fight the
reader's own font-size preference. Under forced colours text takes the system foreground and the
quotation rule takes a system colour so the block keeps its structural cue. The stage added one
primitive to the token contract, `font.size.3xl`, because the scale stopped at the step the `title`
role occupies and `display` had none to bind to.

SVGIcon `1.03` passes light/dark and comfortable/compact scoped themes, inherited RTL, semantic
tones, custom `--csn-svg-icon-color`/`--csn-svg-icon-size` overrides written in the `overrides`
layer, forced-color foreground, and no-motion behavior. Every enumerated size and tone assigns its
component token at the same specificity including the defaults, so an override behaves identically
for a default and an explicit value. Forced colors additionally flattens per-layer opacity, because
a receded duotone layer would otherwise disappear against a collapsed two-colour palette. Stroke
weight is deliberately not a theme seam: it belongs to the caller-owned drawing and is declared per
layer in the definition.

Icon `1.02` passes light/dark and comfortable/compact scoped themes, inherited RTL, semantic tones,
custom `--csn-icon-color`/`--csn-icon-size` overrides, forced-color foreground, and no-motion
rendering. The visual matrix covers named definitions, every size, tone and flip value, an inverse
surface, a composed Button panel, and RTL text; future visual families are not claimed. The
2026-08-16 capability revalidation corrected two token defects: `tone="inherit"` painted the theme's
primary text colour instead of `currentColor`, so composed artwork ignored its context, and the
default `md` size and `inherit` tone had no rule of their own, so the override seam behaved
differently for a default than for an explicit value. Every enumerated size and tone now assigns its
component token at the same specificity, and overrides belong in the `overrides` cascade layer.

Required dimensions: light, dark, density, RTL, forced colors, reduced motion, custom overrides. Independent planned visual families: Material-inspired, Bootstrap-inspired, Fluent-inspired.

Button `1.01` passes light/dark, comfortable/compact density, RTL logical slot order, forced-color
system assignments, reduced-motion duration, and scoped component-token override evidence. Its
three-engine visual matrix covers five appearances, six semantic tones, four sizes, five radii,
pressed/disabled/icon-only states, composed Icon artwork, long content, and localized RTL content.
The 2026-08-15 capability revalidation added the dense `xs` step and made icon-only geometry resolve
both axes from one internal size property, so an icon-only action is square at every size. Future
visual families remain platform roadmap work and are not silently claimed by this component stage.
