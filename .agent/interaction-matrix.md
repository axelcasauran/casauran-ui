# Interaction Matrix

Evaluate keyboard, pointer/mouse, touch, screen-reader modes, IME composition, clipboard, drag/drop, resize/scroll, reduced motion and high zoom. Mouse behavior is not the primary model for keyboard semantics.

Directional-key helpers ignore command-modified and composing events. Each owning pattern decides
orientation, RTL mapping, looping, selection coupling, typeahead, and page movement; none is
inferred from pointer behavior.
