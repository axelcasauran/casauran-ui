# Casauran UI

Independent enterprise-grade React UI platform with capability coverage benchmarked against the approved public KendoReact documentation baseline.

## Current state

`.agent/status.md` is the authoritative program status. This summary mirrors it.

- Architecture: frozen.
- Reference baseline: `6a05c926c4f08b89782c25336fc159fea3a3f26b` captured 2026-08-13.
- Phase 0 Product Foundation: 18 of 18 stages complete; certification re-run is pending after the
  root-gate ordering remediation recorded in `.agent/status.md`.
- Public component stages: 2 of 127 complete (`1.01` Button, `1.02` Icon).
- Next stage: `1.03` SVGIcon, not started.

## Read first

1. `AGENTS.md`
2. `GOVERNANCE.md`
3. `MECHANICAL_GOVERNANCE.md`
4. `BUILD_TEST_INFRASTRUCTURE.md`
5. `AI_AGENT_OPERATING_MODEL.md`
6. `.agent/protocol.md`
7. `ARCHITECTURE.md`
8. `PARITY_DEFINITION.md`
9. `BRANDING.md`
10. `NAMING_CONVENTIONS.md`
11. `KENDO_REFERENCE_POLICY.md`
12. `DEPENDENCY_POLICY.md`
13. `COMPONENT_COMPOSITION_RULES.md`
14. `.agent/PROMPT_PLAN.md`
15. `.agent/roadmap.md`
16. `.agent/status.md`

## Source-of-truth order

Accepted ADRs → AGENTS non-negotiables → architecture/policies → registry/schemas → stage ledger → approved specs → tests → implementation → docs.

## Validation

Before installing dependencies:

```bash
node scripts/verify-scaffold.mjs
```

After bootstrap:

```bash
pnpm validate
```

Repository ownership and stage-order checks are also available directly through
`pnpm validate:governance` and `pnpm test:governance`. Agent routing coverage is verified through
`pnpm validate:agent-os` and `pnpm test:agent-os`. Validator inventory, command wiring, ownership,
read-only safety, and root-gate linkage are verified through `pnpm validate:mechanical-governance`
and `pnpm test:mechanical-governance`.

The canonical token vocabulary is validated with `pnpm validate:tokens`, regenerated with
`pnpm generate:tokens`, and documented in `TOKEN_ARCHITECTURE.md`.

Static light/dark and comfortable/compact theme behavior is regenerated with
`pnpm generate:theme`, validated with `pnpm validate:theme`, and documented in `THEME_POLICY.md` and
`CSS_ARCHITECTURE.md`.

The internal accessibility foundation is validated with `pnpm validate:accessibility-foundation`
and documented in `ACCESSIBILITY_POLICY.md` and `specs/foundation/accessibility.md`.

The React state foundation is validated with `pnpm validate:react-state-foundation`, tested with
`pnpm test:react-state-foundation`, and documented in `specs/foundation/react-state.md` and the
`@casauran/react` package README.

The framework-neutral collection engine is validated with `pnpm validate:collection-engine`,
tested with `pnpm test:collection-engine`, and documented in
`specs/foundation/collection-engine.md` and the internal collections package README.

The internal overlay foundation is validated with `pnpm validate:overlay-foundation`, tested with
`pnpm test:overlay-foundation`, and documented in `specs/foundation/overlay.md` and the internal
overlay package README.

The internal animation foundation is validated with `pnpm validate:animation-foundation`, tested
with `pnpm test:animation-foundation`, and documented in `specs/foundation/animation.md` and the
internal animation package README.

The internal data engine is validated with `pnpm validate:data-engine`, tested with
`pnpm test:data-engine`, benchmarked with `pnpm benchmark:data-engine`, and documented in
`specs/foundation/data-engine.md` and the internal data package README.

The internal internationalization foundation is validated with
`pnpm validate:internationalization`, tested with `pnpm test:internationalization`, and documented
in `specs/foundation/internationalization.md` and the internal i18n package README.

The internal date-math foundation is validated with `pnpm validate:date-math`, tested with
`pnpm test:date-math`, and documented in `specs/foundation/date-math.md` and the internal date-math
package README. Its production route proves SSR-safe calendar/range/week and DST behavior.

The internal virtualization foundation is validated with `pnpm validate:virtualization-foundation`,
tested with `pnpm test:virtualization-foundation`, benchmarked with
`pnpm benchmark:virtualization`, and documented in `specs/foundation/virtualization.md`. Its
production route proves SSR-safe 1D/2D windows plus client-only dynamic measurement, anchoring and
focused-item retention.

The internal drag-drop foundation is validated with `pnpm validate:drag-drop-foundation`, tested
with `pnpm test:drag-drop-foundation`, benchmarked with `pnpm benchmark:drag-drop`, and documented
in `specs/foundation/drag-drop.md`. Its production route proves SSR-safe target/session state plus
explicit pointer capture, keyboard-equivalent drop/cancel, touch events, autoscroll and cleanup.

The reference baseline is validated with `pnpm validate:reference-baseline`, regression-tested
with `pnpm test:reference-baseline`, and documented in
`specs/foundation/reference-baseline.md`. Its dedicated local-corpus gate pins 12,179 files across
62 domains and verifies all 127 component mappings without starting component analysis.

The customer documentation foundation is validated with `pnpm validate:documentation-experience`,
regression-tested through the contract suite, and documented in
`specs/foundation/documentation-experience.md`, `DOCUMENTATION_POLICY.md` and ADR-020. Its
production route set is `apps/docs`, and the browser gate starts that host alongside the visual
fixture host.

Foundation specification status is bound to stage status with `pnpm validate:foundation-specs`,
contract-tested through `pnpm test:contracts`, and declared in
`.agent/foundation-specifications.json`.

Build/test topology and output wiring are checked with `pnpm validate:build-test-infrastructure`
and `pnpm test:build-test-infrastructure`. Unit tests run once through `pnpm test:unit`; production
SSR/hydration/browser checks run through `pnpm test:browser`.

The static gate builds before it lints, typechecks, analyzes architecture, and tests, because
workspace packages resolve only through their `exports` map into `dist`. `pnpm typecheck`,
`pnpm lint`, `pnpm architecture` and `pnpm test:unit` therefore require one `pnpm build` after a
fresh install. The ordering is declared in `.agent/build-test-infrastructure.json` and enforced by
`pnpm validate:build-test-infrastructure`.

## Local KendoReact documentation prerequisite

Place the external documentation corpus beside the repository and configure:

```bash
CASAURAN_KENDO_DOCS_PATH=../references/kendo-react-docs/docs/content
pnpm reference:check
```

Normal component/reference analysis is local-only. There is no online fallback.
The preflight also verifies the exact SHA-256 inventory; drift is BLOCKED until approved sync.
