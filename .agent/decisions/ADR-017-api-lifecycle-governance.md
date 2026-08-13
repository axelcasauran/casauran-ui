# ADR-017: API lifecycle governance

Status: Accepted
Date: 2026-08-13

## Context

Long-lived human/AI development needs durable decisions rather than conversational drift.

## Decision

Stable APIs use central conventions/semver/deprecation/migration.

## Consequences

Agents treat this as higher authority than preference. Conflicting work uses architecture-change workflow. Mechanical validators should encode the decision where practical.

## Revisit trigger

Material evidence invalidating assumptions, not preference alone.
