
# ADR-019: Casauran Product Identity

Status: Accepted
Date: 2026-08-13

## Context

The project requires a permanent independent identity before component implementation begins. Package scopes, CSS variables, documentation, diagnostics, screenshots, examples, generated assets, and consumer expectations become costly to rename after release.

## Decision

The umbrella brand is **Casauran** and the React component platform is **Casauran UI**.

- Public npm packages use `@casauran/*`.
- Internal workspace packages use `@casauran-internal/*`.
- Public React component identifiers are unprefixed.
- Project-owned CSS custom properties and intentionally stable DOM styling hooks use `csn`.
- Public diagnostic codes use `CSN`.
- Previous working names and competitor-oriented names are prohibited in customer-facing surfaces.
- Competitor names remain permitted only in reference/provenance/parity materials where necessary.

## Consequences

The repository, docs, apps, examples, CI metadata, manifests, package imports, token/CSS naming, generated material, and future product pages must use Casauran terminology.

## Migration

This ADR is adopted before product implementation, so no supported consumer migration is required.

## Revisit trigger

Only a deliberate product/company rebrand with an approved migration plan.
