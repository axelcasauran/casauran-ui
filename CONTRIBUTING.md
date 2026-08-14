# Contributing

Read `GOVERNANCE.md` and classify the change before implementation. Work only in the active
stage/phase and identify the primary domain owner and required review roles. Read governing docs
and route the task through `.agent/agent-operating-system.json`; load every selected prompt,
workflow, and skill. Keep one public component per component stage. Define acceptance before
implementation. Specs/registry/tests precede completion. Run `pnpm validate`. Add release metadata
when supported behavior changes. Validator changes must follow `MECHANICAL_GOVERNANCE.md`, remain
read-only/network-free, and update the machine registry plus focused tests. Update stage evidence
only when its exit gates are satisfied.

Use the test layer defined by `BUILD_TEST_INFRASTRUCTURE.md`: Node for repository contracts, Vitest
for pure logic, and Playwright against the production visual-test host for browser behavior. Do not
add per-package root test loops, empty-test bypasses, generated build artifacts, or development-only
browser evidence.

Architectural proposals use ADR workflow rather than opportunistic refactors.

Token changes begin in `registry/tokens/foundation.json`. Run `pnpm generate:tokens`, review the
public identifier and value impact, and run `pnpm validate:tokens`; never hand-edit generated token
source. Theme assignments and CSS runtime behavior are separate changes owned by the theme stage.

Theme mapping changes begin in `registry/themes/foundation.json`. Run `pnpm generate:theme`, review
contrast and browser/visual evidence, and run `pnpm validate:theme`. Never edit generated
`packages/theme/src/theme.css` directly or introduce proprietary theme values/selectors.

Accessibility engine changes begin with `registry/accessibility/foundation.json` and the owning
specification. Run `pnpm test:accessibility-foundation`, real-browser keyboard/focus evidence where
applicable, and `pnpm validate:accessibility-foundation`. Do not move React state, collection
registration, overlay lifecycle, or component-specific APG behavior into the foundation package.

React state changes begin with `registry/react-state/foundation.json` and
`specs/foundation/react-state.md`. Keep pure state/ID rules in core and hooks behind
`@casauran/react/state`; never add a broad package-root client directive. Run
`pnpm test:react-state-foundation`, production hydration/browser evidence, and
`pnpm validate:react-state-foundation`. Collection, overlay, form, persistence, and component state
machines stay with their owners.

Collection-engine changes begin with `registry/collections/foundation.json` and
`specs/foundation/collection-engine.md`. Preserve immutable snapshots, stable key ordering,
token-aware registration cleanup, disabled-item handling, caller-owned timing/IME behavior, and
the React/DOM-free package boundary. Run `pnpm test:collection-engine`, production SSR evidence,
and `pnpm validate:collection-engine`.

Overlay lifecycle changes begin with `registry/overlay/foundation.json` and
`specs/foundation/overlay.md`. Preserve top-layer-only dismissal, token-safe cleanup, nested focus
restoration, native-inert ownership, enumerated portal scope attributes, SSR-safe imports, and the
positioning/animation/component boundaries. Run `pnpm test:overlay-foundation`, production browser
focus/pointer evidence, and `pnpm validate:overlay-foundation`.

Animation lifecycle changes begin with `registry/animation/foundation.json` and
`specs/foundation/animation.md`. Preserve finite token-resolved timing, explicit reduced-motion
observation, deterministic WAAPI settlement, token-safe keyed interruption, revision-safe
presence, SSR-safe imports, and the CSS/theme/component/data boundaries. Run
`pnpm test:animation-foundation`, production browser motion evidence, and
`pnpm validate:animation-foundation`.

Data-engine changes begin with `registry/data/foundation.json` and
`specs/foundation/data-engine.md`. Preserve serializable provider-neutral descriptors,
own-property access, bounded untrusted-filter validation, stable immutable processing, the
documented aggregate/group/page order, and transport/persistence/virtualization/i18n/component
boundaries. Run `pnpm test:data-engine`, `pnpm benchmark:data-engine`, production SSR/browser
evidence, and `pnpm validate:data-engine`.

Internationalization changes begin with `registry/i18n/foundation.json` and
`specs/foundation/internationalization.md`. Preserve explicit locale input, immutable plain-text
catalogs, own-property interpolation, native `Intl`, SSR safety, and the application/React/input/
date-math boundaries. Run `pnpm test:internationalization`, production SSR/browser evidence, and
`pnpm validate:internationalization`.

Date-math changes begin with `registry/date-math/foundation.json` and
`specs/foundation/date-math.md`. Preserve validated immutable values, explicit overflow/week/
timezone policy, inclusive range semantics, native `Intl` DST handling, SSR safety, and the i18n/
recurrence/parser/component boundaries. Run `pnpm test:date-math`, production SSR/browser evidence,
and `pnpm validate:date-math`.

Virtualization changes begin with `registry/virtualization/foundation.json` and
`specs/foundation/virtualization.md`. Preserve logical geometry, bounded counts, finite positive
sizes, stable-key measurement reuse, explicit anchor adjustment, focus pinning, 2D no-cell-matrix
composition, injected observer lifecycle, SSR safety, and component/collection/data/drag-drop
boundaries. Run `pnpm test:virtualization-foundation`, `pnpm benchmark:virtualization`, production
SSR/browser evidence, and `pnpm validate:virtualization-foundation`.

Drag-drop changes begin with `registry/drag-drop/foundation.json` and
`specs/foundation/drag-drop.md`. Preserve primary Pointer Events capture, explicit threshold/
cancellation/cleanup, keyboard-equivalent state, deterministic target collision, bounded
autoscroll, opaque payload security, SSR safety, and component/data/accessibility/file boundaries.
Run `pnpm test:drag-drop-foundation`, `pnpm benchmark:drag-drop`, production SSR/browser evidence,
and `pnpm validate:drag-drop-foundation`.

Reference work begins with `reference/kendo-react-baseline.json`, runs `pnpm reference:check`
before opening any local public document, and records every relative path examined. Preserve the
pinned inventory/map and local-only clean-room boundary. `pnpm reference:inventory:write` is used
only in an approved baseline/sync workflow; ordinary component work must never regenerate the
inventory to absorb drift. Run `pnpm test:reference-baseline` and
`pnpm validate:reference-baseline` before close.
