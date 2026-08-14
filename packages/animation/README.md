# @casauran-internal/animation

**Ownership:** motion primitives using CSS/WAAPI.

## Animation foundation

The package provides finite token-resolved timing normalization, explicit reduced-motion
observation, deterministic WAAPI playback, keyed interruption ownership, and revision-safe pure
presence state.

It is framework-neutral and server-safe to import. Browser access starts only when a caller
supplies an environment or connected animation target. Tokens/themes own values and reduced-motion
CSS; components own keyframes, effects, rendering and semantics; positioning, gestures, scrolling,
and React composition remain with their documented owners.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
