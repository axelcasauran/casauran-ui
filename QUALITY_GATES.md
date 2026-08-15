# Quality Gates

Repository gate: governance/schema/stage/dependency/build infrastructure valid. The owned,
machine-readable validator inventory and gate linkage are defined in
`.agent/mechanical-governance.json` and explained in `MECHANICAL_GOVERNANCE.md`.

Pre-install gate: `pnpm verify:scaffold` runs the complete read-only mechanical suite without
requiring repository dependencies. Static gate: `pnpm validate:static` adds formatting, builds,
lint, strict types, dependency architecture, and tests. Full gate: `pnpm validate` adds browser
integration and is the stage-close/CI command.

The static gate builds before it lints, typechecks, analyzes architecture, or tests, because
workspace packages resolve only through their `exports` map into `dist`. That ordering is the
reproducibility contract: the gate must pass starting from `pnpm install --frozen-lockfile` on a
worktree that has never been built. It is declared in the `rootGate` block of
`.agent/build-test-infrastructure.json` and mechanically enforced by
`pnpm validate:build-test-infrastructure`. Stage evidence recorded from a pre-built worktree only
does not satisfy the gate.

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
