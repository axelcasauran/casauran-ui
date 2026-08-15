# Block Specification: <Name>

A block is a larger product UI region assembled from supported patterns and public components. It
uses no private import and adds no new public component.

## Purpose and scope

The application use case, where the block sits in a real product, and explicit non-goals.

## Composition

Composed patterns and public components, and the canonical owner of every behavior used.

## Layout and responsive behavior

Region structure, layout primitives, breakpoint behavior, reflow at 320 CSS pixels and high zoom,
and adaptive substitutions.

## Data seams

Every input the consuming application supplies, its shape, loading and empty and error states, and
the boundary between block presentation and application data ownership.

## State and interaction

Ownership of each stateful surface, event ordering across composed regions, and the interaction
model including keyboard and pointer behavior.

## Accessibility

Landmarks and their names, heading order, the combined keyboard and focus model, announcements,
forced colors, reduced motion, and the manual review required before acceptance.

## Theming, RTL, and localization

Token and theme consumption, density, logical layout, and every user-facing string the consuming
application must localize.

## Security

Trust classification for any application-supplied content, and the sinks the block does not use.

## Examples and evidence

Executable examples using supported public API only, the documentation route, the test matrix, and
the visual cases that prove the block.

## Boundary

What the block does not own, and which pattern, component, or later stage owns it.
