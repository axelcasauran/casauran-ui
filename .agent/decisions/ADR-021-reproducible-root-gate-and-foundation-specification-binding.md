# ADR-021: Reproducible root gate ordering and foundation specification binding

Status: Accepted
Date: 2026-08-15
Approved by: maintainer-directed governance remediation
Supersedes: no prior decision; extends ADR-999 enforcement and follows the ADR-020 remediation
precedent

## Context

ADR-999 freezes architecture and requires an accepted decision, impact analysis, and migration for
any change to an accepted contract. Two Phase 0 contract surfaces were repaired on 2026-08-15
following the audit recorded in `.agent/reviews/2026-08-15-foundation-audit.md`. Both repairs change
contracts owned by completed foundation stages, so they need a decision record rather than a commit
message.

The first surface is the root gate. `validate:static` ran
`verify:scaffold → format → lint → typecheck → architecture → test → build`, while every workspace
package resolves only through its `exports` map into `dist`. Nothing produced `dist` before the
steps that resolve cross-package specifiers: there is no `prepare` script, no TypeScript `paths` or
project references, and no Vitest alias to `src`. The gate therefore passed only on a worktree that
already held output from an earlier build.

The second surface is the foundation specification lifecycle. `scripts/validate-specs.mjs` mapped
only `registry/components/*.json` lifecycle to `specs/components/`. Nothing bound a foundation
specification's declared status to its stage status, so seven of fourteen contracts still read as
unbuilt after their stages closed, across five inconsistent status wordings.

## Evidence

On a frozen-lockfile install with no prior build:

```text
packages/overlay typecheck: src/focus-scope.ts(1,47): error TS2307:
  Cannot find module '@casauran-internal/accessibility'

Test Files  4 failed | 12 passed (16)
Tests       97 passed (97)
```

`.github/workflows/ci.yml` runs exactly checkout → `pnpm install --frozen-lockfile` →
`pnpm exec playwright install` → `pnpm validate`, so it could not have been green on a fresh
runner. Every `pnpm validate — PASS` recorded in the F0.05–F0.18 ledgers, and the Phase 0
certification, was produced on a pre-built worktree.

All 35 governed validators passed while both defects were present. The gate could not observe its
own ordering, and the specification lifecycle had no mechanical owner. Both are enforcement gaps,
not judgement failures by the stages that closed under them.

## Options

1. **Reorder the gate and document the precondition.** Smallest change. Leaves the ordering as a
   convention in one shell string, so the defect regresses the next time a step is added.
2. **Reorder the gate, declare the ordering in the F0.04 contract, and enforce it mechanically.**
   Adds a contract block and validator branch. The ordering becomes checkable, and a future step
   that resolves cross-package specifiers must be declared.
3. **Add a development resolution condition** — TypeScript project references, an `exports`
   development condition, or a Vitest alias to `src` — so no step needs `dist`. Best local
   iteration. Rejected: it changes what the unit layer exercises. The unit layer would test source
   while the published artifact is `dist`, leaving the browser layer as the only check on emitted
   output. A gate-ordering defect must not silently narrow test coverage. It would also contradict
   the build/test contract, which pins each library root export to `./dist/index.js`.

For the specification lifecycle the alternatives were leaving status as prose convention, or
binding it to the stage ledger with a governed vocabulary. Prose convention is what produced the
drift.

## Decision

Adopt option 2 for the root gate, and bind foundation specification status to stage status.

**Root gate.** The static gate order is fixed and declared:

```text
verify:scaffold → format → build → lint → typecheck → architecture → test
```

`pnpm validate` remains `validate:static → test:e2e`. `.agent/build-test-infrastructure.json` gains
a required `rootGate` block declaring both sequences, the steps that consume compiled output, and
the rationale. `scripts/build-test-infrastructure.mjs` compares both root gate scripts against the
declared sequences character for character, requires a build step, and fails when any declared
compiled-output consumer is ordered before it. `BUILD_TEST_INFRASTRUCTURE.md` gains a required
`## Root gate ordering` section.

A gate result obtained on a worktree that already held build output is no longer acceptable stage
evidence.

**Foundation specifications.** `.agent/foundation-specifications.json`, with its schema, binds each
of the eighteen Phase 0 stages to its specification or records why it owns none, and declares a
closed two-value status vocabulary: `approved` while the stage is `not-started` or `in-progress`,
`implemented` once it is `complete`. Every specification opens with the governed two-line header:

```text
Stage: `F0.NN`
Status: approved | implemented
```

`pnpm validate:foundation-specs` enforces the binding, the vocabulary, minimum structural depth,
and a closing section that names what the stage leaves to another owner.

Two existing validators were extended under the same principle, without new contracts:
`pnpm validate:stages` derives stage and accepted-decision counts from `.agent/stages/index.json`
and `.agent/decisions/` and rejects a stale published mirror; `pnpm validate:registry` binds
capability status to shipped source.

## Architectural impact

- No new runtime dependency, package, public API, component, test runner, bundler, browser engine,
  host, or hosted service. This is not a toolchain adoption.
- The published `exports` contract is unchanged. The unit layer still exercises compiled output, so
  the tested artifact remains the published artifact.
- Governed validators move from 35 to 36; Node contract tests from 101 to 119.
- Dependency direction, package layering, client boundaries, and the browser matrix are unaffected.
- The browser layer was never affected by the ordering defect: `test:e2e` always ran after
  `validate:static`, which built in both the old and new orders. Recorded browser evidence in the
  stage ledgers stands.

## Consequences

- `pnpm typecheck`, `pnpm lint`, `pnpm architecture`, and `pnpm test:unit` are not standalone entry
  points on a fresh clone. Run `pnpm build` once after install, or run the gate. This is documented
  in `BUILD_TEST_INFRASTRUCTURE.md`, `QUALITY_GATES.md`, and `README.md`.
- CI is unchanged in shape and now passes from `pnpm install --frozen-lockfile` with no prior build.
- Phase 0 certification recorded before 2026-08-15 is superseded. Re-certification runs
  `pnpm validate` on the pinned Node 24.18.0 toolchain with the three Playwright engines, starting
  from a worktree with no build output. `.agent/status.md` records the condition and blocks `1.03`
  until a result exists.
- Future foundation specifications must carry the governed header and close by naming the next
  owner. Adding a specification status beyond `approved` and `implemented` is a contract change.
- Historical stage ledgers are not rewritten. Per `.agent/protocol.md` §7 the remediation is
  recorded in `.agent/reviews/2026-08-15-foundation-remediation.md` and `.agent/status.md`, and the
  F0.04, F0.10, and F0.17 ledgers keep their original evidence unchanged.
- Security, accessibility, packaging, and performance surfaces are unchanged by this decision. The
  focus-scope containment repair shipped in the same remediation is an ordinary defect fix under the
  bug-fix workflow, not part of this decision.

## Rollout / rollback

Rolled out in one remediation commit on `claude/foundation-specs-review-12efh0`, proven by deleting
`packages/*/dist` and `apps/*/.next` and running `pnpm validate:static` to a zero exit: 36
validators, 27 library builds and 4 production hosts with output verification, lint, three
typecheck scopes, dependency-cruiser, 119 Node contract tests, and 116 Vitest tests.

Both halves are additive and independently reversible. Rolling back the gate means restoring the
previous `validate:static` string and removing the `rootGate` block, its schema requirement, the
validator branch, and its five rejection tests. Rolling back the specification binding means
removing `.agent/foundation-specifications.json`, its schema, the validator, its registration, and
its thirteen tests; the governed headers may remain as prose.

Rolling back the gate reintroduces a non-reproducible root gate and invalidates the reproducibility
claim in `BUILD_TEST_INFRASTRUCTURE.md`, so it requires a replacement mechanism rather than a bare
revert.

## Revisit trigger

Measured evidence that build-first ordering materially harms iteration time, or a governed decision
to adopt a development resolution condition that makes `dist` unnecessary — which would first
require re-deciding what the unit layer exercises and how emitted output is covered.

For the specification binding: a genuine need for a status beyond `approved` and `implemented`, such
as a deprecated or superseded foundation contract.
