# Interaction Matrix

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
