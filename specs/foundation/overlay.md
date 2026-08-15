# Overlay Foundation Specification

Stage: `F0.10`
Status: implemented

## Scope and ownership

F0.10 defines the internal browser-lifecycle engine for portal hosts, ordered overlay layers,
top-layer dismissal, nested focus scopes, and modal background isolation. The owner is
`@casauran-internal/overlay`. It composes native DOM APIs and the internal accessibility focus
helpers, with no external runtime dependency and no React or public component API.

Overlay lifecycle and positioning geometry remain separate. Positioning owns coordinates,
placement, collision, viewport constraints, and scroll/resize observation. Components own open
state, semantic roles/names/states, APG keyboard tables, content, styling, animation, and product
events.

## Portal hosts and inherited scope

`createPortalHost` creates one marked container in an explicit parent or the owner document body,
copies only the governed `data-theme`, `data-density`, and `dir` scope values from an explicit
source, and returns idempotent synchronization and destruction operations. It never copies
arbitrary attributes, IDs, HTML, event handlers, or URLs. `synchronizePortalScope` removes a
governed attribute when the source no longer supplies it, allowing callers to synchronize after a
theme/density/direction change without an always-running observer.

Portal creation is invoked only after a browser document exists. Merely importing the package is
server-safe. A portal host is infrastructure, not a public Popup/Portal component.

## Ordered layer stack

`createOverlayLayerStack` owns deterministic registration order for caller keys. Registering a new
key appends it; registering an existing key replaces its record without changing order. Cleanup is
token-aware, so stale cleanup cannot remove a newer registration. The last live key is the top
layer. The stack stores caller-owned records but does not inspect DOM, dispatch events, or mutate
open state.

## Dismissable layers

`createDismissableLayerManager` installs one capture listener per relevant event on a supplied
document while layers exist. Only the current top layer can receive one dismissal request for a
given `Escape` keydown or primary pointer-down outside its element and registered branches.
Inside interactions, repeated/modified/composing Escape input, non-primary pointer buttons,
disconnected targets, and disabled dismissal reasons do not request dismissal.

The callback receives a typed reason and original event; it is an intent request. The application
owns controlled/uncontrolled open state and removes the layer when appropriate. A dismissal event
does not cascade to a newly exposed parent layer during the same event dispatch. Branches allow
logical descendants rendered in separate portal subtrees to count as inside.

## Focus scopes

`createFocusScopeManager` coordinates scopes per supplied document. Activation records the
previously focused element and focuses, in order, an explicit initial target, the first tabbable
descendant, an explicit fallback, or the scope root. Only the top active scope contains focus and
wraps `Tab`/`Shift+Tab`; nested parent scopes remain suspended. Targets are resolved at operation
time so replaced DOM nodes are not retained as authoritative state.

Entry and fallback targets outside the scope root are ignored. Command-modified or composing Tab
is not captured. Deactivating the top scope restores an explicit target or its captured pre-activation focus when
still focusable. If restoration fails and another scope is active, focus returns inside that
scope. Deactivating an older non-top scope does not steal focus. Components choose whether a scope
traps or restores; nonmodal overlays can use entry/restoration without trapping.
When modal isolation is composed with a restoring focus scope, cleanup releases isolation before
deactivating the focus scope so the restoration target is focusable again.

## Modal isolation

`createModalIsolationManager` applies the native `inert` property to sibling branches along the
active modal root's ancestor path through the document body. Reference counts preserve preexisting
inert state and nested modal isolation. Token-aware deactivation restores only values owned by the
manager and never removes caller-owned inertness. The manager does not add `aria-hidden`, rewrite
semantics, lock scrolling, or claim that a component is modal.

## Accessibility and interaction requirements

The foundation owns focus entry, optional containment, nested restoration, top-layer Escape and
pointer-outside arbitration, and native inert isolation. It renders no role, accessible name,
description, state, live announcement, visible focus style, or touch target. Components still
prove their native/APG semantics, keyboard table, modality decision, focus target, restoration
policy, pointer/touch behavior, zoom/reflow, forced colors, reduced motion, RTL, and IME behavior.

Escape dismissal ignores IME composition and command modifiers. Focus traversal uses current DOM
tabbability and does not infer selection or application commands. Pointer dismissal does not
replace keyboard-accessible close controls required by applicable patterns.

## SSR, security, and performance

All browser access occurs inside explicitly invoked factories; package import performs no DOM read,
listener registration, ID generation, timer, storage, or network operation. Server rendering and
RSC module evaluation are safe. Managers remove listeners and owned mutations when their last
registration ends.

Elements, callbacks, and events are trusted application references. Portal scope synchronization
copies only fixed enumerated attributes through `getAttribute`/`setAttribute`; it never accepts or
parses markup. Dismissal event targets are checked as `Node` instances in their owner document.
There is no arbitrary HTML, URL, serialization, dynamic execution, or cross-document adoption.

Layer operations are linear only where current stack order must be inspected; top lookup is
constant-time. Focus traversal queries the active scope on each relevant interaction. Modal
isolation walks the active ancestor path and siblings. A deterministic 1,000-layer unit scenario
guards order and token-safe cleanup without making a universal timing claim.

## Compatibility and integration

The package remains private/internal with one compiled root export. Its only runtime dependency is
the existing internal accessibility owner for tabbability and one-shot focus. A production Next.js
client probe imports the compiled package after a server-rendered shell and verifies portal scope,
nested dismissal, focus containment/restoration, modal inertness, and cleanup across Chromium,
Firefox, and WebKit.

## F0.11 boundary

F0.11 owns animation foundations. F0.10 introduces no transition/presence engine, positioning
geometry, Popup, Tooltip, Popover, Dialog, Window, Menu, dropdown, React hook/context/provider,
public export, component token/style, scroll lock, localization runtime, or future component API.
