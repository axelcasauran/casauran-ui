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
2. `ARCHITECTURE.md`
3. `PARITY_DEFINITION.md`
4. `BRANDING.md`
5. `NAMING_CONVENTIONS.md`
6. `KENDO_REFERENCE_POLICY.md`
5. `DEPENDENCY_POLICY.md`
6. `COMPONENT_COMPOSITION_RULES.md`
7. `.agent/PROMPT_PLAN.md`
8. `.agent/roadmap.md`
9. `.agent/status.md`

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

## Local KendoReact documentation prerequisite

Place the external documentation corpus beside the repository and configure:

```bash
CASAURAN_KENDO_DOCS_PATH=../references/kendo-react-docs/docs/content
pnpm reference:check
```

Normal component/reference analysis is local-only. There is no online fallback.
