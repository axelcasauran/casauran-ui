# Handbook Index

## Start here

- `GOVERNANCE.md` — repository ownership, change classification, review, and stage evidence.
- `MECHANICAL_GOVERNANCE.md` — owned validator inventory, execution rules, and gate linkage.
- `BUILD_TEST_INFRASTRUCTURE.md` — reproducible builds, test layers, hosts, artifacts, and CI.
- `README.md` — product objective and repository entry point.
- `AGENTS.md` — governing constitution for humans and AI.
- `AI_AGENT_OPERATING_MODEL.md` — model-neutral task routing, lifecycle, and handoff contract.
- `.agent/protocol.md` — invariant execution procedure.
- `ARCHITECTURE.md` — capability ownership, layers, packaging and runtime architecture.
- `BOOTSTRAP.md` — first local development steps.
- `IMPLEMENTATION_STRATEGY.md` — product sequencing rationale.
- `.agent/PROMPT_PLAN.md` — exact phase/stage execution plan.

## Reference and parity

- `KENDO_REFERENCE_POLICY.md`
- `KENDO_FEATURE_COMPARISON.md`
- `PARITY_DEFINITION.md`
- `PLATFORM_PARITY.md`
- `REFERENCE.md`
- `reference/kendo-react-baseline.json`
- `reference/reference-map.json`
- `.agent/feature-matrix.md`
- `.agent/reference-map.md`

## Architecture and product policies

- `DEPENDENCY_POLICY.md`
- `DEPENDENCY_GRAPH.md`
- `PACKAGE_POLICY.md`
- `PUBLIC_API_POLICY.md`
- `API_GOVERNANCE.md`
- `COMPONENT_COMPOSITION_RULES.md`
- `ADAPTER_ARCHITECTURE.md`
- `DATA_ARCHITECTURE.md`
- `INTEGRATION_ARCHITECTURE.md`
- `TOKEN_ARCHITECTURE.md`
- `THEME_POLICY.md`
- `CSS_ARCHITECTURE.md`
- `NEXTJS_COMPATIBILITY.md`
- `COMPATIBILITY.md`
- `BROWSER_SUPPORT.md`
- `ACCESSIBILITY_POLICY.md`
- `SECURITY_ARCHITECTURE.md`
- `PERFORMANCE_POLICY.md`

## Quality and lifecycle

- `DEFINITION_OF_DONE.md`
- `QUALITY_GATES.md`
- `TESTING_POLICY.md`
- `TESTING_STRATEGY.md`
- `BUILD_TEST_INFRASTRUCTURE.md`
- `DOCUMENTATION_POLICY.md`
- `RELEASE_POLICY.md`
- `RELEASE_STRATEGY.md`
- `VERSIONING.md`
- `SUPPORT_POLICY.md`
- `MIGRATION` guidance through workflows and API governance.
- `CHANGE_MANAGEMENT.md`
- `EXPERIMENTAL_POLICY.md`
- `LICENSING.md`
- `SECURITY.md`

## AI operating system

- `AI_AGENT_OPERATING_MODEL.md`
- `.agent/agent-operating-system.json`
- `.agent/agent-operating-system.schema.json`
- `.agent/protocol.md`
- `.agent/status.md`
- `.agent/roadmap.md`
- `.agent/stages/`
- `.agent/prompts/`
- `.agent/workflows/`
- `.agent/decisions/`
- `skills/`

## Machine-readable product truth

- `registry/components/`
- `registry/capabilities/`
- `registry/platform/`
- `registry/patterns/`
- `registry/blocks/`
- `registry/templates/`
- `registry/schemas/`
- `registry/derived/`

## Specification and review templates

Repository governance is machine-readable in `.agent/repository-governance.json` with its schema
beside it. Agent routing is machine-readable in `.agent/agent-operating-system.json`. GitHub path
ownership mirrors those contracts in `.github/CODEOWNERS`. Mechanical enforcement is
machine-readable in `.agent/mechanical-governance.json` with its schema beside it.
Build/test topology is machine-readable in `.agent/build-test-infrastructure.json` with its schema
beside it.

- `specs/templates/`
- `templates/component-dna/`
- `templates/api/`
- `templates/docs/`
- `templates/reviews/`

## Mechanical enforcement

- `scripts/verify-scaffold.mjs`
- `scripts/validate-repository-governance.mjs`
- `scripts/validate-agent-operating-system.mjs`
- `scripts/validate-mechanical-governance.mjs`
- `scripts/validate-build-test-infrastructure.mjs`
- `scripts/verify-build-output.mjs`
- architecture/registry/reference/composition/package/public-API/toolchain/platform validators
- `dependency-cruiser.config.cjs`
- strict TypeScript
- ESLint
- Vitest
- Playwright
- GitHub Actions
- Changesets

## Development hosts

- `apps/docs`
- `apps/playground`
- `apps/showcase`
- `apps/visual-tests`

The handbook is intentionally redundant in navigation but not in source of truth: where details conflict, follow the authority hierarchy in `AGENTS.md`.
