# Workflow: security-review

## Purpose
Review a security-sensitive stage/change.

## Entry conditions
- Active scope known.
- Governing policies/skills loaded.

## Procedure
1. identify trust boundaries.
2. enumerate sources/sinks.
3. define validation/escaping/authorization.
4. add negative tests.
5. document CSP/provider/file constraints.
6. record residual risk.

## Required records
- evidence and affected stage/platform domain
- tests/validators
- decisions/debt

## Hard gates
- no unreviewed dangerous sink.
- security findings block parity when material.

## Exit
Update authoritative status/evidence and stop.
