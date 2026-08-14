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

Animation tests use Vitest for finite timing, reduced-motion observation, deterministic terminal
settlement, 1,000-key interruption ownership, and revision-safe presence. Production Playwright
scenarios verify the compiled package SSR import, native Web Animations, media preference changes,
abort, interruption, and stale presence completion across all three browsers.

Data-engine tests use Vitest for field safety, descriptor validation, filter operators, stable
sorting, aggregate/group semantics, paging order, immutability, and a deterministic 100,000-row
scenario. A production Server Component verifies compiled root imports and serialized state/results
through Playwright in Chromium, Firefox, and WebKit; a pinned-Node benchmark records its environment
and enforces the documented five-second engine ceiling.

Internationalization tests use Vitest for locale hierarchy, direction, immutable own-property
catalogs, fallback/default resolution, primitive interpolation safety, plural rules, formatter/
collator wrappers, explicit locale switching, and invalid input. A production Server Component
imports the compiled root; Playwright verifies SSR text, RTL, safe untrusted-message rendering,
and deterministic formatting in Chromium, Firefox, and WebKit.

Date-math tests use Vitest for Gregorian validation, leap/month/year overflow, ISO weeks, inclusive
ranges, signed wall-time overflow, immutable own-field handling, non-hour offsets, and explicit DST
gap/overlap disambiguation. A production Server Component imports the compiled root; Playwright
verifies deterministic calendar/range/week/timezone results in Chromium, Firefox, and WebKit.

Virtualization tests use Vitest for boundaries, exact viewport edges, overscan, dynamic sizes,
stable-key count changes, scroll anchoring, alignment, focus pinning, 2D composition, explicit
observer lifecycle, and invalid geometry. A production Server Component imports the compiled root;
Playwright verifies deterministic SSR plus native measurement, anchor adjustment, focused-item
retention and cleanup across Chromium, Firefox, and WebKit. The standalone benchmark records its
pinned environment and enforces the documented large-data ceiling.

Drag-drop tests use Vitest for primary-pointer filtering, exact activation thresholds, immutable
state, target acceptance/collision/ties, keyboard-equivalent transitions, capture loss/disposal,
autoscroll bounds/nesting and hostile opaque payloads. A production Server Component imports the
compiled root; Playwright verifies pointer capture/drop, keyboard drop/cancel with retained focus,
touch Pointer Events, edge autoscroll and cleanup across Chromium, Firefox and WebKit. The
standalone benchmark records its pinned environment and enforces the documented target/scroll
calculation ceiling.

Reference-baseline Node regressions reject provenance/boundary drift, inconsistent inventory
totals, map/registry disagreement, and premature public-stage activation. The repository-only
validator runs in the scaffold suite; `pnpm reference:check` separately hashes the external local
corpus and verifies all mapped paths. No browser/runtime test applies because F0.17 renders and
exports nothing.

The documentation-experience contract has focused Node rejection tests and a read-only validator.
The production browser matrix starts both `apps/visual-tests` and `apps/docs`; docs-shell cases
verify SSR/deep links, registry metadata, local preference hydration, keyboard landmarks,
responsive reflow, runtime errors, and deterministic shell screenshots in Chromium, Firefox, and
WebKit.

Tests and tooling are strict-typechecked. Empty discovery, duplicate per-package root execution,
development-server-only evidence, and `--passWithNoTests` are not accepted by the root gate. Do not
test private reference implementation details. See `BUILD_TEST_INFRASTRUCTURE.md`.
