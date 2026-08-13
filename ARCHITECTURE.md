# Architecture

## Goal

Build a capability-driven enterprise UI platform. Components are product surfaces; engines are reusable behavior; tokens/themes provide visual consistency; applications prove integration. We mirror public capabilities, not competitor package structure or private architecture.

## Product layers

Foundation → Design System → Components → Patterns → Blocks → Templates → Applications.

Technical dependency direction:
platform/native APIs → core/accessibility/events/commands → domain capability engines → React components → patterns/blocks/templates → Next.js applications.

Dependencies point downward. Engines never import high-level React components.

## Public package strategy

Initially supported consumer packages:

- `@casauran/react`
- `@casauran/tokens`
- `@casauran/theme`
- `@casauran/icons`

Other workspace packages are internal implementation packages. This retains modular ownership without prematurely promising dozens of public packages.

## Internal capability packages

Concrete domain packages: core, accessibility, events, commands, collections, overlay, positioning, virtualization, data, i18n, date-math, drag-drop, animation, forms, serialization, recurrence, formula, drawing, charting, files, export, testing, ai-core.

There is intentionally no generic `interfaces`, `engines`, or `adapters` package. Contracts and optional adapters are co-located with domain ownership. This implements the later refinement against speculative abstraction/package sprawl.

## Replaceable seams

A domain defines a contract when a real replacement boundary exists. Native implementation is default. Optional external adapter is introduced only after dependency approval and a real alternate implementation/integration exists. Public API remains independent from adapter types.

Examples: positioning owns positioning contracts; data owns data engine contracts; date-math owns date/time strategy seams; forms owns form integration seams.

## Component location

Supported React components live under `packages/react/src/components/<domain>/<component>/`. Directories are created when a component stage begins, not pre-created empty. Canonical metadata remains central under `registry/`, `specs/`, and `.agent/stages/`.

## Component DNA

Completed component source normally contains index, implementation, types, CSS, component-token declarations, tests and deterministic example/story modules. Specifications and registry records are canonical at repository root to avoid duplicate hand-edited truth.

## Composition

Higher-level components reuse canonical lower-level components when semantic capability matches. Toolbar uses Button/Icon. DatePicker uses field + Popup + Calendar + trigger. Editor uses Toolbar/buttons/dropdowns. Form uses Label/Hint/Error. Upload uses Button/ProgressBar.

Composition is semantic, not mechanical. A Grid cell does not become Button merely because it responds to click. When behavior is shared but visual semantics differ, reuse the engine rather than force visual composition.

## Core state/event architecture

Core owns stable IDs, controllable state/invariants and browser-safe utilities. Events remain idiomatic React callbacks; event utilities compose handlers, cancellation and normalized project event payloads. We do not create a global event bus for normal component interaction.

## Collections

Collections model ordered/tree item registration, active item, disabled items, selection and typeahead. ListBox, Menu, TreeView, dropdowns, Tabs and related controls reuse collection primitives while maintaining pattern-specific ARIA behavior.

## Overlay/positioning

Overlay owns portal, dismissable-layer and focus lifecycle. Positioning owns geometry, placement, collision, viewport constraints and observer-driven repositioning. Popup/Tooltip/Popover/Dialog/Menu/dropdowns compose these capabilities rather than duplicate them.

## Data

Data operations are framework-independent. Core descriptors include FilterDescriptor, SortDescriptor, GroupDescriptor, AggregateDescriptor, PageDescriptor and DataState. Processing is deterministic and reusable. Grid/TreeList/ListView/PivotGrid/Scheduler/Charts may consume appropriate data state without owning transport/database assumptions.

## Date/i18n/recurrence

`i18n` owns messages, locale, numbers/plurals/direction.
`date-math` owns calendar/date/range/time arithmetic and timezone seam.
`recurrence` owns recurring-event parsing/evaluation.
Visual date controls and planning components orchestrate those domains.
Formatting locale and arithmetic are not one giant localization package.

## Commands/history

Command infrastructure is used when systems need undoable semantic actions: Editor, Spreadsheet, Diagram and possibly complex planning interactions. Simple components do not route every action through a command bus.

## Serialization

Persistent component/product state uses versioned serializable models separate from live React instances. Grid state, Scheduler settings, Diagram models, Spreadsheet workbooks and dashboard layouts require migration/versioning before persistence formats are declared stable.

## Formula

Spreadsheet formulas use tokenizer → parser → AST → evaluator → function registry, independent of cell rendering/workbook UI.

## Drawing/Diagram

Drawing owns geometry/vector primitives. Diagram owns graph models, routing/layout, selection, drag/resize, commands/history and serialization. Reuse drawing without conflating it with Diagram UI.

## Charting

Charting separates series/data model, scales/axes, layout, labels/legend, interaction and rendering backend. Chart types are feature variants of shared chart architecture where practical, not 20 unrelated widgets.

## Files/export

File input/transport and export are independent domains. Grid requests export capabilities instead of embedding Excel/PDF logic. Upload uses file validation/transport contracts. Browser save/download belongs to files/export.

## AI

AI is optional and isolated. Core/tokens/theme/components cannot depend upward on AI. Provider SDKs, if adopted later, sit behind optional provider-neutral boundaries. Model/tool output is untrusted by default.

## Styling

Static CSS and CSS custom properties. Cascade order: reset → tokens → base → components → utilities → overrides. Use logical properties, reduced-motion and forced-colors support. Low specificity and documented state attributes are preferred.

## Tokens/themes

Primitive tokens → semantic tokens → component tokens → theme assignments. Themes include default light/dark/density/RTL/forced-colors/reduced-motion and independent Material-/Bootstrap-/Fluent-inspired interpretations. Do not copy proprietary source/values wholesale.

## Icons

SVG only. No icon font. Tree-shakeable definitions. Icon/SVGIcon components own rendering semantics/sizing; icons package owns vector definitions/provenance.

## Next.js-first integration

Next.js App Router hosts docs/playground/showcase/visual-tests. Libraries remain framework-agnostic. Routes default to Server Components. Interactive boundaries are minimal. Server-safe models/utilities do not import browser-only code. SSR output is deterministic and IDs/theme are hydration-safe.

## RSC strategy

Do not maintain a duplicate server-components product by default. Components are decomposed into server-safe models/formatters/renderable shells plus client interaction boundaries as needed. Registry records serverRenderable, requiresClient, clientReasons and hydrationSensitive.

## Build/distribution

Initial library build is ESM + declarations via TypeScript. Avoid adding a bundler until package/bundle evidence demands one. Public exports are explicit. Consumers never use `/src` or `/internal`. CSS side effects are declared.

## Dependencies

External library runtime dependencies are zero by default. React/ReactDOM are peers of the public React package. Next.js is application-only. Development tooling is centrally pinned but separately governed from runtime policy.

## Testing

Vitest for pure logic/engines. Playwright for real browser interaction, focus, pointer/touch, visual regression and integration. Next apps prove SSR/hydration/RSC-safe usage. Complex widgets add benchmark/security/a11y certification scenarios. Tests validate our independent spec, never undocumented competitor internals.

## Accessibility

WCAG 2.2 AA + applicable WAI-ARIA APG. Semantic HTML first. Component specs define keyboard/focus/announcements/touch/IME/forced-colors/reduced-motion. Complex patterns require manual evidence in addition to automation.

The internal accessibility owner supplies native tabbability/focus helpers, stateless roving-focus
and direction-aware keyboard intent, safe live-region updates, and visually-hidden CSS. It does not
own React state, collection registration/selection, overlay focus lifecycle, or component-specific
ARIA patterns.

## Security

HTML/URLs/SVG/files/clipboard/drag/serialized state/AI output are untrusted. Dangerous sinks/escape hatches are explicit and reviewed. Editor, Upload, PDF, Spreadsheet import, SVG/Diagram and AI stages require security evidence.

## Performance

Scenario-based budgets with dataset/environment. Measure render/update/input/scroll/memory/bundle/server costs as material. Virtualization supports realistic dynamic measurement and interaction. Regressions against accepted budgets block release.

## Compatibility

Track React/Next/Node/TypeScript/browser support plus SSR, hydration, RSC-safe imports, CSP, RTL, forced-colors, reduced-motion, touch/pointer and IME. Support changes are release decisions.

## Parity metadata

Three dimensions:

1. component inventory;
2. feature inventory per component;
3. cross-cutting platform parity.
   A component name alone never means parity.

## Reference baseline

Reference provenance is pinned by repository/path/commit/date. Upstream changes use explicit sync workflow and do not silently mutate active stage requirements.

## Architecture freeze

Architecture is frozen when development starts. Change requires ADR, evidence, options, compatibility/migration impact, rollout/rollback and explicit approval.

## 36. Casauran product identity

Brand and namespace contracts are architectural because they shape package names and consumer-facing customization.

- Brand: Casauran
- Product: Casauran UI
- Public package scope: `@casauran/*`
- Internal package scope: `@casauran-internal/*`
- CSS namespace: `csn`
- Diagnostic namespace: `CSN`

See `BRANDING.md`, `NAMING_CONVENTIONS.md`, and ADR-019.

## Local reference architecture

Casauran reference analysis uses an external documentation-only corpus at:

`../references/kendo-react-docs/docs/content`

or the path supplied through `CASAURAN_KENDO_DOCS_PATH`.

The corpus is outside the Casauran repository, read-only, and not a runtime/build dependency. Online fallback is disabled. Pinned GitHub repository/commit metadata exists only for provenance and controlled reference-sync work.

If the corpus cannot be validated, dependent reference-analysis/component work is blocked.
