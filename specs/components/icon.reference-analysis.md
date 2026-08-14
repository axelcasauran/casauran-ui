# Icon reference analysis

## Provenance

The required local-only preflight passed on 2026-08-14 against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`.
The stage ledger's nonexistent `docs/content/icons` path was superseded by the higher-authority
registry/reference-map path `docs/content/common/icon`.

## Examined paths

- `common/icon/index.md`
- `common/icon/appearance.md`
- `common/icon/accessibility/wai-aria-support.md`
- `common/api/Icon.md`
- `common/api/IconProps.md`
- `common/api/IconSize.md`
- `common/api/IconThemeColor.md`
- `common/api/IconFlip.md`
- `common/examples/icon/overview/func/app.tsx`
- `common/examples/icon/size/func/app.tsx`
- `common/examples/icon/theme-color/func/app.tsx`
- `common/examples/icon/flip/func/app.tsx`

## Extracted behavioral requirements

Named icons display a catalog glyph; they support preset sizing, theme-aware or inherited color,
horizontal/vertical mirroring, standard element attributes, and a decorative accessibility default.
They do not own an action, focus model, keyboard table, or state. These facts were rewritten into
the independent specification; no reference source, CSS, asset, class name, or API was copied.

## Casauran decisions

The frozen architecture prohibits font icons, so Icon uses independently authored SVG path data in
`@casauran/icons`. A small initial catalog is intentional, unknown names fail closed, and direct
definition rendering remains reserved for stage 1.03 SVGIcon. Casauran adds an explicit `label`
escape from decorative semantics rather than relying on caller ARIA to contradict `aria-hidden`.
