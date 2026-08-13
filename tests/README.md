# Test Topology

- `tests/unit`: cross-package pure contract tests when package-local tests are not better.
- `tests/browser`: Playwright interaction, SSR/hydration and visual-host tests.
- `tests/fixtures`: reusable deterministic test data.
- `tests/certification`: Phase 14 whole-product scenarios.

Component tests normally live near source plus deterministic stories in the visual-test app.
