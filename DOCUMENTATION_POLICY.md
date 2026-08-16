# Documentation Policy

Every supported component documents purpose/import/basic use, variants/states, controlled/uncontrolled behavior, API/events, accessibility/keyboard, theming, RTL, SSR/Next.js, i18n, performance/security caveats when relevant, integrations/troubleshooting and migration when relevant.

Examples use supported public API and should be executable in docs/playground/visual-test hosts.

## Feature coverage

Every feature a component declares in `registry/components/<slug>.json.features` is demonstrated on
its documentation route, and the registry records how in `featureCoverage`:

- `preview` — a rendered example on the route. When the feature is an enumerated set, the preview
  shows **every value**, written as an explicit prop assignment such as `radius="sm"`, so the
  example is copy-pasteable and naming a value in prose or in the API table cannot satisfy the rule.
- `section` — a documented section with a durable id, for behaviour with nothing to render.
- `fixture` — environment-conditional behaviour such as forced colors, reduced motion, RTL or focus
  visibility, proven by a named browser or visual case and described in prose.

Showing one representative value is not documenting the scale. `pnpm validate:documentation-experience`
enforces the declaration against the route, and a browser case asserts each declared value actually
renders, because a value can be documented and still paint nothing. Components documented before
this rule are listed as named, owned entries in `registry/documentation/foundation.json`
`pendingCoverage`, never as silent exemptions. The rule and its rationale are ADR-023.

`apps/docs` is the canonical customer documentation experience and composes the F0.18 shell and
private documentation primitives. Component stages add stable `/components/<slug>` routes,
explicit section anchors, registry-derived search metadata, executable examples/source, API,
accessibility/keyboard, theme/RTL, and SSR structures without forking the shell. `apps/playground`
remains an engineering sandbox and is never the primary customer documentation portal.
