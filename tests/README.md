# Test Topology

- `tests/unit`: cross-package pure tests when package-local tests are not better; discovered once by
  root Vitest.
- `tests/browser`: Playwright interaction, SSR/hydration and visual-host tests against production
  `next start` in Chromium, Firefox, and WebKit.
- `tests/fixtures`: reusable deterministic test data.
- `tests/certification`: Phase 14 whole-product scenarios.

Component tests normally live near source plus deterministic stories in the visual-test app.
Repository contract/infrastructure regression tests live beside their Node scripts. See
`BUILD_TEST_INFRASTRUCTURE.md` for commands, ownership, determinism, and artifact policy.

Theme-runtime browser scenarios verify computed CSS and deterministic screenshots against the
production host. Forced-colors emulation is scoped to Chromium where the harness supports it; the
remaining theme, density, RTL, and reduced-motion matrix runs in all three browsers.

Accessibility foundation scenarios use native controls and the production Next.js host to verify
the browser accessibility tree, keyboard/focus behavior, RTL, IME, disabled items, live-region
text safety, and visually-hidden layout in Chromium, Firefox, and WebKit. Manual certification is
still required later for complex public patterns.

React state foundation tests pair pure/server-rendered Vitest assertions with production browser
checks for hydration, controlled/uncontrolled updates, committed callbacks, and stable IDs across
Chromium, Firefox, and WebKit.

Data-engine tests pair descriptor/field/filter/sort/aggregate/group/page Vitest cases and a
100,000-row scenario with a production Server Component fixture. Playwright verifies compiled-root
SSR, deterministic grouped output, and serializable provider-neutral state in Chromium, Firefox,
and WebKit; the standalone benchmark records its pinned Node environment.

Animation foundation tests pair finite timing, preference, settlement, 1,000-key interruption,
and presence Vitest cases with a production Next.js fixture. Playwright verifies SSR/hydration,
native motion, reduced-motion changes, abort, replacement cleanup, and stale revision handling in
Chromium, Firefox, and WebKit.

Collection engine tests pair pure Vitest invariants and a 10,000-item stack-safety case with a
server-only Next.js route. Playwright verifies deterministic visible, active, selected, and
typeahead projections from the compiled internal package in Chromium, Firefox, and WebKit.

Overlay foundation tests pair pure token-safe stack and server-import assertions with a production
Next.js client fixture. Playwright verifies governed portal scope, non-cascading top-layer
dismissal, IME-safe Escape, nested Tab focus/restoration, native-inert isolation, and cleanup in
Chromium, Firefox, and WebKit.

Internationalization tests pair locale/fallback/direction/catalog/plural/formatter/collator Vitest
cases with a server-only production Next.js route. Playwright verifies compiled-root SSR, RTL,
plain-text security, and deterministic number/date/collation output in Chromium, Firefox, and
WebKit; the engine owns no React provider, input parser, IME lifecycle, or date arithmetic.

Date-math tests pair Gregorian/overflow/week/range/wall-time/DST Vitest cases with a server-only
production Next.js route. Playwright verifies compiled-root SSR and deterministic calendar/range/
week plus `America/New_York` gap/overlap policy in Chromium, Firefox, and WebKit; the engine owns no
parser, recurrence, UI, or implicit current clock/system timezone.

Virtualization tests pair exact-window/overscan/dynamic-size/anchor/focus-pinning/2D/observer Vitest
cases with a production Next.js route. Playwright verifies compiled-root SSR, native measurement,
scroll adjustment and focused pinned-item retention across Chromium, Firefox and WebKit; the
standalone 100,000-row by 10,000-column benchmark records the pinned Node environment.

Drag-drop tests pair primary pointer/threshold/target/keyboard/capture/autoscroll/security Vitest
cases with a production Next.js route. Playwright verifies compiled-root SSR, pointer capture/drop,
keyboard drop/cancel with focus retention, touch Pointer Events, edge autoscroll and cleanup across
Chromium, Firefox and WebKit; the standalone target/collision/autoscroll benchmark records the
pinned Node environment.
