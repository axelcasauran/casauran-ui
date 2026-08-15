# Collection Engine Specification

Stage: `F0.09`
Status: implemented

## Scope and ownership

F0.09 defines a framework-neutral internal engine for ordered and hierarchical item identity,
registration, active-item movement, selection, visible-tree projection, and typeahead. The owner is
`@casauran-internal/collections`. The engine consumes no React, DOM, accessibility, overlay,
virtualization, data-processing, i18n, storage, or external runtime package.

## Identity and immutable snapshots

Collection keys are `string | number`; object identity and array index are not durable keys. A
`CollectionItem` contains a key, optional parent key, disabled flag, text value, and generic
metadata. `createCollectionSnapshot` copies item records and produces immutable ordered keys,
root keys, child relationships, parent/depth lookup, and enabled-key lookup.

Sibling order follows input/registration order. Flattened order is deterministic depth-first
preorder, so every parent precedes its descendants. Duplicate keys, self-parenting, missing parents,
and parent cycles throw `CollectionInvariantError` with stable codes. Metadata is caller-owned and
is not cloned, executed, serialized, or treated as display markup.

## Registration lifecycle

`createCollectionRegistry` owns keyed item records and registration order. Registering a new key
appends it. Re-registering an existing key replaces its record without moving it. Each registration
returns a token-aware cleanup; cleanup from an older registration must not remove a newer record.
Explicit unregister, clear, size, and immutable snapshot operations are supported. Snapshots, not
the mutable registry, are passed to algorithms and renders.

## Active item movement

Active identity is distinct from selection and focus. `resolveActiveKey` preserves an enabled
preferred key or selects the first enabled key. `moveActiveKey` accepts only logical
`previous | next | first | last` intent, skips disabled records, optionally loops, and handles
missing/empty/all-disabled state. Components map actual keys, orientation, direction, paging, and
tree parent/child commands according to their own APG pattern.

## Selection model

Selection state contains deterministic snapshot-ordered selected keys and a nullable anchor.
Modes are `none`, `single`, and `multiple`. Intents are `replace`, `toggle`, `range`, `add-range`,
and `clear`. Missing or disabled targets do not become selected. Single mode retains at most one
key. Multiple range operations use enabled flattened order; `range` replaces and `add-range`
unions. Active and selected identities never implicitly update one another.

## Tree visibility

`getVisibleKeys` accepts expanded parent keys and returns depth-first visible keys. Roots are always
considered; descendants appear only while every ancestor on their path is expanded. Expansion
state is caller-owned. The engine does not assign `aria-expanded`, focus, keyboard behavior,
virtual rows, or load children.

## Typeahead

Typeahead state contains a text buffer and caller-supplied monotonic timestamp. The update helper
resets after an explicit timeout and ignores empty input. Repeated equal characters collapse to one
search character to enable cycling. Matching starts after the current key, wraps once, skips
disabled items and items without text, and uses prefix comparison.

Default normalization is deterministic Unicode lowercase without ambient locale. A caller may
inject a pure text normalizer owned by its i18n layer. The caller suppresses input while an IME is
composing and supplies only committed text; the engine does not inspect browser events.

## Accessibility and interaction requirements

The engine renders no semantics and owns no focus. It preserves disabled, active, selected, tree,
and typeahead mechanics as separate inputs/outputs so a component can implement the correct native
or APG pattern. Component stages remain responsible for roles, names, ARIA states/relationships,
keyboard tables, focus entry/restoration, announcements, pointer/touch behavior, target size, RTL,
IME gating, high contrast, and manual review.

## SSR, security, and performance

All modules are pure or explicitly caller-mutated and safe at server module evaluation. There are
no browser globals, effects, random IDs, timers, storage, network, HTML, URLs, or serialization.
Text values and metadata are untrusted data: typeahead normalizes/compares text only and never
renders or executes it.

Snapshot construction is linear in items and relationships; lookup is map-backed; active movement,
range selection, visible projection, and typeahead are linear in the relevant ordered keys. A
deterministic ten-thousand-item unit scenario guards stack safety and complete ordering without
claiming a universal timing budget. Virtual rendering belongs to the virtualization owner.

## Compatibility and integration

The package remains private/internal with one compiled root export and no runtime dependencies.
Types are generic and provider-independent. A server-only Next.js fixture demonstrates tree,
selection, active-item, and typeahead output through the production host. Reference-derived
accessibility and data-binding parity registries remain unreviewed.

## F0.10 boundary

F0.10 owns portals, dismissable layers, overlay focus entry/restoration, and related lifecycle.
F0.09 introduces no overlay, positioning, focus trap, public component, React hook/context,
virtualization, data engine, localization runtime, persistent state, or future-stage capability.
