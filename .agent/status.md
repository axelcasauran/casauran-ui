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
Last closed stage: `F0.19 Documentation Interaction Foundation` COMPLETE (ADR-024, governed topic
model and schema, 23 generated component topic routes with deep-link continuity, nested topic
navigation, interactive example islands whose published source is read from the module that renders
them, migrated Button and Icon content, 5/5 Chromium docs behavioural checks with both visual
baselines regenerated and reviewed, and a recorded island bundle budget; Firefox and WebKit were
unavailable in that environment so `pnpm validate` was not run to completion; 2026-08-15). Previous:
`F0.18 Documentation Experience Foundation` COMPLETE (ADR-020; 2026-08-14).
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
validator. As of the 2026-08-16 Icon revalidation the missing set is 11 rather than 12: the Icon
Chromium baseline is committed and reviewed, and the Button and docs-shell Chromium baselines were
regenerated and reviewed because that revalidation changed what they render. Every remaining miss
needs either a Firefox or WebKit engine that no available environment can install, or belongs to the
`theme-runtime` Phase 0 fixture, which no component stage should accept evidence for. It clears in
one step:

```bash
# on ubuntu-latest, or a container matching it
pnpm exec playwright test --update-snapshots   # then review each image as evidence
```

Every other gate is green: 38 validators minus this one, 144 Node contract tests, 122 Vitest tests,
and a clean-worktree build, lint, typecheck and architecture pass.

Verification coverage on 2026-08-15: 36 validators, 119 contract tests, 117 Vitest tests, and a
clean-worktree `pnpm validate:static` all PASS; the Chromium browser suite ran 65 passing with 5
failures, every one a missing Linux baseline and none behavioural. Firefox and WebKit remain unrun.

## Closed remediation: 2026-08-16 Icon capability revalidation

Decision: `.agent/decisions/ADR-022-component-capability-revalidation.md` and
`.agent/decisions/ADR-023-documentation-feature-coverage.md`
Record: `.agent/reviews/2026-08-16-icon-revalidation.md`
Ledger: the `## Revalidation — 2026-08-16` section of `.agent/stages/1.02-icon.md`

`1.02 Icon` was revalidated in place against the current component-stage rules; its original
COMPLETE record is unchanged and the registry entry advanced `parity-verified → improved`. It was
the last entry on both governed debt lists: `.agent/capability-completeness.json` now reports 2 of 2
audited components with 0 awaiting revalidation, and `registry/documentation/foundation.json` has no
`pendingCoverage` entry. Neither list was cleared by editing a document — the reference analysis was
re-run and the previews were built.

The reference analysis grew from 8 examined paths to 31, the parity document from nine lines of
prose to 38 rows each carrying a governed disposition, and the documentation route from 5 topics
with one example to 10 topics with seven. Four capability families had never been examined at all:
the application-level icon provider, drawing variants, the class-replacement unstyled mode, and the
two consumption modes with the migration and CSP reasoning behind them.

Pulling that thread found five defects in shipped behaviour, each now fixed with a guard:
`tone="inherit"` painted the theme's primary text colour instead of `currentColor`, so an Icon
composed into a solid Button rendered dark artwork on a saturated fill; a blank `label` published an
image with an empty accessible name; `tabIndex` passed through, letting an `aria-hidden` element take
a tab stop; the `info` tone resolved to the same colour as `accent`, so two public values were
indistinguishable; and the component token seam applied to the default size and tone but lost to any
explicit one. A sixth defect was in the documentation itself: `name` was typed `string`, and the
route's only example rendered a labelled empty box because the catalog had no `check` definition.
`name` is now the `IconName` catalog union, so that mistake is a build failure; `isIconName` narrows
a name that crossed a runtime boundary, and four needed definitions were added.

The `benchmarks/icon.mjs` environment-reporting obligation that the Button revalidation left to this
stage is resolved.

Revalidation coverage: 37 of 38 validators, format, lint, three typecheck scopes, dependency
architecture, 27 library builds and 4 production Next hosts, 159 contract tests, 128 Vitest tests,
and `pnpm benchmark:icon` at 137.75 ms against a 500 ms ceiling all PASS from a clean worktree on the
pinned Node 24.18.0 toolchain. The Chromium browser suite ran 81 passing with 1 failure — the
missing `theme-runtime` Linux baseline, a Phase 0 fixture this stage does not own and did not
change, and none of it behavioural. The reviewed `icon-matrix-chromium-linux.png` is committed, the
three stale `-win32` Icon baselines were
removed, and the Button and docs-shell Chromium baselines were regenerated and reviewed because this
stage's fixes changed what they render. Firefox and WebKit could not be installed in that
environment, so `pnpm validate` was not run to completion and is not claimed. It clears with the
Phase 0 re-certification above.

## Closed remediation: 2026-08-15 Button capability revalidation

Decision: `.agent/decisions/ADR-022-component-capability-revalidation.md`
Record: `.agent/reviews/2026-08-15-button-revalidation.md`
Ledger: the `## Revalidation — 2026-08-15` section of `.agent/stages/1.01-button.md`

`1.01 Button` was revalidated in place against the current component-stage rules; its original
COMPLETE record is unchanged and the registry entry advanced `parity-verified → improved`. The
reference analysis grew from 12 to 23 examined paths, the parity document from 12 `pass` rows to 31
rows each carrying a governed disposition, and the documentation route from 6 sections to 16. One
capability gap (`size="xs"`), one geometry defect (icon-only actions were not square away from the
default size), and one contrast defect (transparent appearances painted the neutral tone's surface
colour as text) were fixed with browser guards. The Button × Icon integration obligation left open
when `1.02` closed is now evidenced.

Three repository defects were repaired in the same pass, all of which blocked the stage gate:
`pnpm lint` failed on 7,368 vendored `kdocs` reference files; `pnpm format:write` rewrote 9,164 of
them, which modifies read-only competitor material and invalidates the pinned reference digest; and
`benchmarks/button.mjs` printed a hardcoded `win32 x64` environment. The corpus is now excluded from
ESLint and Prettier with recorded rationale, and the benchmark reports its real platform.

`pnpm validate:capability-completeness` is the 38th governed validator, with
`.agent/capability-completeness.json` and 15 rejection tests. `1.02 Icon` closed under the previous
parity contract and is the single recorded `pendingRevalidation` entry; it must be closed by its own
governed revalidation, not by editing its parity document.

A second review pass — running the documentation rather than reading it — found that the route still
previewed no `outline`, `ghost` or `link` button, because nothing bound a component's declared
features to what its page renders. `ADR-023` adds `featureCoverage` to the component registry:
every declared feature is satisfied by a `preview`, a `section`, or a named `fixture`, and an
enumerated feature previews every value. `pnpm validate:documentation-experience` enforces it with
13 rejection tests plus a browser case that asserts the declared values really render; it
immediately caught three `radius` values that had never been previewed. `1.02 Icon` is the single
`pendingCoverage` entry.

`ADR-024` inserts `F0.19 Documentation Interaction Foundation` at the ledger boundary after `F0.18`,
specified in `specs/foundation/documentation-interaction.md` and **not implemented**: per-capability
routes generated from a declared topic model, an interactive example island per example, one source
of truth for example code, and deep-link continuity. `1.03` moves one place later and stays
`not-started`, so every component from `1.03` onward inherits the finished documentation model. The
`F0.18` boundary assertion was generalised from "immediately between 1.02 and 1.03" to "after 1.02
with no public component stage before 1.03" so that a governed stage can be inserted there at all.

Revalidation coverage: 37 of 38 validators, format, lint, three typecheck scopes, dependency
architecture, 27 library builds and 4 production Next hosts, 144 contract tests, 122 Vitest tests,
and `pnpm benchmark:button` at 249.14 ms against a 1,000 ms ceiling all PASS. The Chromium browser
suite ran 69 passing with 4 failures, every one a missing Linux baseline for another stage's fixture
and none behavioural; the reviewed `button-matrix-chromium-linux.png` is committed and the three
stale `-win32` Button baselines were removed. Firefox and WebKit could not be installed in that
environment, so `pnpm validate` was not run to completion and is not claimed. It clears with the
Phase 0 re-certification above.

Update only through stage/phase close workflow. BLOCKED phases cannot roll forward.

Reference access mode: LOCAL-ONLY
Reference path: `kdocs/references/kendo-react-docs/docs/content`
Reference snapshot: `2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`
