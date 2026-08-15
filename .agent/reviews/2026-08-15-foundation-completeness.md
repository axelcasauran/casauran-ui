# Foundation Completeness Verification: 2026-08-15

Third document in the sequence: `2026-08-15-foundation-audit.md` found,
`2026-08-15-foundation-remediation.md` repaired, this one verifies by execution and records what
remains.

The first audit could not run the browser layer. This pass could, using the Chromium build present
in the verification sandbox, so every previously unexecuted claim was tested rather than read.

## What was executed

| Layer                           | Result                                                              |
| ------------------------------- | ------------------------------------------------------------------- |
| 36 repository validators        | PASS                                                                |
| Node contract tests             | 119 / 119 PASS                                                      |
| Vitest                          | 117 / 117 PASS across 16 suites                                     |
| `pnpm validate:static`          | exit 0 from a worktree with `dist` and `.next` deleted              |
| Browser suite (Chromium)        | 65 passed, 5 failed — every failure a missing Linux visual baseline |
| `pnpm benchmark:data-engine`    | 18.48 ms against a 5,000 ms ceiling                                 |
| `pnpm benchmark:virtualization` | 328.83 ms against a 5,000 ms ceiling                                |
| `pnpm benchmark:drag-drop`      | 1,275.59 ms against a 5,000 ms ceiling                              |

Benchmarks ran on Node v22.22.2 linux/x64, not the pinned 24.18.0, so they are proof the engines
hold at scale — not budget evidence. `.agent/performance-budgets.md` keeps the pinned-runtime
figures recorded by the owning stages.

Firefox and WebKit could not run: their binaries are absent and `cdn.playwright.dev` is blocked by
the sandbox proxy. Chromium-only coverage is therefore partial by browser, complete by scenario.

## Behavioural verification

**Zero behavioural browser failures.** All 65 passing assertions cover production SSR, hydration,
portal scope, top-layer dismissal, nested focus containment and restoration, native inert
isolation, pointer capture and threshold activation, keyboard drag and cancel, touch Pointer
Events, edge autoscroll, locale fallback and RTL, deterministic formatting, theme and density
attributes, forced colors, reduced motion, and docs shell landmarks and deep links.

The F-11 repair is now proven, not merely reasoned:

```text
✓ overlay-foundation.spec.ts:88 › ignores entry and fallback targets outside the scope root
```

Every scenario named in `TESTING_POLICY.md` and the fourteen specifications was located in a real
test: the 10,000-item collection stack-safety case, the 1,000-layer overlay ordering case, the
1,000-key animation interruption case, the 100,000-row data case, the `MAX_VIRTUAL_ITEMS` bound,
hostile opaque drag payloads, DST gap and overlap, untrusted message text, caller-injected
typeahead normalization, and live-region coalescing. One claim did not hold and is F-15 below.

## F-13 — every Next.js host logged a `/favicon.ico` 404 · FIXED

No host declared an icon, so Chromium probed `/favicon.ico`, received 404, and logged a console
error on every page. That failed the `expect(runtimeErrors).toEqual([])` assertion in both
`scaffold.spec.ts` and `docs-shell.spec.ts`.

Two distinct problems, one cause:

- `apps/docs` is the canonical customer documentation application and shipped with a broken tab
  icon and a console error on every page.
- The "no console errors" assertion, used across the foundation browser probes, was
  environment-dependent: it passes on the pinned CI Chromium build and fails on others. That is a
  latent flake in the F0.04 infrastructure probe, not a property of the code under test.

Fixed by adding `app/icon.svg` to all four hosts, drawn from the existing `docs-brand-mark` visual
language — rotated mint tile, ink border and offset shadow, three-quarter ring in mint-ink, coral
accent dot — using the exact `--docs-*` values already in `apps/docs/app/globals.css`. No new
identity was invented; `BRANDING.md` is unchanged.

Confirmed by re-running the suite: the console assertion failures disappeared, 64 → 65 passing.

## F-14 — visual baselines are Windows-only while CI is Linux · OPEN, CI-BLOCKING

All 15 committed baselines carry the `-win32` suffix:

```text
button-matrix-{chromium,firefox,webkit}-win32.png
icon-matrix-{chromium,firefox,webkit}-win32.png
theme-runtime-matrix-{chromium,firefox,webkit}-win32.png
docs-shell-dark-compact-rtl-{chromium,firefox,webkit}-win32.png
docs-shell-mobile-{chromium,firefox,webkit}-win32.png
```

Playwright resolves a baseline as `<name>-<project>-<platform>.png`. `.github/workflows/ci.yml`
runs `ubuntu-latest`, so CI looks for `-linux` variants that do not exist, and in CI mode a missing
snapshot fails rather than being written. **All 15 visual assertions fail on CI, every run.**

This is a second, independent reason the CI browser gate has never been green, alongside the gate
ordering repaired by ADR-021. It also explains the shape of the recorded evidence: every browser
result in every stage ledger was produced on `Windows x64`, never on the platform CI verifies.

Not repaired here, deliberately. A baseline is only trustworthy when produced by the environment
that verifies it. This sandbox has Chromium build 1194 against the pinned 1234, different system
fonts, and no Firefox or WebKit. Baselines generated here would be false evidence — the exact
failure mode this whole engagement is about. The five `-chromium-linux.png` files Playwright wrote
during verification were deleted.

**Remediation, for the pinned environment:** regenerate all five snapshot names across all three
browsers on `ubuntu-latest` (or a matching container) with
`pnpm exec playwright test --update-snapshots`, review each image as evidence rather than accepting
it, and commit the `-linux` set. Keeping the `-win32` set alongside is optional and local-only.

A guard is available and not yet wired in: a validator that reads `browserProjects` from
`.agent/build-test-infrastructure.json` and the runner platform from the CI workflow, then requires
every snapshot name to have a baseline for each project on the CI platform. It would have caught
this. It fails today, so wiring it in would turn `verify:scaffold` red — that is your call, not
mine to make unilaterally.

## F-15 — date-math specification overstated its timezone coverage · FIXED

`specs/foundation/date-math.md` claimed tests cover "a half-hour-offset zone". They covered
`Asia/Kathmandu`, which is `+05:45` — a three-quarter-hour offset — and no half-hour zone at all.
A whole-hour offset bug would be caught by Kathmandu, but a half-hour zone with daylight saving is
the case future Scheduler and Gantt work depends on, and it was untested.

Rather than weaken the specification, the coverage was added. `Australia/Adelaide` switches between
`+09:30` and `+10:30`, so both transitions were derived independently from `Intl` before being
asserted:

- overlap, 5 April 2026 local 02:30 — `compatible` and `earlier` resolve to `16:00Z`, `later` to
  `17:00Z`, `reject` throws;
- gap, 4 October 2026 local 02:30 — `compatible` resolves to `17:00Z`, `earlier` to `16:00Z`,
  `reject` throws.

The implementation matched every independently derived value. The specification now describes the
actual coverage.

## Observation: one speculative dependency edge

`@casauran/react` declares `@casauran-internal/positioning` as a runtime dependency while that
package is still the `export {};` placeholder. It is an internal workspace edge, so
`validate:dependencies` correctly permits it, but the public package carries a dependency on an
empty engine.

This is not a foundation gap. Positioning has no Phase 0 stage by design: `AGENTS.md` allows a
component stage to create a required shared capability through the `new-engine` workflow, and
`1.10 Popup` routes `skills/overlay-positioning/SKILL.md` for exactly that. The declaration could
be moved to that stage, or left as an accepted forward edge.

## Verdict

The Foundation is **functionally complete and now verified by execution**. Fourteen specifications,
eighteen stages, twenty-seven libraries, four production hosts: every named export, error code,
constant, invariant, and behavioural clause has been checked against implementation, and every
scenario the policies promise has been located in a real test and run.

It is **not yet certifiable**, for two gate-level reasons that are both environmental rather than
architectural:

1. Phase 0 re-certification has not been run on the pinned toolchain with all three browsers.
2. Visual baselines do not exist for the platform CI verifies (F-14).

Both close on one maintainer machine or CI runner. Neither indicates a defect in the foundation
code, and no further foundation implementation work was found to be missing.
