# Engine Matrix

Shared capabilities: state, focus/keyboard, collections/selection, overlay/positioning, data
operations, virtualization, drag/drop, date math, recurrence, commands/history, serialization,
formula, drawing, charting, files/export. Engines exist for concrete reuse, not architectural
ornament.

The F0.07 accessibility owner implements focus/tabbability inspection, stateless roving focus,
direction-aware keyboard intent, live-region text delivery, and visually-hidden CSS. It explicitly
does not absorb F0.08 React state, F0.09 collection registration/selection, or F0.10 overlay focus
lifecycle.

The F0.08 state owner implements pure value/update and ID rules in core plus controllable state,
latest-committed callbacks, hydration readiness, and stable IDs in `@casauran/react/state`. It does
not implement a global store, generic context framework, collection/overlay/form state,
persistence, or component-specific state machine.

The F0.09 collections owner implements immutable ordered/tree snapshots, mutation-safe keyed
registration, enabled active-item movement, deterministic single/multiple/range selection,
visible-tree projection, and caller-timed typeahead. It does not own React bindings, focus,
keyboard events, APG semantics, overlay, virtualization, data processing, locale policy, or
persistence.

The F0.10 overlay owner implements governed portal hosts, ordered top-layer arbitration,
Escape/pointer-outside dismissal intent, nested focus entry/containment/restoration, and native
inert modal isolation. It does not own positioning geometry/observers, animation, React bindings,
open state, APG semantics, content, styling, scroll locking, or public overlay components.
