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
