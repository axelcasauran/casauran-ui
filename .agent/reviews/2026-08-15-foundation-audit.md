# Foundation Audit: `specs/foundation`

Date: 2026-08-15
Scope: the 14 contracts under `specs/foundation/` and the 18 Phase 0 stages that own them.
Type: read-only verification. No contract, package, validator, or ledger was changed.

## Method

1. Read `README.md` and every document it links to, down to `specs/foundation/*.md`.
2. Ran all 35 repository validators, `pnpm test:contracts`, `pnpm typecheck`, `pnpm build`, and
   `pnpm test:unit` on a clean checkout.
3. Compared every named export, error code, constant, and behavioral clause in each foundation
   specification against its implementing package.
4. Compared foundation stage closure against the repository indices that are supposed to mirror it.

## Result

The engine implementations match their specifications. The gaps are in the **gate** and in the
**evidence records**, not in the foundation code.

- 35/35 validators PASS.
- 101/101 Node contract tests PASS.
- 116/116 Vitest tests PASS **after `pnpm build`**; 97/116 with 4 failed suites before it.
- Browser layer not executable in this environment (missing Playwright engine binaries).

---

## F-1 — BLOCKER: `pnpm validate` is not reproducible from a clean checkout

`validate:static` is ordered `verify:scaffold → format → lint → typecheck → architecture → test →
build`. Every workspace package resolves only through `exports → ./dist/*`, and nothing produces
`dist` before `typecheck` and `test` run: there is no `prepare` script, no TypeScript `paths` or
project references, and no Vitest alias to `src`.

Observed on this checkout after `pnpm install`:

```
packages/overlay typecheck: src/focus-scope.ts(1,47): error TS2307:
  Cannot find module '@casauran-internal/accessibility' or its corresponding type declarations.
```

```
FAIL tests/unit/button.test.tsx                  @casauran-internal/events
FAIL tests/unit/icon.test.tsx                    @casauran-internal/events
FAIL tests/unit/overlay-foundation.test.ts       @casauran-internal/accessibility
FAIL tests/unit/react-state-foundation.test.tsx  @casauran-internal/core
Test Files  4 failed | 12 passed (16)
Tests       97 passed (97)
```

After `pnpm build` the same commands pass: typecheck clean, 16/16 suites, 116/116 tests. The defect
is ordering and hermeticity only.

Contracts violated:

- `BUILD_TEST_INFRASTRUCTURE.md` — "Supported environment and reproducibility" and "CI and failure
  semantics", which specify checkout → `pnpm install --frozen-lockfile` → `pnpm validate`.
- `QUALITY_GATES.md` — "Static gate: `pnpm validate:static` adds formatting, lint, strict types,
  dependency architecture, tests, and builds."
- `.github/workflows/ci.yml` cannot be green on a fresh runner.

Consequence: every `pnpm validate — PASS` recorded in the F0.05–F0.18 ledgers, and the Phase 0
certification in `.agent/status.md`, was obtained on a worktree that already carried `dist` output
from an earlier build. The evidence is not reproducible as written.

Candidate fixes, smallest first:

1. Reorder `validate:static` so `build` precedes `typecheck` and `test`.
2. Make `typecheck` and `test:unit` depend on a build step of their own.
3. Add a development condition (TS project references, or Vitest `resolve.alias` to `src`) so pure
   source consumers never need `dist`. Most robust for local iteration; largest change.

Nothing enforces this today. `.agent/build-test-infrastructure.json` and its validator check host
and library topology, not gate ordering or hermeticity.

---

## F-2 — 7 of 14 foundation specifications still carry pre-implementation status

All 18 Phase 0 stages are `complete` in `.agent/stages/index.json`, but:

| Specification                 | `Status:` line                                | Stage |
| ----------------------------- | --------------------------------------------- | ----- |
| `react-state.md`              | approved for F0.08 implementation             | F0.08 |
| `collection-engine.md`        | approved for F0.09 implementation             | F0.09 |
| `overlay.md`                  | approved for F0.10 implementation             | F0.10 |
| `animation.md`                | approved for F0.11 implementation             | F0.11 |
| `data-engine.md`              | approved for F0.12 implementation             | F0.12 |
| `internationalization.md`     | approved for F0.13 implementation             | F0.13 |
| `documentation-experience.md` | accepted for implementation by F0.18, ADR-020 | F0.18 |

The remaining seven use three further wordings: "approved and implemented by F0.0x." (tokens,
css-theme-runtime, accessibility), "implemented by F0.1x" (date-math, virtualization, drag-drop),
and "complete" (reference-baseline). Five vocabularies, no governed set.

Root cause: `scripts/validate-specs.mjs` only maps `registry/components/*.json` lifecycle to
`specs/components/`. No validator ties a foundation specification's status to its stage status, so
the drift is invisible to `pnpm validate`.

---

## F-3 — Phase 0 certification does not cover all 18 Phase 0 stages

`.agent/status.md` records:

```
Phase 0 certification: PASS (`pnpm validate`, 2026-08-14; 151 browser tests passed, ...)
Last closed stage: `F0.18 ...` (... 201 browser checks ...; 2026-08-14)
```

F0.18 is a Phase 0 foundation stage that ADR-020 deliberately inserted after certification. The
certification record was never re-run or re-stamped, so the recorded Phase 0 gate predates one of
the phase's own stages. `QUALITY_GATES.md` treats phase certification as the phase gate; ADR-020
does not grant an exemption.

---

## F-4 — Root `README.md` contradicts `.agent/status.md`

`README.md` "Current state" still reads:

```
- Product implementation: not started.
- First engineering work: Phase 0 Product Foundation.
- First public component after Phase 0: Button.
```

`.agent/status.md` is authoritative and reads `Phase 0 certification: PASS` and
`Public component implementation: 2 OF 127 COMPLETE`. AGENTS non-negotiable 25 requires repository
status to be updated when a stage closes; the entry point document was missed by 18 stage closes.

---

## F-5 — F0.18 is missing from the repository indices

| File                         | Stale content                                                                                      | Actual        |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | ------------- |
| `scaffold-manifest.json`     | `foundationStages: 17`, `totalStages: 171`, `acceptedADRs: 19`                                     | 18 / 172 / 20 |
| `.agent/stages/README.md`    | "171 stages total: 17 foundation"                                                                  | 172 / 18      |
| `VERIFICATION_REPORT.md`     | "Foundation stages: 17", "Total execution stages: 171", "Accepted architecture ADRs: 19"           | 18 / 172 / 20 |
| `specs/README.md`            | lists 13 implemented foundation contracts                                                          | 14            |
| `HANDBOOK_INDEX.md`          | omits `registry/documentation/foundation.json` and `scripts/validate-documentation-experience.mjs` | both exist    |
| `README.md` (Validation)     | documents 14 foundation validators, never `pnpm validate:documentation-experience`                 | 15 documented |
| `IMPLEMENTATION_STRATEGY.md` | Phase 0 enumeration omits the documentation-experience foundation                                  | —             |

`.agent/stages/index.json` is correct at 172/18. No validator compares these counts against it.

---

## F-6 — Capability registry stale for two shipped capabilities

- `registry/capabilities/events.json` — `status: "planned"`, `consumers: ["Scheduler","Map"]`.
  `@casauran-internal/events` ships `composeEventHandlers` with a package-local unit test and is a
  declared dependency of `@casauran/react`, consumed by Button (1.01).
- `registry/capabilities/icons.json` — `status: "planned"`, `consumers: []`. `@casauran/icons`
  ships `definitions.ts` and is consumed by Icon (1.02).

`scripts/validate-registry.mjs` only validates `registry/components/*`. Nothing cross-checks a
capability's declared status against the presence of implementation or its real consumers.
`CAPABILITY_REGISTRY.md` states the registry "records shared behavior ownership" and exists to stop
private re-implementation; two stale entries weaken that guarantee for the next stage that needs
event composition or icon definitions.

---

## F-7 — `specs/foundation/tokens.md` was never amended when component tokens shipped

The contract still states that the package exports "empty `componentTokens`" and that "Component
token inventory is deliberately empty until a component has a justified durable customization
seam."

`pnpm validate:tokens` now reports **73 primitive, 56 semantic and 17 component tokens** (15
`button.*`, 2 `icon.*`), and `packages/theme/src/theme.css` emits all 17 under `@layer tokens`.
The F0.05 contract text is now factually wrong about the shipped public surface it governs.

Related observation, not a defect: component tokens are _declared_ by the owning component stage in
`registry/tokens/foundation.json` but _emitted_ by the shared `@casauran/theme` stylesheet.
`specs/foundation/css-theme-runtime.md` says "component-specific variables are introduced only by
their owning component stages" — the declaration satisfies that, the emission location is a design
choice made during 1.01 that neither foundation spec describes.

---

## F-8 — `.agent/performance-budgets.md` is incomplete against `PERFORMANCE_POLICY.md`

- No entry for the F0.12 data-engine scenario, although `benchmarks/data-engine.mjs` exists, the
  five-second ceiling is stated in `PERFORMANCE_POLICY.md`, and the F0.12 ledger records
  `21.94 ms on Node v24.18.0 win32/x64`. F0.15 and F0.16 both have entries; F0.12 does not.
- The F0.15 and F0.16 entries state ceilings but record no observed result, unlike the Button and
  Icon entries which record `196.78 ms` and `172.70 ms`. `PERFORMANCE_POLICY.md` requires
  "scenario + dataset + environment"; the environment and the measurement are absent.

---

## F-9 — No governed template for foundation/engine specifications

`specs/README.md` instructs "Use the complete templates under `specs/templates/`".
`specs/templates/engine.spec.md` is three lines. `block.spec.md`, `pattern.spec.md`, and
`template.spec.md` are one line each. Only `component.spec.md` is a complete 18-section template.

All 14 foundation specs independently converged on the same structure (scope/ownership → contract
sections → accessibility → SSR/security/performance → compatibility → next-stage boundary), and
that structure exists in no template. `scripts/validate-doc-depth.mjs` covers `skills/**` and
`.agent/workflows/**` but not `specs/**`, so a shallow future foundation spec would pass the gate.

---

## F-10 — `apps/docs` has no route for the supported public packages

`@casauran/tokens`, `@casauran/theme`, and `@casauran/icons` are supported public packages.
`specs/foundation/css-theme-runtime.md` requires consumers to `import '@casauran/theme/theme.css'`
once at an application stylesheet boundary and documents override seams.

The canonical customer documentation app serves only `/components/button` and `/components/icon`.
Its "Foundations" navigation group links to a home-page anchor and `/docs-index.json`. There is no
installation, theming, or token page. This is inside the F0.18 boundary as written ("Only completed
public component stages become active component documentation links"), but two shipped public
packages have no customer-facing documentation route.

---

## F-11 — Focus-scope fallback target is not root-constrained on one path

`specs/foundation/overlay.md`: "Entry and fallback targets outside the scope root are ignored."

`packages/overlay/src/focus-scope.ts:53` enforces `root.contains(candidate)` in `focusEntry`, but
the zero-tabbable `Tab` branch at `packages/overlay/src/focus-scope.ts:95` calls
`tryFocus(resolveTarget(scope.options.fallbackFocus))` with no containment check. A fallback target
outside the root therefore receives focus from inside a trapping scope, which is the one case the
clause exists to prevent.

---

## F-12 — `.github/CODEOWNERS` omits two packages that now carry code

CODEOWNERS mirrors every foundation package path explicitly, plus `apps/docs` and every foundation
registry and validator. `/packages/events/**` and `/packages/icons/**` are absent and fall back to
the `*` rule, although both now ship implementation consumed by public components.

---

## Environment limitations of this audit

- Node here is `v22.22.2`; the contract requires `>=24.18.0 <27`. All commands emitted engine
  warnings. Findings F-1 through F-12 are independent of the Node version.
- Playwright 1.62.0 engine binaries are unavailable, so `pnpm test:browser` and the full
  `pnpm validate` could not be executed. Both Next.js production hosts built and started
  successfully; only browser launch failed.

## Verified conformant

Recorded so the report is not read as a blanket doubt about Phase 0:

- Every named export in all 14 contracts exists in its owning package, checked symbol by symbol.
- Error codes and constants match: `CSN-TOKEN-001/002`; `CSN_COLLECTION_*` invariant codes; cascade
  layer order `reset, tokens, base, components, utilities, overrides`; `data-csn-visually-hidden`
  in `@layer utilities`; `MAX_VIRTUAL_ITEMS = 2_000_000`; filter depth bound 64; Gregorian year
  range 1–9999.
- Behavioral clauses spot-verified against source: token-aware cleanup in the collection, overlay,
  animation and drop-target registries; depth-first preorder plus parent-cycle detection in
  collection snapshots; non-cascading top-layer dismissal; nested focus restoration order;
  reference-counted native `inert`; `AbortSignal` attach and detach at terminal settlement;
  Fenwick-tree prefix sums; three drag collision strategies with deterministic tie-breaking;
  4.5:1 contrast enforcement plus `prefers-reduced-motion` zeroing and `forced-colors` system
  colors in the theme validator and generated stylesheet.
- Every foundation stage has a ledger with recorded evidence, a registry contract with a JSON
  schema, a validator with a Node rejection test, unit tests, and — except tokens, by design — a
  production `apps/visual-tests` route with a browser spec.
- All 35 validators are wired into `scripts/verify-scaffold.mjs`, which `validate:static` runs
  first.

## Suggested order of repair

1. F-1 — restores the meaning of every other PASS record.
2. F-3 — re-run and re-stamp Phase 0 certification once F-1 lands.
3. F-2, F-4, F-5, F-6, F-7 — evidence and index truth, plus the missing validators that would have
   caught them (foundation spec status vs stage status; index counts vs `.agent/stages/index.json`;
   capability status vs implementation).
4. F-8, F-9, F-11, F-12 — narrow, independent.
5. F-10 — needs a scope decision before work: extend the F0.18 boundary or open a follow-up stage.
