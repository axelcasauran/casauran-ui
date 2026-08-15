# Pattern Specification: <Name>

A pattern composes supported public components into a reusable interaction. It never reimplements a
primitive that a public component or shared engine already owns.

## Purpose and scope

The application problem solved, the use cases, and explicit non-goals.

## Composition

Every public component and shared capability used, and why each is the canonical owner. Name any
primitive the pattern is forbidden to reimplement locally.

## State and data flow

Controlled and uncontrolled surfaces, ownership of each piece of state, event ordering, async and
loading behavior, error states, and the data seam the consuming application supplies.

## Interaction model

Pointer, touch, keyboard, and IME behavior across the composed surface, including how focus moves
between the composed components.

## Accessibility

Landmark and heading structure, accessible names, the combined keyboard model, focus entry and
restoration across component boundaries, announcements, and the manual review required before the
pattern is accepted.

## Responsive and adaptive behavior

Breakpoint behavior, reflow at 320 CSS pixels and high zoom, and any adaptive substitution.

## Theming, RTL, and localization

Token consumption, light/dark and density behavior, logical layout, and every user-facing string
that the consuming application must localize.

## Variants

Each supported variant, what it changes, and the invalid combinations prevented by type or API.

## Examples and evidence

Executable examples using supported public API only, the documentation route, the test matrix, and
the visual cases that prove the pattern.

## Boundary

What the pattern does not own, and which component, engine, or later stage owns it.
