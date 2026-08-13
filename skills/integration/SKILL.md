# Skill: integration

## When to load

Use for cross-cutting data binding, cloud/provider integration or third-party adapter design.

## Preconditions

- Read AGENTS.md, active stage, security/dependency/integration policies.
- Identify whether the work is platform parity, component behavior, or optional integration.

## Hard rules

- base components remain provider-neutral.
- public contracts precede provider examples.
- optional SDKs never become implicit core dependencies.
- SSR/security/privacy boundaries are explicit.

## Analysis checklist

- state/data contract.
- auth/credentials boundary.
- transport/provider seam.
- failure/retry.
- SSR.
- security.
- documentation.

## Enterprise dimensions

Review security, privacy/trust, accessibility, SSR/RSC, compatibility, observability/failure modes, optional dependency impact and migration.

## Implementation discipline

Keep provider-specific code behind optional domain-owned boundaries. Validate inputs at trust boundaries. Keep supported public APIs independent from provider SDK types.

## Forbidden shortcuts

- hidden credentials or hard-coded provider assumptions
- direct model authorization of privileged effects
- adding provider SDK to core runtime
- bypassing dependency/security review
- undocumented failure behavior

## Required records

Platform registry entry, integration/security review, tests and documentation.

## Definition of Done

Applicable platform/component gates pass and the integration remains optional, validated and provider-neutral.
