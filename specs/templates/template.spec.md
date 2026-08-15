# Template Specification: <Name>

A template is a domain application built only from supported blocks, patterns, and public
components. It is the proof that serious products can be built from the public surface alone.

## Domain and scope

The application domain, the users, the workflows demonstrated, and explicit non-goals.

## Required blocks and patterns

Every composed block and pattern, and what each proves about the platform.

## Routing and layout

Route structure, layout assumptions, server and client boundaries, and navigation model.

## Data interfaces

The data contracts the template expects, fixture strategy, loading and empty and error states, and
the boundary between template and real backend.

## State and interaction

Application-level state ownership, cross-route state, and the interaction model.

## Accessibility

Page-level landmark and heading structure, keyboard reachability across routes, focus management on
navigation, announcements, and the manual review required before acceptance.

## Theming, RTL, and localization

Theme and density behavior across routes, logical layout, and the localization strategy for all
user-facing text.

## Performance

Route-level budgets with scenario, dataset, and environment, including server render cost where
material.

## Security

Trust boundaries for any external or user-supplied content, and authentication or authorization
assumptions the template demonstrates rather than implements.

## Demonstration goals and evidence

What the template must prove about the platform, the documentation route, the test matrix, and the
recorded gaps or workarounds discovered while building it.

## Boundary

What the template does not own, and which block, pattern, component, or later stage owns it.
