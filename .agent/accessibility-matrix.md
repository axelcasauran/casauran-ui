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

F0.11 resolves nonessential motion to immediate final state and observes the system preference
without hidden module-global browser access. It renders no semantics/focus and cannot certify a
future transition component; every component still proves equivalent reduced-motion content,
state, focus, interaction result, forced-colors behavior, and manual review where applicable.

F0.12 renders no role/name/state, control, loading/error message, group header, sort/filter
announcement, or keyboard model. Components consuming data results still prove localized
controls/results/counts, focus and input behavior, semantics, live updates, forced colors, zoom,
RTL, and manual review; engine output alone advances no accessibility parity row.

F0.13 supplies plain-text message fallback, plural/number/date formatting, and locale-derived
direction for visible and accessible text. It renders no role/name/state, announcement timing,
focus, keyboard, pointer, touch, or input and never handles IME events. Component stages still
prove consistent visible/accessible localization, `dir` placement, logical layout, composition
safety, and manual review; no reference parity row is advanced.

F0.14 provides arithmetic only: immutable dates/ranges/times, week calculations, and explicit DST
resolution. It renders no role/name/state, date grid, error, announcement, focus, keyboard, pointer,
touch, or IME behavior. Future components still prove localized accessible text, navigation,
selection, invalid/ambiguous-time feedback, logical layout, zoom, target size, and manual review.

F0.15 supplies pinned-index retention so a caller-owned focused/active item need not unmount during
window changes. It renders no role/name/state, logical count/position metadata, keyboard model,
announcement, focus style, or fallback. Each virtualized component still proves reachability,
selection, `aria-setsize`/position or grid metadata as applicable, zoom/reflow, touch targets,
loading feedback, and manual assistive-technology review.

F0.16 prevents pointer-only domain state by exposing equivalent keyboard start/move/drop/cancel
transitions, but renders no role/name/state, instructions, live result, focus movement/style, or
APG keyboard table. Each consuming component must keep focus visible, localize instructions and
results, define disabled/read-only policy, verify target size/zoom/reflow/touch behavior, and
manually review the complete assistive-technology workflow; no parity row is advanced.
