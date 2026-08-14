# Interaction Matrix

Icon `1.02` has no interaction contract. Pointer, keyboard, touch, focus, IME, clipboard, drag,
resize, scroll, and animation behavior are not applicable; native attributes are forwarded only for
caller-owned noninteractive integration. Its flip transform is visual and does not alter direction
or input semantics.

Evaluate keyboard, pointer/mouse, touch, screen-reader modes, IME composition, clipboard, drag/drop, resize/scroll, reduced motion and high zoom. Mouse behavior is not the primary model for keyboard semantics.

Directional-key helpers ignore command-modified and composing events. Each owning pattern decides
orientation, RTL mapping, looping, selection coupling, typeahead, and page movement; none is
inferred from pointer behavior.

React state setters resolve functional updates from the latest committed value and suppress
`Object.is`-equal requests. This foundation does not assign keyboard, pointer, touch, focus, or IME
semantics; each owning component connects state changes to its interaction contract.

Collection movement consumes logical intents and never reads browser events. Typeahead consumes
caller timestamps and committed text; the caller suppresses composition input. Component patterns
own orientation, RTL, focus, selection coupling, pointer/touch behavior, and APG keyboard tables.

Overlay dismissal is top-layer-only for unmodified, non-composing Escape and primary pointer-down
outside the layer/branches. Nested focus scopes suspend parents, wrap current tabbables, and restore
in stack order. Components still own close controls, pattern-specific keys, open-state updates,
pointer/touch policy, and whether modal containment/isolation applies.

Animation playback exposes explicit finish, cancel, AbortSignal, reduced-motion, and token-safe
replacement settlement. It does not infer a keyboard, pointer, touch, IME, gesture, or semantic
interaction; component owners map their complete interaction contract to the motion lifecycle.

Data descriptors express requested filter/sort/group/aggregate/page state but contain no event,
selection, active-item, keyboard, pointer, touch, drag, focus, or IME policy. Components own
intent-to-state mapping, server loading/errors, optimistic behavior, and accessible feedback;
collections and virtualization retain their separate interaction owners.

F0.13 functions receive locale and data explicitly and emit immutable metadata or strings. They
have no event, keyboard, pointer, touch, focus, selection, drag, or composition lifecycle. Input
components must suppress premature IME commits and applications own locale-switch state; both
recompute through the stateless engine rather than mutating a global locale.

F0.14 operations consume validated values and explicit overflow/week/timezone/DST policies. They
have no event, selection, keyboard, pointer, touch, drag, focus, or composition lifecycle. Date and
planning components own parsing, edit state, IME commit timing, navigation, disabled dates,
drag/resize intent, and feedback for rejected or adjusted local times.

F0.15 consumes logical scroll geometry and emits windows, target offsets, and explicit anchor
adjustments. It subscribes to no scroll/keyboard/pointer/touch/IME event and mutates no scroll
container or focus. Components own scheduling, RTL DOM normalization, applying corrections,
focus/selection pinning, loading, drag/drop, and all pattern interaction semantics.

F0.16 accepts only primary button-zero Pointer Events, activates at an explicit movement threshold,
retains capture through move/up, and cancels on pointercancel, capture loss, disposal, or explicit
intent. Keyboard sessions use the same target/drop/cancel state but consume caller-supplied logical
deltas; components own key maps, focus, announcements, composition/modifier gating, touch-action,
click suppression, domain mutations, and RTL logical intent. Autoscroll stops explicitly.

Button `1.01` delegates pointer, touch, Enter, Space, focus order, and form activation to its native
`<button>`. Consumer `onClick` runs before pressed-state intent and `preventDefault()` cancels the
owner transition. Production Playwright evidence covers pointer/click, touch tap, Enter, Space,
disabled suppression, controlled/uncontrolled pressed state, cancellation, form submission, and
forwarded focus across Chromium, Firefox, and WebKit. It owns no text input, clipboard, drag,
resize, or IME commit path.
