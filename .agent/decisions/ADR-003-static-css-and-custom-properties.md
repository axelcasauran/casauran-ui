# ADR-003: Static CSS and custom properties
Status: Accepted
Date: 2026-08-13

## Context
Long-lived human/AI development needs durable decisions rather than conversational drift.

## Decision
Use static CSS/custom properties/cascade; no runtime CSS-in-JS by default.

## Consequences
Agents treat this as higher authority than preference. Conflicting work uses architecture-change workflow. Mechanical validators should encode the decision where practical.

## Revisit trigger
Material evidence invalidating assumptions, not preference alone.
