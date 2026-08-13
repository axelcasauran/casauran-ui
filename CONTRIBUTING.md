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

Token changes begin in `registry/tokens/foundation.json`. Run `pnpm generate:tokens`, review the
public identifier and value impact, and run `pnpm validate:tokens`; never hand-edit generated token
source. Theme assignments and CSS runtime behavior are separate changes owned by the theme stage.

Theme mapping changes begin in `registry/themes/foundation.json`. Run `pnpm generate:theme`, review
contrast and browser/visual evidence, and run `pnpm validate:theme`. Never edit generated
`packages/theme/src/theme.css` directly or introduce proprietary theme values/selectors.

Accessibility engine changes begin with `registry/accessibility/foundation.json` and the owning
specification. Run `pnpm test:accessibility-foundation`, real-browser keyboard/focus evidence where
applicable, and `pnpm validate:accessibility-foundation`. Do not move React state, collection
registration, overlay lifecycle, or component-specific APG behavior into the foundation package.
