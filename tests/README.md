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

Collection engine tests pair pure Vitest invariants and a 10,000-item stack-safety case with a
server-only Next.js route. Playwright verifies deterministic visible, active, selected, and
typeahead projections from the compiled internal package in Chromium, Firefox, and WebKit.

Overlay foundation tests pair pure token-safe stack and server-import assertions with a production
Next.js client fixture. Playwright verifies governed portal scope, non-cascading top-layer
dismissal, IME-safe Escape, nested Tab focus/restoration, native-inert isolation, and cleanup in
Chromium, Firefox, and WebKit.
