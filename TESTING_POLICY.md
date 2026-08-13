# Testing Policy

Test contracts at the cheapest reliable layer.

Node test runner: repository contracts, validators, and infrastructure regressions.
Vitest: one repository-root pass for pure engines, data/date/formula/state, and cross-package logic.
Playwright: production-host browser layout/focus/pointer/touch/keyboard, visual stories, and
SSR/hydration integration across Chromium, Firefox, and WebKit.
Next.js hosts: production build and RSC-safe import/runtime behavior.
Complex widgets: performance, large-data, accessibility certification, and security scenarios.

React state foundations use Vitest/server rendering for pure resolution and SSR output, then the
production Next.js Playwright matrix for hydration, committed callbacks, controlled/uncontrolled
coordination, functional updates, and ID stability.

Collection-engine tests cover invariant failures, token-aware registration cleanup, disabled-item
movement, deterministic selection/ranges, tree projection, caller-timed typeahead, untrusted text,
and a 10,000-item stack-safety scenario. The production Server Component route verifies the
compiled package entry point across the Playwright browser matrix.

Overlay tests use Vitest for token-safe stack ordering and server-safe module imports. Production
Playwright scenarios verify portal theme/density/direction scope and cleanup, top-layer non-
cascading pointer/Escape dismissal, composition safety, nested Tab containment/restoration,
native-inert isolation, hydration, and listener/mutation cleanup across all three browsers.

Tests and tooling are strict-typechecked. Empty discovery, duplicate per-package root execution,
development-server-only evidence, and `--passWithNoTests` are not accepted by the root gate. Do not
test private reference implementation details. See `BUILD_TEST_INFRASTRUCTURE.md`.
