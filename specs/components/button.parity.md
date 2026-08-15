# Button Parity Audit

Outcome: **PASS**  
Stage: `1.01`  
Original audit: 2026-08-14  
Capability-completeness revalidation: 2026-08-15
(`.agent/reviews/2026-08-15-button-revalidation.md`)

## Provenance and clean-room review

The mandatory local-only preflight passed against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862` on both audit dates. Every
examined path — the original twelve component pages and the eleven cross-cutting pages added by the
revalidation — is recorded in `button.reference-analysis.md`. The implementation was produced from
`button.spec.md`; no source, CSS, asset, bundle, private architecture, undocumented DOM, online
fallback, competitor API, or runnable example file was used as implementation input.

## Disposition vocabulary

Every materially relevant capability carries exactly one disposition: `IMPLEMENTED`,
`IMPLEMENTED_DIFFERENTLY`, `NOT_APPLICABLE`, `INTENTIONALLY_DIVERGED`,
`DEFERRED_TO_DECLARED_DEPENDENCY`, or `BLOCKED`. `UNKNOWN`, `NOT_CHECKED`, a silent omission, and a
`TODO` without an owner are not acceptable final states. Deferral names the owning stage.

## Observable capability audit

| #   | Capability                                                            | Disposition                     | Casauran evidence and rationale                                                                                                                                                                                                                                                                                                 |
| --- | --------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Native action semantics, click and focus events                       | IMPLEMENTED                     | One native `<button>`, forwarded ref, full native attribute/event passthrough; `tests/unit/button.test.tsx`, `tests/browser/button.spec.ts`                                                                                                                                                                                     |
| 2   | Disabled state                                                        | IMPLEMENTED                     | Native `disabled`, suppressed activation, `data-disabled` hook, distinct visual and forced-color treatment; browser disabled case                                                                                                                                                                                               |
| 3   | Toggleable pressed state, controlled and uncontrolled                 | IMPLEMENTED                     | Discriminated `toggleable` union, `pressed`/`defaultPressed`/`onPressedChange`, `aria-pressed`, cancellation through `onClick`; unit controlled-render cases and browser toggle cases                                                                                                                                           |
| 4   | Standard keyboard model (single tab stop, Enter/Space)                | IMPLEMENTED                     | Native activation with no component-owned key handler; Enter/Space asserted in Chromium, Firefox and WebKit                                                                                                                                                                                                                     |
| 5   | Pointer and touch activation                                          | IMPLEMENTED                     | Pointer click and touch-context `tap()` produce the same pressed result at a 320 px viewport                                                                                                                                                                                                                                    |
| 6   | Native form participation                                             | IMPLEMENTED                     | Safe `type="button"` default with explicit `submit`/`reset`; `name`, `value`, `form*` attributes pass through; real form submit verified in the browser                                                                                                                                                                         |
| 7   | Fill-mode scale                                                       | IMPLEMENTED_DIFFERENTLY         | Five Casauran appearances — `solid`, `soft`, `outline`, `ghost`, `link` — cover the same emphasis range on an independent vocabulary; the reference's `flat`/`clear` split is expressed as `ghost` plus tone/appearance composition                                                                                             |
| 8   | Semantic color scale: base, primary, success, warning, error, inverse | IMPLEMENTED                     | `neutral`, `accent`, `positive`, `caution`, `critical`, `inverse` tones, each with solid/soft/outline foregrounds and dark-theme values                                                                                                                                                                                         |
| 9   | Semantic color `info`                                                 | IMPLEMENTED_DIFFERENTLY         | Informational emphasis resolves to `tone="accent"`, the same `--csn-interactive-primary` ramp that `Icon`'s `info` tone resolves to; adding a second name for one ramp would create an ambiguous API rather than new capability. Documented in the docs "Choosing a tone" callout                                               |
| 10  | Semantic colors `secondary` and `tertiary`                            | IMPLEMENTED_DIFFERENTLY         | De-emphasis is expressed as `tone="neutral"` stepped through `soft` → `outline` → `ghost` appearances instead of additional brand ramps; ADR-006 defines one brand ramp. Documented with the tone guidance                                                                                                                      |
| 11  | Control size scale: small, medium, large                              | IMPLEMENTED                     | `sm`, `md`, `lg` with token-driven padding, typography and minimum block size                                                                                                                                                                                                                                                   |
| 12  | Dense `xs` control size                                               | IMPLEMENTED                     | Added by this revalidation: `size="xs"` with its own spacing, typography and square icon-only geometry; unit size-scale case, browser monotonic size case, visual size panel                                                                                                                                                    |
| 13  | Corner-radius scale including pill                                    | IMPLEMENTED                     | `radius` of `none`, `sm`, `md`, `lg`, `full`                                                                                                                                                                                                                                                                                    |
| 14  | Decorative leading and trailing content                               | IMPLEMENTED                     | `startContent`/`endContent` render `aria-hidden` non-interactive slots excluded from the accessible name                                                                                                                                                                                                                        |
| 15  | Icon-only presentation                                                | IMPLEMENTED                     | `iconOnly` layout with a caller-supplied accessible name; square geometry now derives from the resolved size at every step, verified in the browser                                                                                                                                                                             |
| 16  | Theme font icon by name (`icon`)                                      | IMPLEMENTED_DIFFERENTLY         | Button owns no icon vocabulary; the canonical `Icon` component from stage `1.02` is composed into a slot. Unit composition case, browser composition case, docs example                                                                                                                                                         |
| 17  | Third-party icon class (`iconClass`)                                  | IMPLEMENTED_DIFFERENTLY         | The caller passes any node, including one carrying a third-party class, into a decorative slot; Button never interprets a class string                                                                                                                                                                                          |
| 18  | Image icon (`imageUrl`, `imageAlt`)                                   | IMPLEMENTED_DIFFERENTLY         | The caller passes an `<img>` it already trusts into a decorative slot. Button accepts no URL input, so no image loading, referrer or alternative-text policy enters its trust boundary; documented in the content section                                                                                                       |
| 19  | Direct SVG icon definition (`svgIcon`)                                | DEFERRED_TO_DECLARED_DEPENDENCY | Owner: stage `1.03 SVGIcon`, which introduces the supported direct-definition surface. Button needs no change to consume it — a `SVGIcon` element composes into the same slots — so the obligation on `1.03` is to revalidate Button × SVGIcon evidence, not to reimplement Button                                              |
| 20  | Independent icon size (`iconSize`)                                    | IMPLEMENTED_DIFFERENTLY         | Artwork sizes itself: `Icon` carries its own `size`, and the slot box is the documented `--csn-button-icon-size` component token. Verified by the icon-only size panel                                                                                                                                                          |
| 21  | `title` and remaining native attributes                               | IMPLEMENTED                     | Native attribute passthrough with only `aria-pressed`, `children` and legacy `color` reserved                                                                                                                                                                                                                                   |
| 22  | Component ref handle                                                  | IMPLEMENTED_DIFFERENTLY         | The forwarded ref is the native `HTMLButtonElement`. A custom handle would add a durable API surface with no capability the element does not already provide; `API_GOVERNANCE.md` restricts refs to durable imperative needs. Browser focus-through-ref case                                                                    |
| 23  | Right-to-left layout                                                  | IMPLEMENTED                     | Logical properties and flex order, inherited `dir`, Arabic content and icon-only name in the visual fixture and browser RTL case                                                                                                                                                                                                |
| 24  | No built-in messages or locale formatting                             | IMPLEMENTED                     | Button owns no message catalog or formatter, matching the reference posture; documented in the globalization section                                                                                                                                                                                                            |
| 25  | Theme-variable and CSS override customization                         | IMPLEMENTED                     | Fifteen governed Button component tokens, a stable `.csn-button` root hook, stable state data attributes, and the `overrides` cascade layer; browser token-override case                                                                                                                                                        |
| 26  | Unstyled / class-replacement mode                                     | IMPLEMENTED_DIFFERENTLY         | Casauran replaces class injection with a token seam plus documented state attributes in a fixed cascade order, so applications restyle without a context provider or a second class vocabulary, and no internal DOM becomes a compatibility promise. ADR-003 forbids the runtime class-structure approach                       |
| 27  | Ripple motion decoration                                              | NOT_APPLICABLE                  | In the reference this is a separate wrapper component, not Button behavior. Casauran has no ripple component in the approved 127-component scope; if adopted it would be owned by the animation foundation (`F0.11`), never by Button's API                                                                                     |
| 28  | React Server Component posture                                        | IMPLEMENTED_DIFFERENTLY         | Casauran treats the App Router as the primary supported host from one package rather than shipping a separate experimental distribution: server-safe root, narrow local client boundary, stable SSR markup, four production Next hosts                                                                                          |
| 29  | AI agent command registration (`webMcp`)                              | NOT_APPLICABLE                  | Agent tool registration is a cross-cutting integration owned by the `ai` capability (`registry/capabilities/ai.json`, status `planned`, no approved contract). No Casauran component exposes an agent surface on its own API, and Button will not unilaterally create one; adoption would require a capability contract and ADR |
| 30  | WCAG 2.2 `AAA` conformance claim                                      | INTENTIONALLY_DIVERGED          | ADR-009 fixed WCAG 2.2 **AA** as the platform baseline before implementation began. Button meets that baseline with evidence; a `AAA` claim would require enhanced-contrast token work across the whole palette, which is a token-owner decision, not a Button decision                                                         |
| 31  | Automated accessibility scanning and screen-reader certification      | IMPLEMENTED_DIFFERENTLY         | Role, accessible name, pressed and disabled state are asserted against the real accessibility tree in three production browser engines, and a manual pattern/visual review is recorded. No third-party screen-reader certification matrix is claimed, because none was executed                                                 |

Disposition counts: `IMPLEMENTED` 16, `IMPLEMENTED_DIFFERENTLY` 11,
`DEFERRED_TO_DECLARED_DEPENDENCY` 1, `NOT_APPLICABLE` 2, `INTENTIONALLY_DIVERGED` 1, `BLOCKED` 0.

## Enterprise dimension audit

| Dimension              | Result | Evidence and applicability                                                                                |
| ---------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| Functionality          | pass   | Spec, public implementation, unit/browser cases, docs, playground, and visual fixture agree               |
| Typing/API consistency | pass   | Native props preserved; toggle-only invalid combinations rejected; stable typed change payload            |
| Accessibility          | pass   | Native role/name/state, disabled/pressed, focus, target, reflow, adaptive media, manual pattern review    |
| Keyboard/touch/IME     | pass   | Enter, Space, pointer, touch covered; IME is not an input path and no custom key handler exists           |
| Security               | pass   | React escaping test; no HTML/URL/SVG/parser/storage/network/dynamic-code sink                             |
| Performance            | pass   | 1,000 initial plus 1,000 updated SSR projections: 196.78 ms under 1,000 ms ceiling                        |
| Theming/density        | pass   | Fifteen governed Button tokens; light/dark, nested density, custom override, visual snapshots             |
| RTL/i18n               | pass   | Logical CSS, Arabic content, inherited direction, no component-owned messages/formats                     |
| SSR/hydration/RSC      | pass   | Server-renderable root export; narrow client module; no module-evaluation browser access                  |
| Responsive/adaptive    | pass   | Narrow 320px reflow, long-content wrapping, target-size and media-preference evidence                     |
| Integration            | pass   | Public root and CSS exports, native forms/refs, canonical `Icon` composition, four Next production builds |
| Documentation          | pass   | Sixteen-section canonical docs route, interactive playground, package README, executable visual story     |

## Manual accessibility and visual review

The native semantic pattern, implementation markup, keyboard table, focus/disabled/pressed policy,
and the Chromium visual baseline were manually inspected in both passes. The 2026-08-14 pass found
and fixed a soft-accent contrast defect. The 2026-08-15 pass found that icon-only geometry pinned
the inline size to the default control size, so an icon-only `sm` or `lg` action rendered as a
rectangle rather than a square; the fix derives both axes from one resolved size custom property and
is locked by a browser assertion. The review makes no claim of an external screen-reader
certification matrix that was not executed; Button uses the platform's native button/name/state
exposure rather than a custom widget pattern.

## Deliberate independent improvements

- Defaults to `type="button"` to prevent accidental form submission while preserving explicit
  native submit/reset behavior.
- Uses project-wide `pressed/defaultPressed/onPressedChange` ownership instead of an ambiguous
  selected flag.
- Lets consumer `preventDefault()` cancel the pressed request through the events owner.
- Requires normal React content instead of accepting image URLs, icon class strings, SVG data, or
  raw markup, which keeps a whole category of untrusted input outside the component boundary.
- Provides a governed component-token override seam, nested density correctness, a 44 px default
  target, forced colors, and reduced motion from the first public component.
- Keeps every size square in icon-only layout, so dense toolbars do not need per-size overrides.

## Validation evidence

The 2026-08-14 closure evidence stands in `.agent/stages/1.01-button.md`. The revalidation was
validated as recorded in that ledger's revalidation section and in
`.agent/reviews/2026-08-15-button-revalidation.md`, including the honest statement of which browser
engines were and were not executed in the revalidation environment.

## Gaps, debt, and boundary

No in-scope parity gap, architecture debt, dependency debt, security exception, or unexplained
capability remains: every row above carries a disposition, the single deferral names stage `1.03`,
and both `NOT_APPLICABLE` rows name the owning subsystem and why Button is not that owner. Link
navigation, ButtonGroup, SVGIcon, dropdown/split/floating buttons, Toolbar, ripple decoration, agent
command surfaces, and loading orchestration remain outside this component.
