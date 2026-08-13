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
