# Workflow: reference-baseline

## Purpose

Pin reproducible public documentation.

## Entry conditions

- Active stage/phase known.
- Governing policies and relevant skills loaded.
- Acceptance criteria established.

## Procedure

1. record repository/path/commit/date.
2. inventory documentation domains.
3. generate reference map.
4. store provenance.
5. run validator.

## Records

- affected stage/phase
- decisions/evidence
- tests/validators
- debt/follow-up

## Hard gates

- baseline immutable until sync.
- no direct production-code derivation.

## Exit

Update authoritative registry/stage/status and stop at workflow boundary.

## Local-only reference requirement

This workflow operates on the external corpus resolved by `CASAURAN_KENDO_DOCS_PATH`.

Run `pnpm reference:check` first. Online fallback is prohibited. If validation fails, stop as BLOCKED.
