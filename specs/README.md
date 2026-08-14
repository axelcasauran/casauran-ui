# Specifications

Specifications are created when their stage begins, after reference analysis. Future component specs are intentionally not prefilled because that would bypass the clean-room workflow.

Use the complete templates under `specs/templates/`.

Complex widgets create a folder under `specs/components/<slug>/` and use the complex-widget architecture template plus feature/state/interaction/keyboard/performance/security documents.

Foundation contracts live under `specs/foundation/`. Implemented contracts include tokens,
CSS/theme runtime, accessibility, React state, collection-engine, overlay, animation, data-engine,
internationalization, and date-math ownership under that directory.
Virtualization windowing, measurement, anchoring, focus-pinning, 2D and SSR ownership is specified
there as well.
Drag-drop session, target, pointer capture, keyboard, cancellation, autoscroll and SSR ownership is
specified there as well.
Pinned reference provenance, local-corpus inventory, component mapping, clean-room boundaries and
sync ownership are specified there as well; this metadata foundation advances no component.
