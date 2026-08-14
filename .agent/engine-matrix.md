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

The F0.11 animation owner implements finite token-resolved timing, explicit reduced-motion
observation, deterministic native playback settlement, keyed interruption ownership, and
revision-safe presence state. It does not own CSS token values, effects/keyframes, React bindings,
component rendering/semantics, layout/positioning, gestures, scroll timelines, or data processing.

The F0.12 data owner implements readonly filter/sort/group/aggregate/page state, safe own-field
access, bounded filter validation, stable immutable processing, and deterministic leaf paging. It
does not own remote transport/query generation, persistence, virtualization, tree/pivot/formula
processing, locale collation, React bindings, columns, components, or interaction state.

The F0.13 i18n owner implements explicit locale canonicalization/fallback, script direction,
immutable plain-text catalogs/interpolation, plural rules, number/date-time formatting, and
collation through native `Intl`. It does not own locale negotiation/state/transport, parsing,
React providers, input/IME, DOM/CSS, date arithmetic, recurrence, or public components.

The F0.14 date-math owner implements immutable validated Gregorian dates, explicit day/month/year
overflow, ISO and caller-policy weeks, inclusive date ranges, wall/local time arithmetic, and a
native-Intl timezone strategy with explicit DST disambiguation. It does not own display locale,
parsing, recurrence, business calendars, React, interactions, rendering, or public components.

The F0.15 virtualization owner implements logical 1D/2D windows, explicit item overscan,
stable-key dynamic measurement, scroll-anchor adjustment, focus pinning, and explicit native
element observation. It does not own collection/data state, semantics/focus movement, React,
scroll containers/events/mutation, loading, sticky/frozen/masonry layouts, RTL DOM normalization,
drag/drop autoscroll, or public components.

The F0.16 drag-drop owner implements immutable pointer/keyboard sessions, threshold activation,
token-safe target registration and deterministic collision, explicit Pointer Events capture/
cancellation, and bounded nested-container autoscroll. It does not own data/collection mutation,
commands/history, focus/ARIA/announcements, React, previews/styles, file transport, domain reorder/
resize rules, RTL DOM normalization, or public components.
