# Button Parity Audit

Outcome: **PASS**  
Stage: `1.01`  
Date: 2026-08-14

## Provenance and clean-room review

The mandatory local-only preflight passed against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`. The exact twelve public
documentation pages examined and the extracted behavioral inventory are recorded in
`button.reference-analysis.md`. The implementation was produced from `button.spec.md`; no source,
CSS, asset, bundle, private architecture, undocumented DOM, online fallback, or competitor API was
used as implementation input.

## Observable feature audit

| Feature                            | Result | Casauran evidence                                                                           |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| Native action semantics and events | pass   | One native `<button>`, native click/focus, forwarded ref, and standard attributes/events    |
| Disabled behavior                  | pass   | Native `disabled`, suppressed activation, distinct visual and forced-color state            |
| Toggleable pressed state           | pass   | Discriminated controlled/uncontrolled API, `aria-pressed`, cancellation, browser tests      |
| Keyboard                           | pass   | Native Tab order plus Enter/Space activation in Chromium, Firefox, and WebKit               |
| Pointer and touch                  | pass   | Pointer click and touch-context `tap()` produce the same pressed result                     |
| Forms                              | pass   | Safe default `type="button"`; explicit submit behavior verified in a real form              |
| Content modes                      | pass   | Text, decorative start/end slots, icon-only geometry with caller-supplied name              |
| Appearance                         | pass   | Five appearances, six semantic tones, three sizes, five radii, custom token override        |
| Themes and density                 | pass   | Light/dark and comfortable/compact production matrix; nested density regression covered     |
| RTL and localization               | pass   | Logical flex/layout, inherited RTL, Arabic content/name, no built-in messages               |
| Adaptive accessibility             | pass   | Visible focus, 44px default target, narrow wrapping, reduced motion, forced colors          |
| SSR/hydration/RSC                  | pass   | Static production Next route, stable SSR markup, local client boundary, no hydration errors |

## Enterprise dimension audit

| Dimension              | Result | Evidence and applicability                                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Functionality          | pass   | Spec, public implementation, unit/browser cases, docs, playground, and visual fixture agree            |
| Typing/API consistency | pass   | Native props preserved; toggle-only invalid combinations rejected; stable typed change payload         |
| Accessibility          | pass   | Native role/name/state, disabled/pressed, focus, target, reflow, adaptive media, manual pattern review |
| Keyboard/touch/IME     | pass   | Enter, Space, pointer, touch covered; IME is not an input path and no custom key handler exists        |
| Security               | pass   | React escaping test; no HTML/URL/SVG/parser/storage/network/dynamic-code sink                          |
| Performance            | pass   | 1,000 initial plus 1,000 updated SSR projections: 196.78 ms under 1,000 ms ceiling                     |
| Theming/density        | pass   | Fifteen governed Button tokens; light/dark, nested density, custom override, visual snapshots          |
| RTL/i18n               | pass   | Logical CSS, Arabic content, inherited direction, no component-owned messages/formats                  |
| SSR/hydration/RSC      | pass   | Server-renderable root export; narrow client module; no module-evaluation browser access               |
| Responsive/adaptive    | pass   | Narrow 320px reflow, long-content wrapping, target-size and media-preference evidence                  |
| Integration            | pass   | Public root and CSS exports, native forms/refs, four Next production builds                            |
| Documentation          | pass   | Canonical docs route, interactive playground, package README, executable visual story                  |

## Manual accessibility and visual review

The native semantic pattern, implementation markup, keyboard table, focus/disabled/pressed policy,
and final Chromium visual baseline were manually inspected. Text contrast regression in the soft
accent appearance was found during that review, corrected by separating solid and soft
foregrounds, and locked into all three visual baselines. The review makes no claim of an external
screen-reader certification matrix that was not executed; Button uses the platform's native
button/name/state exposure rather than a custom widget pattern.

## Deliberate independent improvements

- Defaults to `type="button"` to prevent accidental form submission while preserving explicit
  native submit/reset behavior.
- Uses project-wide `pressed/defaultPressed/onPressedChange` ownership instead of an ambiguous
  selected flag.
- Lets consumer `preventDefault()` cancel the pressed request through the events owner.
- Requires normal React content instead of accepting image URLs, icon class strings, SVG data, or
  raw markup; later Icon/SVGIcon stages remain separate.
- Provides a governed component-token override seam, nested density correctness, a 44px default
  target, forced colors, and reduced motion from the first public component.

## Validation evidence

- `pnpm reference:check` — PASS; local snapshot, 12,179 files, 62 domains, online fallback disabled.
- Focused Vitest — PASS; 7 Button/event tests. Repository unit suite — PASS; 112 tests.
- Repository contract suite — PASS; 95 tests.
- Focused production Playwright — PASS; 28 passed, 2 expected non-Chromium forced-color skips.
- `pnpm benchmark:button` — PASS; 196.78 ms on Node v24.18.0, Windows x64.
- `pnpm validate:static` — PASS; format, lint, strict types, architecture, tests, 27 libraries, and
  four Next production hosts.
- `pnpm validate` — PASS after the final ledger transition; 179 browser checks passed with 4
  platform-limited forced-color skips, and the closed records passed governance.

## Gaps, debt, and boundary

No in-scope parity gap, architecture debt, dependency debt, security exception, or deferred Button
acceptance item remains. Link navigation, ButtonGroup, Icon, SVGIcon, dropdown/split/floating
buttons, Toolbar, and loading orchestration remain their own stages. No `1.02` implementation or
scaffold was started.
