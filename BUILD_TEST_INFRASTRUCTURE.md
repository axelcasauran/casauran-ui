# Build and Test Infrastructure

## Purpose and authority

This policy defines the shared build, typecheck, test, host, artifact, and CI substrate for
Casauran UI. It implements the accepted TypeScript-library, Next.js-first, minimal-client-boundary,
and no-Storybook decisions; it does not change product architecture or introduce product APIs.

The machine-readable mirror is `.agent/build-test-infrastructure.json`, with its JSON Schema beside
it. The maintainer owns toolchain and CI wiring. The evidence reviewer owns gate coverage and stage
evidence. Package/domain owners own the correctness of tests and builds added under their domains.

## Supported environment and reproducibility

- Node support is `>=24.18.0 <27`, with `24.18.0` used by `.node-version` and CI.
- pnpm is pinned through `packageManager` at `11.17.0` and Corepack.
- `pnpm-lock.yaml` is mandatory. CI and reproducible bootstrap use
  `pnpm install --frozen-lockfile`; CI never falls back to an unlocked install.
- Runtime dependency policy is unchanged. F0.04 adds no dependency and does not adopt a library
  bundler, DOM emulator, accessibility scanner, coverage provider, or component explorer.

Generated build/test data is never repository truth. `.next`, `dist`, coverage, Playwright reports,
test results, and TypeScript build-info files are ignored. Next.js incremental metadata is written
inside each ignored `.next` directory.

## Build contract

All 27 library workspaces use TypeScript to emit ESM JavaScript, declarations, declaration maps,
and source maps into `dist`. The four supported public packages retain explicit exports; internal
packages remain private. The root `pnpm build` command builds every workspace and then verifies
that each library export target and its maps exist and agree with the package manifest.

The four Next.js App Router hosts are built in production mode:

| Host         | Port | Responsibility                                           |
| ------------ | ---- | -------------------------------------------------------- |
| docs         | 3100 | Canonical customer documentation and executable examples |
| playground   | 3101 | Interactive supported-API exploration                    |
| showcase     | 3102 | Application-level integration evidence                   |
| visual-tests | 3103 | Deterministic browser and visual-regression scenarios    |

Routes remain Server Components by default. Test-only client probes must have a local `'use
client'` boundary and may not become a consumer export.

## Typecheck contract

`pnpm typecheck` covers three scopes exactly once:

1. every package and application workspace;
2. browser, unit, fixture, and certification tests through `tests/tsconfig.json`;
3. Vitest and Playwright configuration through `tsconfig.tooling.json`.

Strict options come from `tsconfig.base.json`. Tests do not bypass `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, or the other repository strictness settings.

## Test layers

Tests run at the cheapest reliable layer and are centrally orchestrated once per root gate.

- `pnpm test:contracts` uses the Node test runner for repository contracts, validators, and build
  infrastructure. These tests require no browser or DOM shim.
- `pnpm test:unit` uses Vitest once from the repository root for package-local pure tests and
  cross-package tests under `tests/unit`. Empty discovery is a failure; `--passWithNoTests` is not
  part of the root gate.
- `pnpm test:browser` builds the visual-test and documentation hosts, starts both with `next start`,
  and uses Playwright against those production runtimes. Chromium, Firefox, and WebKit are mandatory.
- `pnpm test` combines contract and unit layers. `pnpm validate` combines the full static gate with
  the production browser layer.

Real-browser tests own layout, focus, keyboard, pointer/touch, hydration, responsive behavior, and
visual assertions. Vitest owns deterministic pure logic. A test is not duplicated into multiple
layers merely to increase a coverage number.

## Root gate ordering

Every workspace package resolves only through its `exports` map into `dist`. Any step that resolves
a cross-package specifier — type-aware lint, workspace typecheck, dependency-cruiser architecture
analysis, and the Vitest unit layer — therefore requires emitted output to already exist. A gate
that runs those steps before `pnpm build` cannot pass on a clean checkout, even though it passes on
a developer machine that still holds output from an earlier build.

The ordered static gate is authoritative and machine-readable in the `rootGate` block of
`.agent/build-test-infrastructure.json`:

```text
verify:scaffold → format → build → lint → typecheck → architecture → test
```

`pnpm validate` then adds the production browser layer. The build/test validator compares both root
gate scripts against the declared sequences character for character and fails when any declared
compiled-output consumer is ordered before the build step, so the reproducibility property cannot
regress silently.

Consequences for contributors and for evidence:

- `pnpm typecheck`, `pnpm lint`, `pnpm architecture`, and `pnpm test:unit` are not standalone
  entry points on a fresh clone. Run `pnpm build` once after `pnpm install`, or run the gate.
- Stage evidence that records a passing gate must have been produced by a run that started from
  the declared install command. A gate result obtained only on a pre-built worktree is not
  reproducible evidence and does not satisfy stage close.
- Reordering the gate, adding a step that resolves cross-package specifiers, or introducing a
  development resolution condition that bypasses `dist` is an infrastructure change under
  "Extending the infrastructure".

## Browser and visual determinism

Playwright uses a fixed viewport, `en-US`, UTC, light color scheme, reduced motion, CSS-pixel
screenshots, hidden carets, and disabled animations during screenshot assertions. Traces,
screenshots, videos, HTML reports, and test results are retained only as ignored diagnostic
artifacts according to failure policy.

Visual baselines are added by stages that introduce visible behavior. Each baseline must identify
the state/theme/direction/viewport it proves, avoid time/network/random data, and be reviewed as
evidence rather than accepted automatically. F0.04 configures this capability but does not create
speculative component snapshots.

The infrastructure browser probe proves three distinct paths: production server response,
server-rendered markup, and hydration of a narrowly scoped client boundary without console or page
errors.

## CI and failure semantics

GitHub Actions has read-only repository permissions, installs from the frozen lockfile, installs
only the three configured Playwright engines, and runs `pnpm validate`. The full command fails on
any mechanical, formatting, lint, type, architecture, contract, unit, build-output, production
build, SSR/hydration, or browser failure.

Warnings are not used to conceal unsupported configuration. A new warning introduced by an
infrastructure change is resolved or recorded as blocking evidence. Flaky retries are limited to
CI browser execution and traces are retained for diagnosis; retries do not turn a reproducible
failure into a pass locally.

## Extending the infrastructure

A new test runner, bundler, browser engine, host, coverage provider, or hosted service is an
architecture/toolchain change. It requires evidence of a missing capability, dependency and
security review where applicable, compatibility/rollback analysis, and an ADR when the frozen
architecture changes.

Ordinary stages may add package-local unit tests, browser scenarios, fixtures, and visual
baselines using these contracts. They must not weaken discovery, use `--passWithNoTests`, skip a
required browser, write generated output outside ignored paths, or bypass the root gate.

## Applicability

F0.04 renders only an internal test probe and exports no consumer API. Accessibility, keyboard,
touch, IME, theming, density, RTL, localization, responsive behavior, and visual states become
test requirements when an owning product stage introduces them. The browser substrate is ready to
exercise those dimensions, while this stage limits its own product evidence to semantic naming,
production SSR, and client hydration. No runtime performance claim is made; build/test duration is
observed only as infrastructure evidence.
