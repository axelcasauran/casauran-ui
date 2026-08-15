# Button Reference Analysis

## Scope and preflight

Stage `1.01` analyzes only the public Button behavior in the pinned local reference corpus. The
mandatory `pnpm reference:check` preflight passed on 2026-08-14 for
`kdocs/references/kendo-react-docs/docs/content`, snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`. Online fallback was
disabled.

## Local public pages examined

- `buttons/button/index.md`
- `buttons/button/appearance.md`
- `buttons/button/disabled-state.md`
- `buttons/button/events.md`
- `buttons/button/icons.md`
- `buttons/button/toggleable.md`
- `buttons/button/keyboard-navigation.md`
- `buttons/button/accessibility/wai-aria-support.md`
- `buttons/api/Button.md`
- `buttons/api/ButtonInterface.md`
- `buttons/api/ButtonProps.md`
- `buttons/globalization.md`

No reference source, stylesheet, asset, bundle, private architecture, undocumented DOM, or online
material was inspected.

## Observable feature inventory

1. A button presents a clickable action and supports text, image/icon-like decoration, or their
   combination.
2. It is enabled by default and can be natively disabled.
3. It can represent and change a binary selected/pressed state.
4. It exposes native activation events and participates in ordinary button focus and form
   behavior.
5. It is focusable in document tab order; Enter and Space activate it through native semantics.
6. It supports three documented control sizes, several corner treatments, filled/flat/outlined/
   clear/link-like appearances, and semantic color emphasis.
7. It can place decorative content before or after its main content and can be presented as an
   icon-only action when an accessible name is supplied.
8. It supports right-to-left layout. It has no built-in messages or locale-formatted values.
9. The documented accessibility baseline is native `<button>` semantics with an accessible name,
   keyboard activation, focus management, and WCAG 2.2 AA intent.

## Cross-cutting requirements derived for Casauran

- Preserve native `<button>` behavior rather than recreating button semantics with ARIA.
- Expose `aria-pressed` only for the toggleable mode; disabled buttons use the native `disabled`
  attribute.
- Decorative leading/trailing content cannot contain interactive descendants and is excluded from
  the accessible name. Icon-only consumers must provide an accessible name.
- Styling must use logical properties, visible `:focus-visible`, forced-color system values,
  reduced-motion-safe transitions, light/dark themes, and comfortable/compact density.
- Server rendering must produce stable markup. The component may use a local client boundary for
  events and uncontrolled pressed state, without contaminating the package root.
- Caller content is rendered as normal React children; there is no raw-HTML, URL, SVG parser, or
  dynamic-code sink in Button.

## Clean-room boundary review

The Casauran API below is designed from the independent feature inventory. It intentionally uses
Casauran terminology, state conventions, CSS namespace, tokens, DOM, package layout, and event
payloads. No competitor class name, API signature, CSS value, asset, or implementation detail is
carried into the product design.
