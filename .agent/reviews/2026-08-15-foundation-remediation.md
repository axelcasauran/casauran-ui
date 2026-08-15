# Foundation Remediation: 2026-08-15

Companion to `.agent/reviews/2026-08-15-foundation-audit.md`. The audit is a point-in-time
read-only record and is not edited. This document records what was repaired, what guard now
prevents the recurrence, and what remains open.

The two contract changes — root gate ordering and foundation specification binding — are accepted
by `ADR-021`. The F0.04, F0.10, and F0.17 stage ledgers are deliberately left unchanged; per
`.agent/protocol.md` §7 their original evidence stands and this record plus the ADR carry the
remediation.

Principle applied throughout: **every finding is repaired together with the mechanical check that
would have caught it.** A repaired record with no guard is a record that drifts again.

## F-1 — root gate reproducibility · FIXED

The static gate now builds before it resolves any cross-package specifier:

```text
verify:scaffold → format → build → lint → typecheck → architecture → test
```

- `package.json` `validate:static` reordered.
- `.agent/build-test-infrastructure.json` gains a `rootGate` block declaring both gate sequences,
  the steps that consume compiled output, and the rationale; schema updated to require it.
- `scripts/build-test-infrastructure.mjs` compares both root gate scripts against the declared
  sequences character for character and fails when any declared compiled-output consumer is
  ordered before the build step.
- Five rejection tests in `scripts/build-test-infrastructure.test.mjs` lock the ordering,
  the presence of a build step, sequence/script agreement, the full gate running the static gate,
  and every step existing as a package script.
- `BUILD_TEST_INFRASTRUCTURE.md` gains `## Root gate ordering`; the validator requires that
  heading. `QUALITY_GATES.md` and `README.md` state the build precondition.

**Evidence.** With `packages/*/dist` and `apps/*/.next` deleted, `pnpm validate:static` exits `0`
and every step runs in the new order: 36 validators, prettier, 27 library builds plus 4 production
Next.js hosts with output verification, eslint, three typecheck scopes, dependency-cruiser,
119 Node contract tests, 116 Vitest tests across 16 suites. Before the change the same starting
point failed at `typecheck` in `packages/overlay` and lost 4 of 16 Vitest suites.

## F-2 — foundation specification status drift · FIXED

- New contract `.agent/foundation-specifications.json` plus schema binds all 18 Phase 0 stages to
  their specification, declares the two-value status vocabulary (`approved` while the stage is
  `not-started`/`in-progress`, `implemented` once `complete`), and records why `F0.01`–`F0.04` own
  no capability specification.
- All 14 specifications now carry the governed header `Stage: \`F0.NN\``/`Status: …`, replacing
  five inconsistent wordings.
- New validator `scripts/validate-foundation-specifications.mjs` (`pnpm validate:foundation-specs`,
  registered as the 36th governed validator) rejects: a status contradicting the stage ledger, an
  ungoverned status word, a spec whose declared stage disagrees with its binding, a foundation
  stage with no binding, an unbound specification file, an exempt stage with no reason, a binding
  title disagreeing with the ledger, a shallow specification, a missing closing boundary section,
  and a boundary naming an unknown or self-referential stage.
- 13 rejection tests in `scripts/foundation-specifications.test.mjs`.

**New defect found by the new validator.** `specs/foundation/reference-baseline.md` closed with
`## F0.17 boundary` — its own stage. Corrected to `## Stage boundary` with an explanatory note,
since F0.17 was the last foundation stage in the approved sequence when it closed and ADR-020
inserted F0.18 later.

## F-3 — Phase 0 certification coverage · RECORDED, OPEN

`.agent/status.md` now marks the 2026-08-14 certification `SUPERSEDED` and states why: it predates
both the `F0.18` close and this remediation, and was obtained on a worktree that already held build
output. It records the remediation, and the exact conditions for re-certification — `pnpm validate`
on pinned Node 24.18.0 with the three Playwright engines, from `pnpm install --frozen-lockfile` on
a worktree with no prior build. `1.03` is marked blocked until that result is recorded.

This audit environment has no Playwright engine binaries, so the browser layer could not be run.
Re-certification is a maintainer action, not something this remediation can honestly claim.

## F-4 — README contradicted authoritative status · FIXED

`README.md` "Current state" now mirrors `.agent/status.md`: Phase 0 at 18 of 18 stages with
re-certification pending, 2 of 127 public components complete, next stage `1.03`. It names
`.agent/status.md` as authoritative.

## F-5 — stale stage and ADR inventory · FIXED

Reconciled to 172 stages / 18 foundation / 21 accepted decisions in `scaffold-manifest.json`,
`.agent/stages/README.md`, and `VERIFICATION_REPORT.md`. `specs/README.md` now lists all 14
foundation contracts with a stage table; `HANDBOOK_INDEX.md` gains the documentation registry, the
foundation-specification contract, and the two missing validators; `README.md` documents
`validate:documentation-experience` and `validate:foundation-specs`; `IMPLEMENTATION_STRATEGY.md`
includes the documentation foundation and the ADR-020 remediation precedent.

**Guard.** `scripts/validate-stages.mjs` now derives foundation, total, and accepted-decision
counts from `.agent/stages/index.json` and `.agent/decisions/`, and fails when
`scaffold-manifest.json`, `.agent/stages/README.md`, or `VERIFICATION_REPORT.md` publishes a stale
number, or when `.agent/PROMPT_PLAN.md` omits a foundation stage.

## F-6 — capability registry stale · FIXED

`events` and `icons` moved from `planned` to `implemented` with their real consumer
(`packages/react`).

**Guard.** `scripts/validate-registry.mjs` now validates every capability entry: schema keys,
allowed status, owner paths resolving to real workspace packages (multi-owner supported), and
consumer paths existing. A capability named after its own package may not be `planned` once that
package ships non-placeholder source, and a capability may not be `implemented` when no owner
package ships source. Stub packages are recognised by the exact `export {};` placeholder, so
`positioning`, `commands`, `formula` and the other reserved owners correctly stay `planned`.

## F-7 — token contract described an empty component layer · FIXED

`specs/foundation/tokens.md` now states that F0.05 opens the component layer and shipped it empty,
and that entries added later belong to their component stage's evidence. The `Public API contract`
section no longer calls `componentTokens` empty. The emission-location design choice made during
1.01 is recorded in the audit as an observation.

## F-8 — incomplete performance budgets · FIXED

`.agent/performance-budgets.md` gains the missing F0.12 entry and a recorded result plus
environment for F0.12, F0.15 and F0.16 (21.94 ms, 174.47 ms, 870.64 ms on Node v24.18.0), each with
its benchmark command. It states that a ceiling without a recorded result is an incomplete budget.

## F-9 — no governed engine specification template · FIXED

`specs/templates/engine.spec.md` is now a complete template covering the governed header, scope and
ownership, capability contracts, accessibility, security and trust boundaries, SSR/hydration/RSC,
performance, compatibility, the test contract, and the closing stage boundary. `block.spec.md`,
`pattern.spec.md` and `template.spec.md` were also promoted from one-line stubs to real templates,
so `specs/README.md`'s instruction to "use the complete templates" is now true.

## F-10 — no documentation route for shipped public packages · OPEN BY DESIGN

`@casauran/tokens`, `@casauran/theme` and `@casauran/icons` still have no `apps/docs` route.
`specs/foundation/documentation-experience.md` scopes docs routes to completed public component
stages, so adding them now would start undeclared work outside any stage. This needs a scope
decision — extend the F0.18 boundary by ADR, or open a follow-up stage — before it is built.

## F-11 — focus-scope containment · FIXED

`packages/overlay/src/focus-scope.ts` now resolves entry and fallback targets through a shared
`resolveContainedTarget` helper on both paths, so a fallback outside the scope root can no longer
take focus out of a trapping scope during the zero-tabbable `Tab` branch.

Production browser evidence added: the overlay probe gains a layer that declares an out-of-root
entry and fallback target and contains no tabbable descendant; the new case asserts focus lands on
the scope root, never on the outside target, on activation and after `Tab`, and restores to the
trigger on dismissal. **This case has not been executed** — the environment has no Playwright
engines. It runs with Phase 0 re-certification.

## F-12 — ownership gaps · FIXED

`.agent/repository-governance.json` gains `/packages/events/**`, `/packages/icons/**`,
`/registry/capabilities/**`, `/specs/README.md`, and `/.agent/foundation-specifications*.json`.
`.github/CODEOWNERS` regenerated from the contract; `pnpm validate:governance` confirms the mirror.

## Component stage prompt

`.agent/prompts/component-stage.md` replaced with a full 36-section execution contract. The
submitted draft was structurally sound and its principles were kept. It was rewritten against
repository fact: real artifact paths, the actual `registry/components/<slug>.json` fields, the
established stage-ledger sections, the routed skills and workflows, the `apps/docs` primitives, the
generated artifacts that must be regenerated, the capability-registry obligation, the recorded
performance-budget requirement, and the new build-before-resolve gate precondition.

## Summary

| Finding | State           |
| ------- | --------------- |
| F-1     | fixed, proven   |
| F-2     | fixed, guarded  |
| F-3     | recorded, open  |
| F-4     | fixed           |
| F-5     | fixed, guarded  |
| F-6     | fixed, guarded  |
| F-7     | fixed           |
| F-8     | fixed           |
| F-9     | fixed           |
| F-10    | open by design  |
| F-11    | fixed, unproven |
| F-12    | fixed           |

Validators: 35 → 36. Node contract tests: 101 → 119. Vitest: 116 across 16 suites, unchanged in
count and now reachable from a clean checkout. Browser layer: unrun in this environment.
