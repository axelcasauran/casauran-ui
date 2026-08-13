# Workflow: reference-sync

## Purpose
Review upstream changes without silent scope expansion.

## Entry conditions
- Active stage/phase known.
- Governing policies and relevant skills loaded.
- Acceptance criteria established.

## Procedure
1. fetch new upstream commit.
2. diff inventory.
3. classify additions/changes/removals.
4. create parity backlog.
5. approve/defer each change.
6. move baseline after approval.

## Records
- affected stage/phase
- decisions/evidence
- tests/validators
- debt/follow-up

## Hard gates
- active stages do not mutate silently.

## Exit
Update authoritative registry/stage/status and stop at workflow boundary.
