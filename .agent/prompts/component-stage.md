# Component Stage Prompt

Execute exactly one public Casauran UI component stage: `{{STAGE_ID}} — {{COMPONENT}}`.

The repository is authoritative. Conversation memory is not. This prompt sequences the mandatory
component-stage work defined in `AGENTS.md`; it does not replace accepted ADRs, architecture or
policy documents, registry and schemas, the stage ledger, approved specifications, tests, or any
validator.

## 0. Mandatory local reference preflight

Before reading any reference document:

```bash
pnpm reference:check
```

Reference analysis is strictly local-only through `CASAURAN_KENDO_DOCS_PATH`, default
`kdocs/references/kendo-react-docs/docs/content`. Do not use the online KendoReact repository, live
Telerik documentation, search engines, third-party tutorials, or model memory as a fallback. If the
preflight fails, stop the stage as `BLOCKED`.

## 1. Resolve inputs and route

Resolve `{{STAGE_ID}}` and `{{COMPONENT}}` against the repository, not from memory:

- `.agent/stages/index.json` — machine-readable order and status;
- `.agent/stages/{{STAGE_ID}}-<slug>.md` — the stage ledger, required skills, and evidence slot;
- `registry/components/<slug>.json` — canonical component entry.

If the stage does not exist, is not `not-started`, or disagrees with `.agent/status.md`, stop as
`BLOCKED`. Do not invent, renumber, reorder, or split stages.

Then load, completely, the routes `.agent/agent-operating-system.json` assigns to the
`public-component` task class:

- workflows `new-component`, `reference-to-spec`, `parity-audit`;
- skills `component`, `api-design`, `testing`, `accessibility`, `composition`, `nextjs-rsc`,
  `documentation`, `parity-audit`, `reference-analysis`;
- `.agent/protocol.md`, plus `complex-widget` prompt and workflow when the stage carries that
  modifier.

Also read `AGENTS.md`, `.agent/status.md`, the stage ledger, `ARCHITECTURE.md`,
`API_GOVERNANCE.md`, `COMPONENT_COMPOSITION_RULES.md`, `NEXTJS_COMPATIBILITY.md`,
`SECURITY_ARCHITECTURE.md`, `DEFINITION_OF_DONE.md`, and the affected ADRs.

## 2. Authority order

1. accepted ADRs;
2. `AGENTS.md`;
3. architecture and policy documents;
4. registry and schemas;
5. stage ledger;
6. approved specifications;
7. executable tests;
8. implementation;
9. documentation examples.

Never resolve a conflict from a lower-authority artifact or from conversation history. Resolve the
higher contract first, through the correct workflow.

## 3. One-stage rule

You MAY: implement or remediate `{{COMPONENT}}`; extend a shared engine at its owner layer when
this component requires it; repair a foundation defect that blocks this stage; add internal
primitives this component needs; add its tests, docs, playground examples, and visual fixtures;
update registry, ledger, evidence, and generated artifacts.

You MUST NOT: begin the next public component; silently ship a second public component;
opportunistically redesign unrelated components; duplicate a capability owned elsewhere; weaken a
validator, lint rule, type, or test to pass; change accepted architecture or roadmap without an
ADR; declare completion from a render or screenshot.

`pnpm validate:stages` enforces one unique component per public-component stage.

## 4. Preconditions

Verify before implementing: the stage exists and is next; predecessor stages are `complete`; the
Phase 0 foundations this component needs are available; required lower-level public components
exist; no governance, architecture, or certification blocker is open in `.agent/status.md`; the
local reference preflight passed; and the repository baseline is green for unrelated reasons.

Run the gate before you start, so a pre-existing failure is not attributed to this stage.

## 5. Lifecycle

`registry/components/<slug>.json.status` advances only with evidence:

```text
unreviewed → reference-analyzed → specified → api-approved
→ implemented → tested → documented → parity-verified → improved
```

Do not skip a state because the component looks simple. `pnpm validate:specs` requires a
specification from `specified` onward; `pnpm validate:parity` requires every `parity` dimension to
be `pass` or `not-applicable` before `parity-verified`.

## 6. Clean-room reference workflow

```text
approved local public reference docs → reference-analysis artifact
→ independent capability extraction → independent Casauran specification
→ independent API and test design → implementation → documentation → parity audit
```

Never implement directly from competitor documentation.

**Allowed**: public documented capabilities and feature families, states, interactions, keyboard
behavior, accessibility expectations, supported use cases and integrations, responsive and adaptive
behavior, localization/globalization/RTL behavior, documented edge cases and limitations, public API
concepts and configuration categories.

**Forbidden**: competitor source, CSS or theme values, private package internals or architecture,
compiled code, source maps, decompilation, assets and icons, undocumented DOM or class structures,
proprietary implementation hierarchy, copied examples or wording, and competitor branding in
customer-facing Casauran documentation.

## 7. Exhaustive reference analysis

Record the analysis in `specs/components/<slug>.reference-analysis.md`. Do not stop at the overview
or the first example. Search the local corpus for every materially related page, including where
applicable: overview and getting started; appearance, variants, sizes, shapes; states and disabled
behavior; icons, content, adornments; events; controlled and uncontrolled state; keyboard
navigation; accessibility; globalization and RTL; adaptive and responsive behavior; forms; data
binding; virtualization and performance; integrations; API; edge cases and limitations.

List every examined path relative to `docs/content`. Separate observed facts from Casauran design
decisions. If documentation work later reveals a missed capability, return to reference analysis
and specification rather than omitting it.

## 8. Capability and parity matrix

The capability matrix is `specs/components/<slug>.parity.md`, backed by the `features` and `parity`
fields of `registry/components/<slug>.json`. Follow the Button and Icon precedent: an observable
feature audit table, then an enterprise dimension audit table, each row carrying a result and named
Casauran evidence.

Every materially relevant capability ends with an explicit disposition:

```text
IMPLEMENTED  IMPLEMENTED_DIFFERENTLY  NOT_APPLICABLE
INTENTIONALLY_DIVERGED  DEFERRED_TO_DECLARED_DEPENDENCY  BLOCKED
```

These are never acceptable final states: `UNKNOWN`, `NOT_CHECKED`, missing without explanation,
`TODO` without an owner, deferred without a named stage.

A capability may be deferred only when a genuine declared dependency owns it. Every deferral states
the owning stage or subsystem, why it cannot be completed correctly now, and whether integration
revalidation is required later. Deferral is not a way to drop work that belongs to this stage.

`registry/components/<slug>.json.parity` uses `pass`, `not-applicable`, or an in-progress value
across `functionality`, `states`, `interaction`, `keyboard`, `accessibility`, `responsive`, `i18n`,
`rtl`, `theming`, `ssrNext`, `performance`, `security`, and `docs`. Every `not-applicable` carries a
written reason in the parity document and the stage ledger.

## 9. Independent specification

Write `specs/components/<slug>.spec.md` from `specs/templates/component.spec.md`. Complex widgets
use `specs/components/<slug>/` with `specs/templates/complex-widget-architecture.md` plus the
feature, state, interaction, keyboard, performance, and security documents.

Do not translate a competitor API mechanically. Optimize for Casauran consistency, React
conventions, semantics, accessibility, composability, type safety, server safety, predictable
state, and real enterprise use.

Do not begin substantial implementation before the API is approved under `API_GOVERNANCE.md`.

## 10. Canonical composition

Reuse the canonical owner whenever the semantic capability already exists: the public `Icon` rather
than a local icon system; `@casauran-internal/overlay` and `positioning` rather than local overlay
or geometry logic; `@casauran-internal/accessibility` for focus, roving focus, keyboard intent, and
live regions; `@casauran-internal/collections`, `data`, `date-math`, `virtualization`, `drag-drop`,
`i18n`, `animation`, `core`, and `events` for their owned capabilities.

Native semantic elements belong to the component that owns the primitive. `Button` may render
`<button>`; a composite that already composes canonical components may not invent a second one.
`pnpm validate:composition` enforces this against
`registry/components/<slug>.json.composition.nativeInteractiveExceptions`.

Extend a shared engine at its owner package. When you do, update that owner's registry contract,
specification, tests, and validator, and record the extension in this stage's ledger.

## 11. Public and internal boundaries

Public React components live in `@casauran/react` and nowhere else; `pnpm validate:registry`
enforces it. Supported public packages are `@casauran/react`, `@casauran/tokens`,
`@casauran/theme`, and `@casauran/icons`. Everything else is `@casauran-internal/*` and is not a
consumer API.

Source lives at `packages/react/src/components/<category>/<slug>/`. Third-party types must not
appear in a supported public API. `pnpm validate:public-api`, `pnpm validate:boundaries`,
`pnpm validate:package-exports`, and `pnpm architecture` enforce the layering.

Follow `BRANDING.md` and `NAMING_CONVENTIONS.md`. Never describe Casauran UI as a clone, and never
expose competitor branding outside internal reference and provenance artifacts.

## 12. Styling, tokens, and theme

Static CSS and custom properties only. Cascade order is fixed:

```text
reset → tokens → base → components → utilities → overrides
```

Component tokens are authored in `registry/tokens/foundation.json`, regenerated with
`pnpm generate:tokens` and `pnpm generate:theme`, and validated with `pnpm validate:tokens` and
`pnpm validate:theme`. Never hand-edit `packages/tokens/src/generated.ts` or
`packages/theme/src/theme.css`. Add a component token only for a durable customization seam, and
record the seam in the specification.

Component stylesheets ship beside the component, are exported as a CSS entry point, and stay in the
package `sideEffects` list. Use logical properties. Support light and dark, comfortable and compact,
RTL, forced colors, reduced motion, and documented consumer overrides. Never copy competitor CSS or
theme values.

## 13. Accessibility gate

WCAG 2.2 AA plus the applicable WAI-ARIA APG pattern. Semantic HTML first; ARIA augments and never
contradicts semantics.

Verify: role, accessible name, value and state, relationships; disabled versus read-only semantics;
the complete keyboard table; one predictable focus model with entry, exit, and restoration; visible
focus; announcements and their localization; pointer, touch, and target size; zoom, reflow at 320
CSS pixels, and text scaling; forced colors; reduced motion; RTL; IME composition wherever text is
entered; and accessible behavior under virtualization.

Automated checks supplement manual review. Complex patterns require documented manual keyboard and
screen-reader review before `parity-verified`. Never claim conformance without evidence.

## 14. React, Next.js, and rendering

Next.js App Router is the primary host. Preserve server-safe package roots, local `'use client'`
boundaries only where genuinely required, deterministic SSR and hydration, hydration-stable IDs via
`useStableId`, and no browser global at module evaluation. No broad package-root client directive;
`pnpm validate:client-boundaries` enforces it.

Record rendering truth in `registry/components/<slug>.json.rendering`:

```json
{
  "serverRenderable": true,
  "requiresClient": true,
  "clientReasons": ["<specific reason>"],
  "hydrationSensitive": true
}
```

Each `clientReasons` entry names a concrete behavior, not a category.

## 15. State model

For stateful components define controlled and uncontrolled behavior, default and initial state,
transitions, event ordering, prop and state synchronization, reset behavior, disabled behavior,
async behavior, invalid combinations, and the owner of each piece of state. Use the project-wide
`value`/`defaultValue`/`onChange` convention and `useControllableState` from
`@casauran/react/state`. Prevent invalid combinations through types where practical. Avoid dual
sources of truth. Record the model in `.agent/state-matrix.md`.

## 16. Security gate

Treat user-controlled HTML, URLs, SVG, clipboard and paste content, files and metadata, drag
payloads, serialized external state, and AI output as untrusted. Do not render arbitrary HTML by
default. Any dangerous escape hatch is explicitly named, documented, tested, and covered by a
security note. Run the `security-review` workflow for high-risk components. A security gap blocks
completion.

## 17. Complex widgets

`DataGrid`, `TreeList`, `PivotGrid`, `Scheduler`, `Gantt`, `Editor`, `Chart`, `Diagram`, `Map`, and
`Spreadsheet` do not go from reference analysis straight to implementation. Produce, under
`specs/components/<slug>/`: `architecture.md`, `feature-matrix.md`, `interaction-model.md`,
`state-model.md`, `keyboard-model.md`, `performance-budget.md`, and `security-review.md`.

Internal vertical slices manage risk. They never become extra public component stages.

## 18. Implementation

Conform to the approved specification. Reuse canonical foundations. Preserve public and internal
boundaries, strict TypeScript, and dependency architecture. No explicit `any`. No speculative
abstraction, duplicate engine, or premature adapter. No browser-global module side effect. Keep the
package tree-shakeable and the root server-safe.

External runtime dependencies require the `dependency-proposal` workflow and normally an ADR. If
implementation conflicts with accepted architecture, fix the implementation or follow the
`architecture-change` workflow. Never weaken an architecture check.

## 19. Tests

Tests derive from the specification and the parity matrix, and run at the cheapest reliable layer
per `TESTING_POLICY.md`:

- `tests/unit/<slug>.test.tsx` — pure behavior, edge cases, server rendering, invalid input;
- `tests/browser/<slug>.spec.ts` — pointer, touch, keyboard, focus, accessibility semantics,
  SSR/hydration, RTL, forced colors, reduced motion, and deterministic visual cases across
  Chromium, Firefox, and WebKit;
- `scripts/<name>.test.mjs` — only for repository contracts and validators.

Cover controlled and uncontrolled state, selection, toggling, dismissal, navigation, IME where text
is entered, security escaping, and performance where material. Do not duplicate a test into several
layers to inflate coverage. Do not disable a failing test without proving the test invalid.

## 20. Visual fixtures

Every visual component gets a deterministic production fixture at
`apps/visual-tests/app/<slug>/` and screenshot cases in `tests/browser/<slug>.spec.ts-snapshots/`.
Cover main variants, sizes, important states, disabled, focus-visible, selected or toggled, RTL,
dark theme, density, and forced colors where the platform supports it. Each baseline names the
state, theme, direction, and viewport it proves, and is reviewed as evidence rather than accepted
automatically.

Screenshots prove rendering only. They never prove keyboard behavior, semantics, state correctness,
or parity.

## 21. Playground versus documentation

`apps/playground` is an engineering sandbox for debugging and interaction experiments. It is never
documentation completion, and never the customer experience.

## 22. Production documentation gate

`apps/docs` is the canonical customer documentation application, established by `F0.18` and
ADR-020. Add the route at `apps/docs/app/components/<slug>/page.tsx` and register its metadata,
headings, summary, and keywords in `apps/docs/lib/content.ts`, which derives active links from
`.agent/stages/index.json`. Compose the existing primitives in
`apps/docs/components/docs-primitives.tsx` — `DocsPage`, `DocsSection`, `Example`, `ApiReference`,
`KeyboardTable`, `AccessibilityChecklist`, `Callout`. Do not fork the shell, create a second
registry, or build a one-off documentation system.

Every feature in `registry/components/<slug>.json.features` is demonstrated on the route, and the
`featureCoverage` block declares how: `preview` (a rendered example; an enumerated feature previews
**every value** as an explicit prop assignment), `section` (a durable-id section for behaviour with
nothing to render), or `fixture` (a named browser/visual case for forced colors, reduced motion, RTL
and similar). `pnpm validate:documentation-experience` rejects a feature with no declaration, a
declaration pointing at a section the route does not define, and an enumerated value that is never
previewed. ADR-023 governs the rule.

Document every applicable implemented capability family, using only sections that apply: overview
and getting started; examples; appearance and variants; sizes and shapes; states; icons and
content; events; forms; controlled state; data binding; keyboard navigation; accessibility; RTL and
globalization; adaptive behavior; performance; security; API; known limitations. Do not create an
empty section to resemble another product.

Live examples use supported public API only, compile, reflect real behavior, use Casauran
terminology, and contain no copied competitor source or wording. Sections carry durable explicit
IDs so server-rendered deep links work without client JavaScript.

Before marking documentation complete, reconcile:

```text
PARITY MATRIX ↕ IMPLEMENTATION ↕ TESTS ↕ DOCUMENTATION
```

Every implemented public capability is tested where meaningful and documented where user-visible.
Every documented capability actually exists.

API documentation covers exports, props, defaults, events, controlled and uncontrolled semantics,
ref behavior, accessibility-sensitive props, customization hooks, deprecations, and limitations.
Keyboard documentation states the actual supported key model. Accessibility documentation states
the semantic role and native behavior, accessible naming, keyboard and focus model, state
semantics, ARIA requirements, and consumer responsibilities.

## 23. Performance

Define a budget only with scenario, dataset, and environment. Follow the Button and Icon precedent:
a deterministic `benchmarks/<slug>.mjs` scenario, a root `benchmark:<slug>` script, and an entry in
`.agent/performance-budgets.md` recording the scenario, the ceiling, **and the observed result with
its runtime and platform**. A ceiling without a recorded result is an incomplete budget. Never
publish an unqualified universal timing claim.

## 24. Parity definition

Parity is product-quality capability coverage, not cloning. Evaluate component parity, feature
parity, and platform or cross-cutting parity across capabilities, states, interactions, keyboard,
accessibility, data behavior, responsive and adaptive behavior, localization, RTL, theming and
density, SSR/hydration/RSC, performance, integrations, edge cases, security, docs, and tests.

Parity does NOT require the same API, prop names, DOM, CSS, class names, package names, token
values, source architecture, assets, implementation, or undocumented quirks.

Never mark `parity-verified` from one render, screenshot, example, or test. Require the parity
matrix, specification, implementation, tests, documentation, and explicit divergence and dependency
dispositions with no unexplained gap. Intentional divergence is valid only when independently
justified and recorded in advance; it is never an after-the-fact excuse for a missed feature.

## 25. Dependency integration revalidation

If an earlier stage deferred an integration to this one, discover and resolve it now.

```text
1.01 Button deferred Button × SVGIcon integration → 1.03 SVGIcon
```

When executing the owning stage, implement the capability and then revalidate the declared
integration evidence, tests, and documentation without reimplementing the earlier component. Search
prior stage ledgers and parity documents for deferrals naming this stage. A lost obligation is a
stage defect.

## 26. Historical remediation

A completed component may need remediation because of new shared infrastructure, missed capability
analysis, an accessibility or security defect, an incorrect parity declaration, an architecture
correction, or a dependency that has since become available.

Do not erase history. Record original completion, the remediation, and the revalidation result, and
use the repository's governance mechanism. `ADR-020` and `F0.18` are the precedent: a governed stage
inserted at the current ledger boundary rather than a silent rewrite of a closed stage.

## 27. Architecture changes

If the stage exposes a genuine architecture problem, do not redesign silently. Follow the
`architecture-change` workflow with evidence, impact analysis, migration and rollback, and the
required acceptance state before continuing. Architecture is governed against casual mutation, not
permanently immutable.

## 28. Never weaken validation

Do not disable an ESLint rule, exclude source from TypeScript, suppress an accessibility or
security check, remove an architecture rule, broaden an ignore pattern, skip a test, rewrite a
snapshot to hide a defect, or declare a capability `not-applicable` without a rationale, in order
to make a stage pass. If a validator is genuinely wrong, fix it through governance, with evidence
and a rejection test.

## 29. Idempotent validation and generated artifacts

The stage must leave the repository repeatably valid. This is not acceptable:

```text
pnpm validate → PASS
pnpm validate → FAIL because the first run mutated tracked files
```

Regenerate and commit every repository-owned generated artifact: `pnpm generate:tokens`,
`pnpm generate:theme`, `pnpm generate:required-by`. Tool-owned output (`dist`, `.next`, coverage,
Playwright reports, test results, build info) stays ignored and is never committed.

Add a changeset under `.changeset/` for any supported public API change.

## 30. Required validation

The static gate builds before it lints, typechecks, analyzes architecture, and tests, because
workspace packages resolve only through their `exports` map into `dist`. Run `pnpm build` once
after a fresh install before running any single step on its own.

Run the targeted checks while developing — the validators for every foundation you touched, plus
`pnpm test:unit`, `pnpm lint`, `pnpm typecheck` — and then the stage-close gate:

```bash
pnpm validate
```

`pnpm validate` runs `pnpm validate:static` (38 read-only validators, formatting, build and output
verification, lint, strict types, dependency architecture, contract and unit tests) followed by the
production browser matrix in Chromium, Firefox, and WebKit.

Do not invent commands when a repository script exists. Record exactly what was executed and its
result. Never report a check as passing if it was not run. A gate result obtained only on a
worktree that already held build output is not reproducible evidence.

## 31. Stage evidence

Update, in this order:

1. `specs/components/<slug>.reference-analysis.md`, `.spec.md`, `.parity.md`;
2. `registry/components/<slug>.json` — status, rendering, composition, parity, features;
3. `registry/capabilities/*.json` — status and consumers for every capability this stage put into
   use, including one that was previously `planned`;
4. the applicable matrices: `.agent/feature-matrix.md`, `.agent/state-matrix.md`,
   `.agent/interaction-matrix.md`, `.agent/rendering-matrix.md`, `.agent/theme-matrix.md`,
   `.agent/accessibility-matrix.md`, `.agent/performance-budgets.md`;
5. `specs/foundation/<owner>.md` and its stage binding when this stage extended a foundation;
6. `.agent/stages/{{STAGE_ID}}-<slug>.md` — the ledger, using the established sections: `Outcome`,
   `Delivered scope`, `Contracts and files`, `Validation`, `Enterprise applicability`,
   `Decisions, debt, and blockers`, `Boundary audit`;
7. `.agent/stages/index.json` and `.agent/status.md`.

`Enterprise applicability` covers every `DEFINITION_OF_DONE.md` gate. `not-applicable` always
carries an explicit reason and is never a silent skip. `Boundary audit` states what was
deliberately not built.

## 32. Completion gate

Mark `COMPLETE` only when every applicable item holds:

```text
[ ] prerequisites verified and baseline green before starting
[ ] local reference preflight passed
[ ] exhaustive reference analysis complete; every examined path recorded
[ ] parity/capability matrix complete with an explicit disposition per capability
[ ] independent Casauran specification complete
[ ] API approved under API_GOVERNANCE.md
[ ] implementation complete; canonical foundations reused; no duplicate engine
[ ] unit tests pass
[ ] interaction, pointer, touch and keyboard tests pass where applicable
[ ] accessibility tests plus documented manual review pass
[ ] SSR, hydration and RSC checks pass where applicable
[ ] RTL, forced colors, reduced motion and density checks pass where applicable
[ ] i18n and IME checks pass where applicable
[ ] security review passes where applicable
[ ] performance budget recorded with scenario, ceiling, environment and result
[ ] deterministic visual fixtures exist and are reviewed
[ ] playground coverage exists where useful
[ ] production docs route, examples, API, keyboard and accessibility docs complete
[ ] deferred capabilities name explicit owner stages
[ ] deferrals owed to this stage by earlier stages are resolved
[ ] registry, capability registry, matrices and generated artifacts current
[ ] changeset added for supported public API change
[ ] stage ledger, index.json and status.md updated
[ ] pnpm validate passes from a reproducible starting point
[ ] validation is idempotent
```

If an applicable item is incomplete, the stage is not complete.

## 33. Outcomes

**COMPLETE** — every applicable acceptance criterion and gate passes with recorded evidence.

**BLOCKED** — correct completion is prevented by a genuine dependency: missing or invalid local
reference, unresolved architecture decision, unavailable prerequisite capability, security or
accessibility blocker, or a repository/tooling failure outside stage authority. Difficulty is not a
blocker. Record the exact blocker and what would unblock it.

## 34. Do not auto-advance

After `COMPLETE` or `BLOCKED`, stop. Name the next stage for orientation only. Do not begin it, do
not begin a phase, and do not start an unrelated refactor without a new explicit instruction.

## 35. Required final report

```text
Stage:  {{STAGE_ID}} — {{COMPONENT}}
Status: COMPLETE | BLOCKED
```

Then report, with evidence and without reproducing copyrighted reference text:

- **Requirements resolved** — what the stage required.
- **Reference analysis** — preflight result, document families inspected, capability families
  discovered, intentional divergences.
- **Parity matrix summary** — counts per disposition.
- **Implementation** — public API, core behavior, architecture choices, shared foundations reused
  or extended.
- **Accessibility** — semantics, keyboard and focus model, screen-reader considerations, manual
  review performed.
- **Documentation** — docs route and sections, examples, API, keyboard and accessibility docs,
  playground and visual fixtures.
- **Tests** — unit, interaction, accessibility, browser, visual, SSR, RTL, security, performance.
- **Validation** — commands actually executed and their results, ending with
  `pnpm validate: PASS | FAIL`.
- **Files changed** — important files and directories.
- **Deferred obligations** — each remaining item with its owner stage, or `None.`
- **Residual risks** — genuine remaining risks, or `None known within approved stage scope.`
- **Next stage** — for orientation only.

## 36. Execute

Resolve prerequisites. Run the reference preflight. Perform exhaustive local clean-room analysis.
Write the parity matrix and the independent specification. Approve the API under governance.
Implement every applicable capability, not the smallest renderable primitive. Test it. Document it
in `apps/docs` at production quality. Verify parity. Resolve integration obligations this stage
owns. Update registry, matrices, ledger, and status. Run `pnpm validate` without weakening any
gate. Then stop and report.
