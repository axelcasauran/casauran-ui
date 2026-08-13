# Skill: spreadsheet

## When to load
Use for Spreadsheet.

## Preconditions
- Read `AGENTS.md`.
- Read active stage ledger.
- Load relevant policies and accepted ADRs.
- If implementation has begun, work from the approved independent specification.

## Hard rules
- not customized Grid.
- formula/workbook/selection/history/rendering distinct.
- clipboard/import untrusted.

## Analysis checklist
- workbook.
- sheets.
- cells.
- formula.
- format.
- selection.
- clipboard.
- history.
- virtualization.
- import/export.

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
