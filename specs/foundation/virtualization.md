# Virtualization Foundation Specification

Stage: `F0.15`
Status: implemented

## Scope and ownership

`@casauran-internal/virtualization` owns reusable axis windowing, size measurement, stable-key
measurement reuse, scroll-anchor adjustment, overscan, focus pinning, and orthogonal 2D window
composition. It is an internal framework-neutral package below React and future large-data
components. It has no runtime dependency and implements accepted ADR-011 without creating a
supported consumer API.

The shared need is concrete: long lists, Grid, TreeList, Scheduler, Gantt, and Spreadsheet must not
each invent offset lookup, dynamic size correction, or scroll anchoring. Collections still owns
active/selection state, data owns processing, accessibility owns focus primitives, and components
own semantics, scroll elements, rendering, loading, and interaction.

## Axis and overscan contract

`createVirtualAxis` accepts a bounded item count, a finite positive constant or per-index estimate,
an optional stable key function, and item-count overscan. Geometry is expressed as logical
non-negative offsets and sizes. The engine returns frozen absolute item records with index, key,
start, size, end, and measured state plus visible and rendered bounds, total size, and contiguous
padding.

Window lookup clamps offsets beyond the current total, accepts zero-sized viewports, and uses an
ordered prefix-sum index for logarithmic offset lookup. Overscan is explicit before/after item
count, never a hidden velocity heuristic. Empty axes use `-1` index sentinels and zero geometry.

## Dynamic measurement and stable keys

Measured sizes must be finite and greater than zero. Batches reject duplicate or out-of-range
indexes rather than applying order-dependent updates. Measurement replaces estimates without
mutating returned windows. Size lookup, offset lookup, and updates are logarithmic; rebuilding a
changed count is linear and preserves known measurements by stable key.

The maximum axis count is 2,000,000 to bound typed-array allocation at this trust boundary while
covering realistic million-row products. Duplicate, non-string, non-finite numeric, and otherwise
invalid keys fail before a usable engine is returned. Callers own stable identity and call
`clearMeasurements` after geometry policy changes that invalidate prior observations.

## Scroll anchoring and alignment

Measurement, count changes, and clearing return previous/next totals plus a `scrollAdjustment`.
When a supplied stable anchor exists before and after the mutation, the adjustment is the change
in that item's logical start. The scroll owner applies it to the current logical scroll offset to
avoid a visible jump. Missing anchors produce zero adjustment; the engine never mutates a browser
scroll position.

Index targeting supports start, center, end, and auto alignment. Results are clamped to the
logical scroll extent. Components decide animation, focus, reduced-motion behavior, RTL browser
normalization, and when to commit the returned offset.

## Focus and selection preservation

Window queries accept explicit pinned indexes. Pinned items are returned in sorted order even when
outside the contiguous overscanned range, allowing a component to keep a focused or active DOM
owner mounted. This engine neither moves focus nor stores active/selected state. Components obtain
that state from their pattern and collection owner, pin the necessary index, and retain correct
ARIA position/set metadata for the complete logical collection.

## Two-dimensional virtualization

`createVirtualGrid` composes independent row and column axes and returns their windows and total
height/width. It does not materialize the Cartesian cell matrix, so the caller renders only the
necessary cells and can combine pinned row/column indexes for a focused cell. Row/column
measurement and anchoring use the same axis contract. Frozen panes, merged cells, masonry, sticky
regions, and component-specific keyboard navigation remain future composition work.

## Browser measurement lifecycle

`createElementMeasurementObserver` is an explicit bridge around a caller-supplied native
`ResizeObserver` constructor. It maps observed elements to indexes, reads border-box block or inline
size, batches observations through the axis, and reports anchor adjustment to the caller. It owns
only measurement lifecycle: callers own elements, scheduling, scrolling, rendering, and applying
adjustments. `disconnect` releases native observation.

The package never reads `window`, `document`, or `ResizeObserver` at module evaluation. Pure axes
can run entirely on the server; the observer is constructed only after a browser environment is
explicitly supplied.

## Accessibility, input, RTL, and i18n

Virtualization is accessibility-relevant because unmounted content can lose focus or expose
incorrect collection metadata. The foundation supplies focus pinning but renders no semantics and
owns no role, accessible name/state, live region, keyboard/pointer/touch/IME event, or tab order.
Public components must preserve logical counts/positions, keyboard reachability, focus visibility,
selection, announcements, zoom/reflow, and non-virtual fallback where an accessibility pattern
requires it.

Offsets are logical. Components normalize browser-specific RTL `scrollLeft` behavior at their DOM
boundary and use logical CSS properties. Locale formatting and direction come from i18n; theme,
density, forced colors, reduced motion, and responsive/adaptive layout are rendering concerns.

## Security and validation

Counts, indexes, offsets, viewports, estimates, measured sizes, overscan, and keys are validated.
The engine stores only keys and numeric geometry. It renders no HTML/SVG/CSS, evaluates no caller
string, executes no serialized callback, and performs no storage, network, URL, file, clipboard,
or dynamic-code operation. Estimate/key functions and the supplied observer constructor are
trusted application code, not accepted from untrusted serialized input.

## Performance contract

Prefix sums use a Fenwick tree: total/offset lookup and dynamic updates are `O(log n)`, window
discovery is `O(log n + rendered items)`, and count rebuild is `O(n)`. The 100,000-row by 10,000-
column benchmark performs deterministic window queries, measurement corrections, anchor checks,
and 2D queries under a five-second ceiling on the pinned Node runtime. That ceiling is an engine
regression guard, not a universal browser frame-rate, memory, render, or component latency claim.

The engine avoids cell-matrix allocation and global caches. Component stages define scroll-frame,
DOM-node, memory, input-latency, and server-fallback budgets for realistic rendered datasets.

## SSR, hydration, and integration

The package root is side-effect-free and safe during Node, SSR, hydration, and React Server
Component evaluation. It imports no React module, has no client directive, and reads no browser
global, timer, random source, storage, network, locale, or current clock. A production Server
Component imports the compiled root and emits deterministic 1D/2D windows. A local client fixture
proves native dynamic measurement, anchor adjustment, overscan, focus pinning, and cleanup across
Chromium, Firefox, and WebKit.

SSR callers render a deterministic estimated window or a non-virtual fallback chosen by the
component specification. The first client render must use compatible count/key/estimate inputs;
actual measurement begins after mount and corrections are applied through the explicit mutation
result.

## F0.16 boundary

F0.15 adds no public component, React hook/provider, collection/data state, infinite loader,
sticky/frozen/masonry layout, automatic scroll scheduling, drag gesture, drop target, or
autoscroll. F0.16 Drag and Drop remains `not-started` when this stage closes.
