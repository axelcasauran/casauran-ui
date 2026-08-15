# Skill: reference-analysis

## When to load

Use for analyzing approved public behavioral references.

## Preconditions

- Read `AGENTS.md`.
- Read active stage ledger.
- Load relevant policies and accepted ADRs.
- If implementation has begun, work from the approved independent specification.

## Hard rules

- behavior not implementation.
- pin provenance.
- separate observed facts from design choices.

## Analysis checklist

- features.
- states.
- interaction.
- keyboard.
- a11y.
- adaptive.
- i18n/RTL.
- SSR/integration.
- edge cases.

## Enterprise dimensions

Explicitly decide applicability of functionality, typing/API consistency, accessibility, keyboard/touch/IME, security, performance, theming/density, RTL/i18n, SSR/hydration/RSC, responsive/adaptive behavior, integration and documentation.

## Implementation discipline

- Identify owning capability/package before code.
- Reuse shared behavior without speculative abstraction.
- Keep public API provider-independent.
- Add regression coverage for discovered edge cases.
- Preserve one-public-component stage boundary.

## Forbidden shortcuts

- Copy reference implementation details.
- Weaken types/tests/validators.
- Add external runtime dependency outside dependency workflow.
- Complete a stage with undocumented or untested behavior.
- Begin another public component.

## Required records

Update the target spec/registry/stage evidence, tests and docs relevant to this skill.

## Definition of Done

Domain checklist and applicable project Definition of Done gates pass; `pnpm validate` succeeds; evidence is recorded.

## Local reference resolution

1. Read `reference/local-reference.json`.
2. Resolve `CASAURAN_KENDO_DOCS_PATH`; default to `kdocs/references/kendo-react-docs/docs/content`.
3. Run `pnpm reference:check`.
4. Inventory only the relevant component/domain directory.
5. Read targeted files; never load the entire documentation corpus merely because it is local.
6. Record every relative document path examined.
7. Do not use the online GitHub repository or live web documentation as fallback.
8. If validation fails, mark the work BLOCKED.

The production implementation should primarily consume the resulting independent Casauran spec, not continuously re-read competitor documentation.
