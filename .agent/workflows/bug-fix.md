# Workflow: bug-fix

## Purpose

Repair at owning layer.

## Entry conditions

- Active stage/phase known.
- Governing policies and relevant skills loaded.
- Acceptance criteria established.

## Procedure

1. reproduce.
2. locate contract owner.
3. add failing regression.
4. fix minimally.
5. run dependent tests.
6. update docs if contract changed.

## Records

- affected stage/phase
- decisions/evidence
- tests/validators
- debt/follow-up

## Hard gates

- no weakened tests.

## Exit

Update authoritative registry/stage/status and stop at workflow boundary.
