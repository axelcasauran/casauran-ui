# Workflow: reference-to-spec

## Purpose

Produce independent spec from public behavior.

## Entry conditions

- Active stage/phase known.
- Governing policies and relevant skills loaded.
- Acceptance criteria established.

## Procedure

1. collect pages.
2. extract observable features.
3. separate cross-cutting requirements.
4. rewrite in our terminology.
5. define states/interactions/a11y/edge cases.
6. record provenance.
7. review for implementation leakage.

## Records

- affected stage/phase
- decisions/evidence
- tests/validators
- debt/follow-up

## Hard gates

- no copied implementation.

## Exit

Update authoritative registry/stage/status and stop at workflow boundary.

## Local-only reference requirement

This workflow operates on the external corpus resolved by `CASAURAN_KENDO_DOCS_PATH`.

Run `pnpm reference:check` first. Online fallback is prohibited. If validation fails, stop as BLOCKED.
