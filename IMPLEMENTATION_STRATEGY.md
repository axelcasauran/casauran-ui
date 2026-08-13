# Implementation Strategy

## Product strategy

Build the platform bottom-up by capability ownership, but deliver visible product progress as one public component per stage. The sequencing is deliberately designed to discover architecture problems while they are cheap to fix.

## Phase 0 is mandatory

No public component work begins before repository governance, agent protocol, validators, build/test infrastructure, tokens/theme, accessibility/state/collections/overlay/data/i18n/date/virtualization/drag-drop foundations and the reference baseline have completed their gates.

Phase 0 is not "setup work to rush through"; it defines contracts that determine whether later enterprise widgets can reuse behavior.

## Proving the architecture

Phase 1 uses small components as probes:

- Button proves semantic primitives, tokens, states, event composition and keyboard/focus.
- Popup/Tooltip/Dialog prove overlay, positioning, portal and focus lifecycle.
- ListBox proves collections, active item, selection and keyboard navigation.

If these require local hacks, repair the owner capability before expanding breadth.

## Breadth before enterprise systems

Phases 2–4 stabilize API, CSS/theme, forms, collection, date, overlay and navigation conventions across a broad standard component set. Theme and accessibility consistency should be audited here before Grid magnifies inconsistencies.

## Enterprise systems as subsystem stages

Grid, TreeList, Scheduler, Gantt, Editor, Chart, Diagram, Map and Spreadsheet receive architecture/feature/state/interaction/keyboard/performance/security specifications before code. They are implemented as internal vertical slices but remain one public-component stage.

Shared engines are changed only through their owning package. A complex widget does not receive a private selection, clipboard, history, date or virtualization implementation.

## Improvement after parity

`parity-verified` means the independent spec derived from the approved behavioral reference is satisfied at our quality gates. `improved` is a separate lifecycle state for deliberate differentiation or stronger behavior. Do not mix speculative improvements into parity work when they increase risk or obscure verification.

## Integration proving grounds

The Next.js docs, playground, showcase and visual-test apps continuously exercise supported public packages. Phase 14 adds three serious applications—data/admin, scheduling and analytics—built only from public APIs. Repeated private imports or workarounds indicate a platform design flaw and block 1.0.

## Enterprise product disciplines

Every phase considers:

- API/version lifecycle
- accessibility and keyboard
- security/trust boundaries
- SSR/hydration/RSC imports
- i18n, RTL and IME
- responsive/adaptive behavior
- performance and bundle impact
- documentation/migration
- dependency provenance and licensing

The goal is not maximum component count. The goal is a durable product that can evolve without architectural rework.
