# Accessibility Matrix

Icon `1.02` is decorative (`aria-hidden`) by default; `label` deliberately promotes the span to a
named `role=img`. Its nested SVG is always hidden and unfocusable. It owns no keyboard, focus,
pointer, disabled, target-size, IME, or announcement behavior; actions compose Icon within their
semantic owner. Browser and manual visual review cover labelled/decorative separation, RTL, narrow
reflow, dark/light, and Chromium forced-colors exposure.

The 2026-08-16 capability revalidation closed two accessibility defects. A blank or whitespace-only
`label` published `role="img"` with an empty accessible name; such a label now keeps the icon
decorative, and a non-blank one is trimmed. `tabIndex` was forwarded, so an `aria-hidden` element
could take a tab stop; it is now rejected by the type, along with `role`, `aria-hidden` and
`aria-label`, which would contradict the semantics the component derives from `label`. Icon meets
the ADR-009 WCAG 2.2 AA baseline and publishes no keyboard table, because it owns no interaction.

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

Button `1.01` uses one native `<button>` with visible or caller-supplied naming, native `disabled`,
and `aria-pressed` only in explicit toggleable mode. Tab uses document order; Enter and Space use
native activation; focus remains on the button. Decorative start/end slots are hidden from the
accessibility tree and prohibit interactive descendants. Production browser evidence covers
role/name/state, keyboard, touch, a minimum 44px default target, visible focus, RTL, narrow reflow,
reduced motion, and Chromium forced-colors emulation. Manual code/pattern and visual review passed;
no claim is made for an unexecuted external screen-reader certification matrix. The 2026-08-15
capability revalidation recorded that the dense `xs` and `sm` steps and the compact density fall
below the 44px target and are documented for pointer-dense desktop surfaces only, and that composed
`Icon` artwork inside a Button contributes no second role, name, or interactive element.
