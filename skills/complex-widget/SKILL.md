# Skill: complex-widget

## When to load

Use for subsystem-grade public components with multiple interacting engines: DataGrid, TreeList, PivotGrid, Scheduler, Gantt, Editor, Chart, Diagram, Map and Spreadsheet.

## Preconditions

- Read AGENTS.md and active stage.
- Load the component's domain skill.
- Use `.agent/prompts/complex-widget.md`.
- Create the required subsystem specification set before implementation.

## Hard rules

- Keep one public component stage.
- Break implementation into internal vertical slices.
- Do not create a monolithic file/state model.
- Shared capability changes remain at their owner package.
- Each slice preserves behavior already completed.
- Architecture checkpoints occur when shared contracts change.

## Analysis checklist

- feature/subsystem map
- state/event/command flow
- canonical composition
- data identity
- keyboard/focus interaction
- virtualization/large data
- serialization/persistence
- SSR/client boundary
- security/trust boundaries
- accessibility
- performance budgets
- internal slice ordering

## Implementation discipline

Build the minimum shared contract needed by the current slices, integrate vertically, and run cross-feature regression after each subsystem milestone. Do not defer keyboard/a11y/virtualization until the end when they materially affect architecture.

## Forbidden shortcuts

- "render rows first, architecture later"
- copied reference internals
- local duplicate engines
- multiple hidden public components
- weakening tests/types to integrate slices
- claiming completion after only primary rendering

## Required evidence

Architecture/feature/state/interaction/keyboard/performance/security specs, subsystem tests, browser scenarios, parity audit and final full validation.

## Definition of Done

All component Definition of Done dimensions applicable to the complex widget pass and the stage ledger records evidence for each internal subsystem.
