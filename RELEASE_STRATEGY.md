# Release Strategy

Development proceeds through experimental, beta and stable maturity. Changesets record supported package changes.

A stable release is a product certification event, not merely `npm publish`: package exports, compatibility, security, documentation, migration, a11y, SSR/Next.js and relevant parity/performance gates must pass.

The scaffold intentionally stops before configuring registry credentials or auto-publish. That operational setup is performed when the organization selects registry, access model and release authority.
