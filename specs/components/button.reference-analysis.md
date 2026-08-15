# Button Reference Analysis

## Scope and preflight

Stage `1.01` analyzes only the public Button behavior in the pinned local reference corpus.

- Original analysis: 2026-08-14, twelve public documentation paths.
- Capability-completeness revalidation: 2026-08-15, extended to every materially related family in
  the corpus, recorded in `.agent/reviews/2026-08-15-button-revalidation.md`.

The mandatory `pnpm reference:check` preflight passed on both dates for
`kdocs/references/kendo-react-docs/docs/content`, snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862` (12,179 files, 62 domains, 127
mapped paths). Online fallback was disabled.

## Local public pages examined

Component pages, examined 2026-08-14:

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

Materially related families added by the 2026-08-15 revalidation:

- `buttons/index.md` — package family inventory and component boundaries
- `buttons/get-started.md` — installation, import, first action, styling entry point
- `common-features/accessibility/index.md` — cross-cutting accessibility programme and the
  standard-versus-enhanced keyboard support classification
- `common-features/accessibility/accessibility-compliance.md` — per-component conformance table;
  Button is listed at `AAA` with standard keyboard support
- `styling/unstyled.md` — documented class-replacement customization mode
- `styling/custom-css-styles.md` — documented style-override guidance and specificity model
- `styling/customizing.md` — theme customization boundaries
- `server-components/index.md` — documented React Server Component posture for the suite
- `ripple/index.md`, `ripple/get-started.md` — opt-in Material ink-ripple decoration applied to
  buttons by a separate wrapper component
- `webmcp/api/ButtonCommands.md` — AI agent command registration surface referenced by the Button
  `webMcp` property

Deliberately **not** examined, in either pass: every path under `buttons/examples/**` and any other
runnable example source, plus stylesheets, assets, bundles, and private package internals. Example
source is competitor implementation material and is forbidden as design or implementation input;
the documented behavior it demonstrates is already captured by the prose pages above.

## Observable feature inventory

1. A button presents a clickable action and supports text, image/icon-like decoration, or their
   combination.
2. It is enabled by default and can be natively disabled.
3. It can represent and change a binary selected/pressed state.
4. It exposes native activation events and participates in ordinary button focus and form
   behavior.
5. It is focusable in document tab order; Enter and Space activate it through native semantics.
   The reference classifies this as _standard_ keyboard support: one tab stop, no component-owned
   shortcuts, no arrow-key model.
6. It supports documented control sizes (`small`, `medium`, `large` in the appearance page, with an
   additional `xs` step in the API surface), five corner treatments (`none`, `small`, `medium`,
   `large`, `full`), five fill modes (`solid`, `flat`, `outline`, `clear`, `link`), and nine
   semantic theme colors (`base`, `primary`, `secondary`, `tertiary`, `info`, `success`, `warning`,
   `error`, `inverse`).
7. Decorative content can precede or follow the label through start/end slots that are documented
   as phrasing, non-interactive content; the same families also expose theme font-icon names,
   third-party icon class strings, image URLs with alternative text, direct SVG icon definitions,
   and an independent icon-size setting. Icon-only presentation is supported when an accessible
   name is supplied.
8. It supports right-to-left layout. It ships no built-in translated messages and formats no
   locale-specific values.
9. The documented accessibility baseline is native `<button>` semantics with an accessible name,
   keyboard activation, focus management, and WCAG 2.2 conformance; the compliance table records
   Button at `AAA`, and the component page documents automated `axe-core` testing plus manual
   screen-reader passes.
10. Customization is documented at three levels: theme variables, CSS overrides governed by normal
    specificity rules, and an opt-in unstyled mode that replaces the component's own class
    structure.
11. A `title` attribute and the remaining native button attributes pass through; the component ref
    exposes a handle rather than only the native element.
12. Cross-cutting integrations are documented outside the component: an opt-in ripple decoration
    wrapper, an experimental (since discontinued) server-component distribution, and an AI agent
    command surface enabled per button.

## Cross-cutting requirements derived for Casauran

- Preserve native `<button>` behavior rather than recreating button semantics with ARIA, and keep
  the keyboard model standard: one tab stop, native Enter/Space, no component-owned shortcut table.
- Expose `aria-pressed` only for the toggleable mode; disabled buttons use the native `disabled`
  attribute.
- Decorative leading/trailing content cannot contain interactive descendants and is excluded from
  the accessible name. Icon-only consumers must provide an accessible name.
- Cover the full documented visual axis independently: an appearance scale, a semantic tone scale,
  a control-size scale that reaches a dense step, and a corner-radius scale including a pill.
- Own no icon vocabulary: artwork arrives as composed React content, so no icon-name string, icon
  class string, image URL, or raw SVG becomes a Button input. The canonical `Icon` component and the
  later `SVGIcon` stage own artwork; Button owns layout and slot geometry, which must stay square
  for icon-only actions at every size.
- Styling must use logical properties, visible `:focus-visible`, forced-color system values,
  reduced-motion-safe transitions, light/dark themes, and comfortable/compact density, with a
  documented override seam that replaces the unstyled-mode capability without a class-injection API.
- Server rendering must produce stable markup. The component may use a local client boundary for
  events and uncontrolled pressed state, without contaminating the package root. Casauran treats
  App Router support as a first-class, supported posture rather than an experimental distribution.
- Caller content is rendered as normal React children; there is no raw-HTML, URL, SVG parser, or
  dynamic-code sink in Button.
- Motion decoration (ripple) and AI agent command registration are cross-cutting subsystems, not
  Button-owned behavior; if Casauran ever adopts either, it belongs to an owning foundation or AI
  stage, not to this component's API.

## Clean-room boundary review

The Casauran API is designed from the independent feature inventory above. It intentionally uses
Casauran terminology, state conventions, CSS namespace, tokens, DOM, package layout, and event
payloads. No competitor class name, API signature, CSS value, asset, or implementation detail is
carried into the product design. Where a documented capability is met differently — icon input,
customization mode, tone vocabulary, ref shape — the difference and its rationale are recorded with
a disposition in `button.parity.md` rather than resolved by imitation.
