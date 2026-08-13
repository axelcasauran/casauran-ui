# Skill: ai-tooling

## When to load

Use for AI tools, web-exposed model actions or WebMCP-like integration surfaces.

## Preconditions

- Read AGENTS.md, active stage, security/dependency/integration policies.
- Identify whether the work is platform parity, component behavior, or optional integration.

## Hard rules

- tool metadata/actions are treated as privileged integration.
- model/user input cannot directly authorize dangerous action.
- schema/validation and capability boundaries are explicit.
- base UI remains usable without AI tooling.

## Analysis checklist

- tool schema.
- input validation.
- authorization boundary.
- untrusted output.
- error/cancel.
- privacy.
- provider neutrality.
- a11y.

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
