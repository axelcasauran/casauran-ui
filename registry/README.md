# Registry

F0.15's canonical `virtualization/foundation.json` owns axis/grid windows, overscan, stable-key
dynamic measurement, anchoring, focus pinning and explicit element observation; its JSON Schema
lives under `schemas/`.

F0.16's canonical `drag-drop/foundation.json` owns drag sessions, deterministic targets/collision,
explicit Pointer Events capture/cancellation, keyboard-equivalent transitions and bounded
autoscroll; its JSON Schema lives under `schemas/`.

F0.17's canonical reference provenance, inventory, and component map live under `reference/`;
their structural schemas live under `schemas/`. They govern repository evidence and an external
read-only corpus, not a runtime package or public component lifecycle.

Canonical machine-readable inventory. `components/` tracks public components, `capabilities/` shared ownership, and later product layers have separate registries. `tokens/foundation.json` is the versioned authored source for public primitive and semantic token data; `themes/foundation.json` owns light/dark, density, reduced-motion, and forced-color assignments; `accessibility/foundation.json` owns framework-neutral focus, keyboard, live-region, and visually-hidden primitives; `react-state/foundation.json` owns pure state/ID rules and the React hook boundary; `collections/foundation.json` owns ordered/tree snapshots, registration, active-item movement, selection, visible-tree projection, and typeahead; `overlay/foundation.json` owns portal, layer/dismissal, focus-scope, and modal-isolation lifecycle; `animation/foundation.json` owns motion timing, reduced-motion observation, native playback, keyed interruption, and presence state; `data/foundation.json` owns descriptors, safe field access, and deterministic filter/sort/group/aggregate/page processing; `i18n/foundation.json` owns locale fallback, direction, plain-text messages, plural/number/date formatting, and collation. `requiredBy` is generated from `composition.uses` rather than hand-maintained.
