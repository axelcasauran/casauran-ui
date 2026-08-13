# Testing Policy

Test contracts at the cheapest reliable layer.

Node test runner: repository contracts, validators, and infrastructure regressions.
Vitest: one repository-root pass for pure engines, data/date/formula/state, and cross-package logic.
Playwright: production-host browser layout/focus/pointer/touch/keyboard, visual stories, and
SSR/hydration integration across Chromium, Firefox, and WebKit.
Next.js hosts: production build and RSC-safe import/runtime behavior.
Complex widgets: performance, large-data, accessibility certification, and security scenarios.

Tests and tooling are strict-typechecked. Empty discovery, duplicate per-package root execution,
development-server-only evidence, and `--passWithNoTests` are not accepted by the root gate. Do not
test private reference implementation details. See `BUILD_TEST_INFRASTRUCTURE.md`.
