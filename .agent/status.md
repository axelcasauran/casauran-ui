# Program Status

Program: PHASE 0 RE-CERTIFICATION REQUIRED BEFORE PHASE 1 CONTINUES
Architecture: FROZEN
Reference baseline: PINNED AND VERIFIED
Phase 0 certification: SUPERSEDED — the 2026-08-14 PASS (`pnpm validate`; 151 browser tests passed,
2 platform-limited forced-colors checks skipped) predates both the `F0.18` close and the 2026-08-15
root-gate remediation, and was obtained on a worktree that already held build output. It does not
satisfy the reproducibility contract in `BUILD_TEST_INFRASTRUCTURE.md`.
Public component implementation: 2 OF 127 COMPLETE
Active stage: NONE
Last closed stage: `F0.18 Documentation Experience Foundation` COMPLETE (ADR-020, governed
stage/spec/registry/validator, reusable production docs shell, registry-derived metadata, migrated
Button/Icon routes, 12/12 focused docs browser checks, in-app visual review, docs production build,
and final `pnpm validate` PASS with 201 browser checks and 6 existing platform-limited skips;
2026-08-14)
Next stage: `1.03` SVGIcon (not-started) — blocked until Phase 0 re-certification records a result.

## Open remediation: 2026-08-15 Phase 0 foundation audit

Decision: `.agent/decisions/ADR-021-reproducible-root-gate-and-foundation-specification-binding.md`

A read-only audit of `specs/foundation` (`.agent/reviews/2026-08-15-foundation-audit.md`) found the
static gate ordered `typecheck` and `test` before `build`, while every workspace package resolves
only through its `exports` map into `dist`. On a frozen-lockfile install with no prior build,
`pnpm typecheck` failed in `packages/overlay` and 4 of 16 Vitest suites failed to load. The gate has
been reordered to build first, the ordering is now declared in the `rootGate` block of
`.agent/build-test-infrastructure.json`, and `pnpm validate:build-test-infrastructure` fails if any
declared compiled-output consumer is ordered before the build step.

Remediation applied 2026-08-15, without rewriting historical stage evidence:

- root gate reordered and mechanically guarded; `BUILD_TEST_INFRASTRUCTURE.md` and
  `QUALITY_GATES.md` record the ordering rule and its reproducibility rationale;
- foundation specification status bound to stage status through
  `.agent/foundation-specifications.json` and `pnpm validate:foundation-specs`; seven specifications
  that still read as unbuilt were corrected and the status vocabulary was governed;
- stage inventory mirrors reconciled against `.agent/stages/index.json` and enforced by
  `pnpm validate:stages`;
- capability status bound to shipped source by `pnpm validate:registry`; `events` and `icons` moved
  from `planned` to `implemented`;
- `specs/foundation/reference-baseline.md` self-referential boundary heading corrected;
- overlay focus-scope fallback targets outside the scope root are now ignored on every path, with
  production browser evidence added;
- performance budgets, ownership records, handbook indices, and README status reconciled.

Required to close: run `pnpm validate` on the pinned Node 24.18.0 toolchain with the three
Playwright engines installed, starting from `pnpm install --frozen-lockfile` on a worktree with no
prior build output. Record the result through the phase-certification workflow and replace the
`Phase 0 certification` line above.

Second blocker, found by execution on 2026-08-15 and recorded in
`.agent/reviews/2026-08-15-foundation-completeness.md`: all 15 committed visual baselines carry the
`-win32` suffix while `.github/workflows/ci.yml` runs `ubuntu-latest`. Playwright resolves baselines
per platform, so every visual assertion fails on CI. Re-certification must regenerate the five
snapshot names across chromium, firefox and webkit on the CI platform and review each image as
evidence before the browser gate can be green.

**The repository gate is deliberately RED on this blocker.** `pnpm validate:visual-baselines` was
added on request as the 37th governed validator, so `pnpm verify:scaffold`, `pnpm validate:static`
and `pnpm validate` now fail fast with the exact missing set instead of surfacing it only after a
full browser run. The failure is real and previously hidden, not a regression introduced by the
validator. It clears in one step:

```bash
# on ubuntu-latest, or a container matching it
pnpm exec playwright test --update-snapshots   # then review each image as evidence
```

Every other gate is green: 37 validators minus this one, 129 Node contract tests, 117 Vitest tests,
and a clean-worktree build, lint, typecheck and architecture pass.

Verification coverage on 2026-08-15: 36 validators, 119 contract tests, 117 Vitest tests, and a
clean-worktree `pnpm validate:static` all PASS; the Chromium browser suite ran 65 passing with 5
failures, every one a missing Linux baseline and none behavioural. Firefox and WebKit remain unrun.

Update only through stage/phase close workflow. BLOCKED phases cannot roll forward.

Reference access mode: LOCAL-ONLY
Reference path: `kdocs/references/kendo-react-docs/docs/content`
Reference snapshot: `2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`
