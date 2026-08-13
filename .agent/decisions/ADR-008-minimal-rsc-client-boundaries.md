# ADR-008: Minimal RSC/client boundaries
Status: Accepted
Date: 2026-08-13

## Context
Long-lived human/AI development needs durable decisions rather than conversational drift.

## Decision
Avoid broad use-client contamination; preserve server-safe imports.

## Consequences
Agents treat this as higher authority than preference. Conflicting work uses architecture-change workflow. Mechanical validators should encode the decision where practical.

## Revisit trigger
Material evidence invalidating assumptions, not preference alone.
