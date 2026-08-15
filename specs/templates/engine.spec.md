# Engine Specification: \<Capability>

Use this template for every shared engine and every capability-owning Phase 0 foundation stage.
Foundation specifications live under `specs/foundation/` and are bound to their stage by
`.agent/foundation-specifications.json`.

Do not create a generic engine without concrete consumers or a demonstrated reuse need. An engine
exists so several owners stop reimplementing the same rules, not to complete a layer diagram.

## Required header

```text
Stage: `F0.NN`
Status: approved | implemented
```

`approved` while the stage is `not-started` or `in-progress`; `implemented` once it is `complete`.
`pnpm validate:foundation-specs` rejects a status that contradicts the stage ledger.

## Scope and ownership

Name the owning package, the concrete consumers that justify it, and what this engine explicitly
does not own. State that it introduces no public component, runtime dependency, or later-stage
capability when that is true. Required in every specification.

## Capability contracts

One section per owned capability. For each: the public shape, the invariants, the validated inputs,
the error type and stable code raised on violation, the deterministic ordering guarantee, and the
mutation/immutability policy. Describe behavior, not implementation.

State what the caller owns. An engine that quietly assumes caller behavior has an unspecified
contract, not a simple one.

## Accessibility and interaction requirements

What the engine does own (for example focus arbitration or keyboard intent), and what remains the
consuming component's obligation: roles, accessible names, states, keyboard tables, focus entry and
restoration, announcements, disabled and read-only semantics, target size, pointer and touch, IME
composition, forced colors, reduced motion, zoom and reflow, RTL.

State plainly when the engine renders no semantics. Never imply that reusing it satisfies a
component's accessibility gate.

## Security and trust boundaries

Classify every input as trusted caller code or untrusted data. Name the validation performed before
processing, and the sinks that are absent: HTML, URL, SVG, CSS, dynamic code, storage, network,
clipboard, files, serialization, prototype writes.

Name what the engine cannot guarantee — caller getters, comparers, callbacks, keyframes — so the
boundary is explicit rather than assumed.

## SSR, hydration, and RSC

Module-evaluation safety, which operations require a browser object and how it is supplied, whether
any client directive exists, and what a server render produces. Confirm no browser global, timer,
random source, current clock, locale, or storage is read at import.

## Performance characteristics

Complexity per operation, allocation and caching policy, and any deterministic large-data regression
scenario with its dataset, ceiling, environment, and recorded result. Record the budget in
`.agent/performance-budgets.md`. Never publish an unqualified universal timing claim.

## Compatibility and integration

Public or internal status, export surface, runtime dependencies, type independence from third-party
packages, production evidence host, browser matrix, and how a change coordinates with consumers.

## Test contract

The layer that owns each guarantee: Node contracts for repository wiring, Vitest for pure logic and
invariant failures, the production browser matrix for anything involving DOM, focus, input, or
hydration. Name the large-data or stack-safety scenario when one applies.

## \<Next stage> boundary

Close by naming what this stage leaves to another owner, and which stage owns it. The closing
heading is `## F0.NN boundary` naming the _next_ stage, or `## Stage boundary` when no successor
foundation stage exists. A self-referential boundary is rejected by the validator.
