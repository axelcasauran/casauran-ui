# @casauran-internal/drag-drop

**Ownership:** pointer-driven drag/drop and autoscroll primitives.

## Status

F0.16 implements a framework-neutral drag session, drop-target registry, native Pointer Events
capture controller, keyboard-equivalent transitions, cancellation/cleanup, and bounded edge
autoscroll. The package is dependency-free, React-free, and safe to import during SSR/RSC.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

The engine owns state, capture, collision, and autoscroll—not DOM rendering, drag previews,
reordering, selection, focus, ARIA, announcements, RTL `scrollLeft` normalization, or styles.
Components choose their collision strategy, map their keyboard table, apply `touch-action`, provide
localized accessible feedback, and commit the returned opaque payload/target result to domain state.

Browser work is explicit: `createPointerDragController` requires a mounted capture element and
`createAutoScroller` requires caller-supplied animation-frame scheduling and scroll containers.
`dispose()` cancels owned work. Pure target/session calculations can run entirely on the server.

Payload and target data are untrusted opaque values. No `DataTransfer`, file, clipboard, HTML, URL,
storage, network, serialization, or dynamic-code sink exists. See
`specs/foundation/drag-drop.md` for the complete contract and the F0.17 boundary.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
