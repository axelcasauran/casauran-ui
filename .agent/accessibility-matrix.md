# Accessibility Matrix

Map each component to its native semantic or applicable APG pattern and record role/name/state,
keyboard table, focus entry/movement/exit/restoration, announcements, disabled/read-only behavior,
touch/target size, zoom/reflow, forced colors, reduced motion, RTL, and IME requirements.

High-risk patterns include combobox, grid/treegrid, menu, tree, dialog, tabs, toolbar, listbox,
slider, date grid, and rich editor. Semantic HTML outranks unnecessary ARIA. F0.07 primitives are
reusable mechanics only; their presence does not mark any component or platform parity row
complete.

F0.08 hooks render no role, name, state, focus model, or announcement. Stable IDs and predictable
state ownership support later accessible relationships, but they do not certify any component or
advance the platform accessibility/data-binding parity registries.

F0.09 collection algorithms keep active, selected, disabled, expanded, and focused identity
separate. They render no role/name/state and map no keyboard event, so each component stage must
still prove its semantic pattern, focus model, RTL behavior, IME gating, and announcements.

F0.10 provides nested focus entry/containment/restoration and native-inert modal isolation plus
top-layer dismissal arbitration. It renders no role/name/state, close control, announcement, or
focus style and cannot declare an overlay modal; each component still proves its native/APG
semantics, modality, initial target, restoration, keyboard table, touch behavior, and manual review.
