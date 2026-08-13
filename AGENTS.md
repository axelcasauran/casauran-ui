# AI Agent Constitution

## Mission
Build an independent enterprise React component/design-system platform with capability coverage comparable to the approved public KendoReact documentation baseline. Comparable means observable feature coverage and enterprise quality; it does not mean copying source, API, DOM, CSS, assets, package layout, private architecture, or undocumented quirks.

## Authority
Repository contracts are authoritative. Conversation memory is not. Precedence:
1. accepted ADRs;
2. this constitution;
3. architecture/policy documents;
4. registry and schemas;
5. stage ledger;
6. approved specifications;
7. executable tests;
8. implementation;
9. documentation examples.

If sources conflict, resolve the higher-authority contract before continuing affected work.

## Non-negotiable rules
1. Reference documentation is behavioral input, never implementation input.
2. Reference → feature extraction → independent spec → registry/test matrix → independent API → implementation → docs.
3. Exactly one public component per component stage.
4. A stage may extend shared engines required by its component, but may not silently ship another public component.
5. Composite components reuse canonical lower-level components when the semantic capability already exists.
6. Native semantic elements belong inside the component that owns the semantic primitive; Button may use `<button>`, Toolbar must not invent a second Button.
7. Shared behavior belongs in its capability owner, not copied into multiple components.
8. Browser/React/platform APIs are preferred before external runtime dependencies.
9. External runtime dependency adoption requires dependency evaluation and normally an ADR.
10. Do not install likely future dependencies merely to avoid later migration.
11. Third-party types must not leak into supported public APIs.
12. No broad package-root `'use client'` directive.
13. Semantic HTML first; ARIA augments semantics.
14. WCAG 2.2 AA is the baseline acceptance target.
15. Accessibility, keyboard, RTL, theming, localization, SSR/hydration and documentation are product requirements.
16. Do not weaken strict TypeScript, linting, tests or architecture validators to finish a task.
17. No explicit `any` as a shortcut.
18. Do not disable failing tests without proving the test is invalid.
19. Do not mark parity complete from a screenshot or component name.
20. Do not start the next public component early.
21. Finishing the stage is less important than preserving platform architecture.
22. Architecture changes after freeze require ADR, impact analysis, migration and explicit approval.
23. Security-sensitive trust boundaries are reviewed in the same stage, not deferred.
24. Performance claims require a defined scenario, dataset and environment.
25. Repository status/evidence must be updated when a stage closes.

## Agent operating model
Use one governing protocol plus specialist skills, not multiple competing autonomous personalities. The constitution defines authority. Skills provide domain checklists. Workflows provide procedure. ADRs preserve decisions. Registry files preserve inventory. Stage ledgers preserve sequence.

## Required reading
Every task reads this file, `.agent/status.md`, the active stage ledger and relevant skills. Architecture-affecting work also reads `ARCHITECTURE.md`, `DEPENDENCY_GRAPH.md`, `PACKAGE_POLICY.md`, `API_GOVERNANCE.md`, `SECURITY_ARCHITECTURE.md`, `NEXTJS_COMPATIBILITY.md` and affected ADRs.

## Mandatory component-stage sequence
1. Load stage ledger and skills.
2. Inspect approved public reference pages at the pinned baseline.
3. Extract observable feature/cross-cutting requirements.
4. Write independent specification.
5. Update registry and parity feature matrix.
6. Review composition and shared capability ownership.
7. Propose independent public API under API governance.
8. Implement/extend shared engines at their owner layer.
9. Implement exactly one public component.
10. Add all applicable tests.
11. Add component tokens/styles.
12. Validate theme matrix, RTL, accessibility, SSR/hydration and i18n.
13. Add executable docs/playground/visual stories.
14. Run full validation.
15. Run parity audit.
16. Update stage evidence, registry, roadmap/status.
17. Stop.

## Clean-room reference rules
Allowed: public feature inventory, documented behavior, keyboard/accessibility behavior, documented examples as behavioral evidence, use cases, integrations, edge cases.
Forbidden: copying source, CSS, theme values, assets, bundles, decompilation, reverse-engineered private architecture, intentionally matching undocumented DOM/class internals, or generating production code directly from reference implementation material.

## Capability ownership
`core`: IDs, controllable state, invariants, browser-safe utilities.
`accessibility`: focus, roving focus, live regions, keyboard primitives.
`events`: event composition and project event conventions.
`commands`: command/history primitives.
`collections`: registration, active item, selection, tree collections.
`overlay`: portal/dismissal/focus lifecycle.
`positioning`: geometry/collision/placement.
`virtualization`: windowing, measurement, anchoring, overscan.
`data`: filter/sort/group/aggregate/page descriptors and processing.
`i18n`: locale/messages/numbers/plurals/direction.
`date-math`: date/range/calendar/time arithmetic and timezone seam.
`drag-drop`: pointer drag/drop/autoscroll.
`animation`: CSS/WAAPI motion primitives.
`forms`: native/form state/validation contracts.
`serialization`: versioned persistence structures.
`recurrence`: recurring event rules.
`formula`: spreadsheet expression engine.
`drawing`: geometry/vector primitives.
`charting`: chart model/scales/layout/rendering.
`files`: file metadata/validation/transport contracts.
`export`: export models/integrations.
`ai-core`: optional provider-neutral AI contracts.
`react`: supported public React component surface.

A component must not create a local copy of capability logic owned elsewhere.

## Dependency decision protocol
Before runtime dependency adoption:
1. state exact missing capability;
2. evaluate browser/React/native option;
3. evaluate existing internal capability;
4. measure internal complexity/maintenance;
5. evaluate candidates for fit, bundle/tree-shaking, license, security, SSR/RSC, accessibility, release cadence, maintenance and upgrade risk;
6. define a domain-owned seam;
7. prototype only when uncertainty is material;
8. write ADR when adoption is proposed;
9. ensure public types remain provider-independent;
10. define exit/migration strategy.

TanStack, Floating UI, Radix, React Aria, date-fns, Framer Motion, react-hook-form, lodash and similar packages are not preinstalled speculatively.

## TypeScript rules
Use strict mode plus noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride, noPropertyAccessFromIndexSignature and useUnknownInCatchVariables. Prefer `unknown` at trust boundaries. Public generics must infer well. Avoid invalid state combinations through types where practical. No third-party type leakage.

## React rules
Functional components/hooks. Avoid effect-driven derived state. Controlled/uncontrolled conventions are project-wide. Refs expose only durable imperative needs. Scope Context narrowly. Preserve concurrency-safe behavior. Browser globals cannot be touched at server module evaluation. Minimize client boundaries.

## Next.js/RSC rules
Next.js App Router is the primary host. Routes default to Server Components. Interactive modules have local `'use client'` boundaries. Package roots/barrels do not contaminate server-safe imports. SSR output and IDs are hydration-stable. Browser observers/listeners start after mount. Registry entries declare server-renderability and client reasons.

## CSS/theme rules
Static CSS/custom properties. Cascade layers. Logical properties for RTL. Forced-colors and reduced-motion support. Component styles consume semantic/component tokens. Consumer override seams are documented. CSS imports remain in package sideEffects. No proprietary theme copying.

## Accessibility gate
For applicable components verify semantic role/name/state, keyboard-only operation, visible focus, restoration, announcements, disabled/read-only semantics, high contrast/forced colors, reduced motion, zoom/reflow, pointer/touch and IME composition. Automation supplements manual pattern review; it does not replace it.

## Security gate
Treat HTML, URLs, SVG, files, clipboard/paste, drag payloads, serialized state and AI output as untrusted. Arbitrary HTML is not trusted by default. Dangerous escape hatches require explicit naming, docs, tests and security notes.

## Performance gate
Define meaningful scenario budgets. Measure initial render, update/interaction latency, scroll/drag frame behavior, memory and bundle contribution. Virtualization is tested with realistic dynamic sizes/interaction. Never publish unqualified universal speed claims.

## Public API gate
All components follow `API_GOVERNANCE.md` for controlled state, events, refs, slots/renderers, styling hooks, accessibility passthrough, defaults and deprecation. Stable breaking changes require semver/migration.

## Lifecycle states
`unreviewed → reference-analyzed → specified → api-approved → implemented → tested → documented → parity-verified → improved`.
Do not jump states without required evidence.

## Parallelism
Serialize architecture-defining work and foundational phases. Parallelize only leaf components with stable shared contracts and disjoint ownership. Never parallelize Grid/TreeList/PivotGrid while data contracts are changing, or Scheduler/Gantt while date/recurrence contracts are unstable.

## Required stage outputs
Independent spec; registry/parity update; API contract; implementation; tokens/styles; unit/interaction/keyboard/accessibility/SSR-hydration/RTL/i18n-IME tests as applicable; visual cases; performance/security evidence where material; docs/examples; public-export verification; final validation; parity report; stage evidence.

## Escalation
Architecture conflict → architecture-change workflow/ADR.
Dependency request → dependency-proposal.
Parity scope change → reference/parity workflow.
Security exception → security review and ADR if architectural.
Stable breaking API → migration/versioning workflow.

## Architecture freeze
Once development begins, preference is not enough to alter architecture. New evidence may justify change, but it must be recorded with problem, options, decision, compatibility/migration, test impact, rollout/rollback and revisit trigger.

## Success condition
The platform is successful when serious applications can be built only from supported public APIs with coherent design, accessibility, performance, i18n, Next.js behavior and predictable upgrades. Visual similarity alone is not success.
