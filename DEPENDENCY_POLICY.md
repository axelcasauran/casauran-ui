# Dependency Policy
External library runtime dependencies are zero-by-default in library packages. Internal workspace dependencies are allowed; React/ReactDOM are peers of the public React package.

Before adoption prove: native/internal options are insufficient or materially worse; capability/maintenance benefit is measured; license/security/SSR/RSC/bundle/tree-shaking are acceptable; public API remains independent; exit strategy exists.

Do not preinstall likely future libraries. Define seams at real replacement boundaries; build adapters only for real alternate implementations.

Development tooling is centrally pinned and reviewed separately from runtime dependency policy.
