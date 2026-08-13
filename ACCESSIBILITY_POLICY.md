# Accessibility Policy

## Baseline and authority

WCAG 2.2 AA is the minimum acceptance baseline. Native semantic HTML is the first choice; ARIA
augments semantics and must not contradict them. Applicable WAI-ARIA APG patterns govern
component-specific roles, states, keyboard tables, and focus behavior.

The framework-neutral foundation is specified in `specs/foundation/accessibility.md` and
inventoried in `registry/accessibility/foundation.json`. `@casauran-internal/accessibility` owns
focus/tabbability inspection, pure roving-focus movement, directional keyboard intent, safe
text-only live-region updates, and the visually-hidden utility. It is internal implementation, not
a consumer-facing replacement for semantic components.

## Component acceptance

Every applicable component specification and stage evidence covers:

- native role, accessible name, value/state, relationships, and disabled/read-only distinctions;
- complete keyboard table, one predictable focus model, entry/exit/restoration, and visible focus;
- announcements and localized message ownership;
- pointer, touch, target size, high zoom/reflow, and text scaling;
- forced colors, reduced motion, light/dark themes, density, and RTL;
- IME composition for text entry plus clipboard/drag behavior where relevant;
- SSR/hydration-stable semantics and IDs.

Roving focus is not generic selection. A component supplies its APG pattern, item order, disabled
policy, orientation, direction, and looping decision. Collection registration belongs to the
collection engine. Focus traps and overlay entry/exit/restoration lifecycle belong to the overlay
engine.

## Announcements and hidden content

Announcements are user-facing product text and must be localized by the caller. Live-region
helpers assign `textContent` only, coalesce pending messages, and never parse markup. Politeness,
atomicity, and relevance are explicit. Avoid announcing information already conveyed by native
semantics.

`data-csn-visually-hidden` retains content in the accessibility tree while clipping it visually.
It must not hide instructions or controls that sighted users need. `hidden`, `display: none`, and
`aria-hidden="true"` are not substitutes when assistive technology must receive the content.

## Evidence

Pure algorithms use strict unit tests. Focus, keyboard, disabled-item skipping, RTL, IME,
live-region, visually-hidden, and accessibility-tree behavior use real production-host browsers.
Automated evidence is necessary but insufficient: complex patterns require documented manual
keyboard and screen-reader review before parity certification. A foundation primitive does not
advance reference-derived platform parity or certify a future component.

Accessibility failures are release blockers unless a higher-authority, explicitly approved
exception exists. Tests are not disabled to avoid accessibility work.

## Overlay lifecycle

The overlay foundation coordinates top-layer dismissal, nested focus entry/containment/restoration,
and native-inert background isolation. Only the top active scope traps focus or receives dismissal.
Escape is ignored during IME composition or with command modifiers. These mechanics do not assign
roles, names, `aria-modal`, close controls, visible focus, announcements, or a pattern keyboard
table; each overlay component must supply and verify those semantics and decide whether modal
isolation is appropriate.
