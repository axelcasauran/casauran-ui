# Drag and Drop Foundation Specification

Stage: `F0.16`
Status: implemented

## Scope and ownership

`@casauran-internal/drag-drop` owns reusable drag-session state, drop-target registration and
collision, native Pointer Events capture, keyboard-equivalent session transitions, cancellation,
cleanup, and edge autoscroll. It is internal, framework-neutral, React-free, dependency-free, and
below future component packages. It creates no supported consumer API.

The shared need is concrete: Sortable, Grid, TaskBoard, Scheduler, Gantt, Diagram, and file drop
surfaces must not each invent activation, target arbitration, cancellation, capture, or scroll-edge
behavior. Collections and data retain ordering/selection/data state; commands own undoable actions;
accessibility and components own focus, semantics, announcements, and pattern keyboard tables.

## Pointer session and activation contract

`createDragSession` accepts a finite non-negative activation distance and a drop-target registry.
Only a primary pointer with button zero may begin a pointer session. A session starts `pending`,
becomes `dragging` when Euclidean movement reaches the threshold, and returns immutable logical
snapshots containing the input kind, origin/current points, delta, opaque payload, and resolved
target. Non-owning pointer IDs cannot mutate or complete the session.

Mouse, pen, and touch share the Pointer Events path. The package does not synthesize mouse/touch
events, infer long press, mutate CSS `touch-action`, suppress clicks, or decide a component's drag
handle. The component documents and applies its intended touch-action and activation policy.

## Drop targets and collision contract

`createDropTargetRegistry` owns token-safe registration, update, disposal, disabled targets,
payload acceptance, stable registration order, and current rectangle lookup. IDs are unique,
rectangles and priorities are finite, and stale or repeated cleanup cannot remove a later owner.

Resolution supports pointer-within, rectangle-intersection, and closest-center strategies. Priority
wins first; strategy score, smaller area, and registration order provide deterministic ties. The
caller supplies current rectangles and chooses the strategy appropriate to its component. This
engine does not infer list indexes, reorder records, move DOM, or execute a domain drop command.

## Pointer capture and cleanup lifecycle

`createPointerDragController` attaches only Pointer Events to an explicitly supplied mounted
element. After an accepted pointerdown it calls `setPointerCapture`, forwards owned moves, completes
on pointerup, and cancels on pointercancel or lost capture. Disposal removes every listener,
releases owned capture when possible, and produces one deterministic cancellation result.

Capture failures from disconnected/released elements are contained during cleanup. Payload
creation and callbacks are trusted application functions. The controller never reads `window`,
`document`, or another browser global at module evaluation.

## Keyboard alternative and accessibility boundary

The same session supports an immediate keyboard start, explicit logical movement deltas, target
resolution, drop, and cancel. This prevents a pointer-only state model, but key mapping remains
with the semantic component because APG patterns differ. A typical reorder owner may map Space to
lift, arrows to movement, Enter/Space to drop, and Escape to cancel while keeping focus stable.

The engine renders no role, accessible name/state, grabbed description, live region, focus ring,
instructions, or result message. Components must provide localized instructions and announcements,
preserve visible focus, expose valid disabled/read-only behavior, support keyboard-only completion,
and manually review the final pattern. Pointer movement never substitutes for keyboard semantics.

## Autoscroll contract

`calculateAutoScrollDelta` converts pointer proximity to a bounded per-frame physical delta using
finite container geometry, scroll extents, edge threshold, maximum pixels-per-second, and elapsed
time. It clamps at each scroll boundary. `createAutoScroller` receives a caller-supplied frame
environment and containers ordered inner-to-outer, scrolls the first eligible owner per axis, and
stops scheduling when no movement remains.

Updating to a null pointer, `stop`, and `dispose` cancel the pending frame. Components own which
containers participate, when a drag activates autoscroll, virtualization refresh, scroll event
effects, and RTL normalization. Maximum frame elapsed time is bounded to avoid a large jump after a
throttled frame.

## Security and trust boundaries

Points, rectangles, IDs, thresholds, speeds, elapsed time, scroll metrics, and pointer identifiers
are validated for finite and bounded shape. Generic payload and target data are carried opaquely;
the engine never clones, parses, renders, serializes, logs, persists, sends, executes, or trusts
their contents. Acceptance, rectangle, payload-factory, frame, and completion functions are trusted
application code and must not be constructed from untrusted executable input.

There is no HTML/SVG/CSS/URL sink, `DataTransfer`, file/clipboard access, storage, network, dynamic
code, cross-document channel, or native external-file drop support. Future file-drop components
must validate file metadata/content at the files owner and add their own security evidence.

## Performance contract

Session transitions are constant-time. Target resolution is linear in registered targets and uses
no global spatial cache because visible drop geometry is dynamic and component-owned. Autoscroll is
linear in the caller's nested container chain and schedules at most one owned animation frame.

The pinned-Node benchmark exercises 2,000 current targets across 5,000 collision queries plus
50,000 autoscroll calculations under a five-second regression ceiling. This is an engine regression
guard, not a universal frame-rate, input-latency, memory, bundle, or component rendering claim.
Component stages define representative target counts, DOM/frame budgets, and virtualization costs.

## RTL, i18n, IME, theming, and responsive behavior

Pointer coordinates and autoscroll metrics are physical browser geometry. Components translate
logical reorder/resize intent and normalize browser-specific RTL horizontal scroll behavior at the
DOM boundary. I18n owns localized instructions/result messages and direction; the engine does not
format or reverse data.

The engine accepts no text input and performs no composition commit. Component keyboard handlers
must ignore inappropriate composing or command-modified events. Theme, density, forced colors,
reduced motion, zoom/reflow, touch-target size, drag previews, and adaptive layouts are rendering
requirements for later component stages.

## SSR, hydration, and integration

The package root is side-effect-free and safe for Node, SSR, hydration, and React Server Component
evaluation. Pure session/target/autoscroll calculations import without React, a client directive,
browser global, timer, random source, storage, network, locale, or current clock. Browser capture
and frame scheduling begin only after a mounted owner supplies its element/environment.

A production Server Component imports the compiled root and renders deterministic keyboard session
and collision results. One local client fixture proves primary pointer threshold/capture/drop,
keyboard-equivalent drop/cancel, touch Pointer Events, nested edge autoscroll, and cleanup in
Chromium, Firefox, and WebKit. The fixture is evidence, not a public component.

## F0.17 boundary

F0.16 adds no public component, React hook/provider/sensor, drag preview, sortable model, domain
reorder/resize logic, external/native file transport, ARIA pattern, component style, or reference
analysis. F0.17 Reference Baseline remains `not-started` when this stage closes.
