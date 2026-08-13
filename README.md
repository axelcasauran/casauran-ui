# Casauran UI

Independent enterprise-grade React UI platform with capability coverage benchmarked against the approved public KendoReact documentation baseline.

## Current state

- Architecture: frozen before development.
- Reference baseline: `6a05c926c4f08b89782c25336fc159fea3a3f26b` captured 2026-08-13.
- Public component stages: 127.
- Product implementation: not started.
- First engineering work: Phase 0 Product Foundation.
- First public component after Phase 0: Button.

## Read first

1. `AGENTS.md`
2. `GOVERNANCE.md`
3. `MECHANICAL_GOVERNANCE.md`
4. `BUILD_TEST_INFRASTRUCTURE.md`
5. `AI_AGENT_OPERATING_MODEL.md`
6. `.agent/protocol.md`
7. `ARCHITECTURE.md`
8. `PARITY_DEFINITION.md`
9. `BRANDING.md`
10. `NAMING_CONVENTIONS.md`
11. `KENDO_REFERENCE_POLICY.md`
12. `DEPENDENCY_POLICY.md`
13. `COMPONENT_COMPOSITION_RULES.md`
14. `.agent/PROMPT_PLAN.md`
15. `.agent/roadmap.md`
16. `.agent/status.md`

## Source-of-truth order

Accepted ADRs → AGENTS non-negotiables → architecture/policies → registry/schemas → stage ledger → approved specs → tests → implementation → docs.

## Validation

Before installing dependencies:

```bash
node scripts/verify-scaffold.mjs
```

After bootstrap:

```bash
pnpm validate
```

Repository ownership and stage-order checks are also available directly through
`pnpm validate:governance` and `pnpm test:governance`. Agent routing coverage is verified through
`pnpm validate:agent-os` and `pnpm test:agent-os`. Validator inventory, command wiring, ownership,
read-only safety, and root-gate linkage are verified through `pnpm validate:mechanical-governance`
and `pnpm test:mechanical-governance`.

The canonical token vocabulary is validated with `pnpm validate:tokens`, regenerated with
`pnpm generate:tokens`, and documented in `TOKEN_ARCHITECTURE.md`.

Static light/dark and comfortable/compact theme behavior is regenerated with
`pnpm generate:theme`, validated with `pnpm validate:theme`, and documented in `THEME_POLICY.md` and
`CSS_ARCHITECTURE.md`.

The internal accessibility foundation is validated with `pnpm validate:accessibility-foundation`
and documented in `ACCESSIBILITY_POLICY.md` and `specs/foundation/accessibility.md`.

The React state foundation is validated with `pnpm validate:react-state-foundation`, tested with
`pnpm test:react-state-foundation`, and documented in `specs/foundation/react-state.md` and the
`@casauran/react` package README.

The framework-neutral collection engine is validated with `pnpm validate:collection-engine`,
tested with `pnpm test:collection-engine`, and documented in
`specs/foundation/collection-engine.md` and the internal collections package README.

The internal overlay foundation is validated with `pnpm validate:overlay-foundation`, tested with
`pnpm test:overlay-foundation`, and documented in `specs/foundation/overlay.md` and the internal
overlay package README.

Build/test topology and output wiring are checked with `pnpm validate:build-test-infrastructure`
and `pnpm test:build-test-infrastructure`. Unit tests run once through `pnpm test:unit`; production
SSR/hydration/browser checks run through `pnpm test:browser`.

## Local KendoReact documentation prerequisite

Place the external documentation corpus beside the repository and configure:

```bash
CASAURAN_KENDO_DOCS_PATH=../references/kendo-react-docs/docs/content
pnpm reference:check
```

Normal component/reference analysis is local-only. There is no online fallback.
