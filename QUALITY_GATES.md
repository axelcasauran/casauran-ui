# Quality Gates

Repository gate: governance/schema/stage/dependency/build infrastructure valid. The owned,
machine-readable validator inventory and gate linkage are defined in
`.agent/mechanical-governance.json` and explained in `MECHANICAL_GOVERNANCE.md`.

Pre-install gate: `pnpm verify:scaffold` runs the complete read-only mechanical suite without
requiring repository dependencies. Static gate: `pnpm validate:static` adds formatting, lint,
strict types, dependency architecture, tests, and builds. Full gate: `pnpm validate` adds browser
integration and is the stage-close/CI command.

Build/test infrastructure is defined in `.agent/build-test-infrastructure.json` and
`BUILD_TEST_INFRASTRUCTURE.md`. The static gate verifies emitted library exports and typechecks
tests/tooling; the full gate exercises a production Next.js runtime in Chromium, Firefox, and
WebKit.

Component gate: Definition of Done passes.
Phase gate: phase certification PASS or explicitly PASS WITH DEBT.
Release gate: compatibility/security/public API/packages/docs certified.
1.0 gate: enterprise certification plus three serious applications using supported public API only.

BLOCKED never rolls forward silently.

Reference gate: `pnpm validate:reference-baseline` checks stored provenance/inventory/map/lifecycle
contracts, while `pnpm reference:check` recomputes the external local-only snapshot digest and
mapped paths. Both pass before reference-derived work; the full stage-close gate remains
`pnpm validate`.

Documentation foundation gate: `pnpm validate:documentation-experience` checks ADR/stage
ownership, capability/route/metadata contracts, narrow client/security boundaries, and required
production docs-host evidence. The full browser gate starts both documentation and visual hosts.
