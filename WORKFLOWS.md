# Workflow Index

Workflows define procedure under `AGENTS.md`, repository governance, and the Agent Operating
System. Select them through `.agent/agent-operating-system.json`; do not infer a new workflow from
conversation memory.

## Product and capability delivery

- `new-engine` — create or extend a shared capability owner.
- `new-component` — execute exactly one standard public-component stage.
- `complex-widget` — add subsystem-grade internal slices while preserving one public stage.
- `composed-artifact` — build one Pattern, Block, or Template from supported lower layers.
- `new-theme` — add or evolve an independent theme through token contracts.

## Analysis and certification

- `reference-baseline` — pin reproducible local public documentation.
- `reference-sync` — review upstream reference changes without silent scope expansion.
- `reference-to-spec` — produce an independent specification from observable behavior.
- `parity-audit` — certify feature and cross-cutting parity evidence.
- `phase-certification` — certify a completed phase before progression.

## Change and repair

- `bug-fix` — reproduce and repair a defect at its owner layer.
- `accessibility-fix` — repair semantic or interaction accessibility.
- `performance-regression` — investigate a measured regression.
- `documentation` — create executable product documentation.
- `migration` — manage deprecated or breaking supported behavior.

## Governed escalation

- `dependency-proposal` — evaluate an external runtime dependency.
- `architecture-change` — change frozen architecture deliberately.
- `security-review` — review a security-sensitive stage or change.
- `toolchain-upgrade` — upgrade development or framework tooling safely.
- `release` — prepare a governed release.

All 20 workflows live under `.agent/workflows/`. Each declares purpose, entry conditions,
procedure, records, hard gates, and exit. The validator ensures every workflow is reachable from a
task class, operation, or modifier and that the catalog contains no undocumented workflow.
