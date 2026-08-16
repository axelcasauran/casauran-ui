# ADR-023: Documentation feature coverage

Status: Accepted
Date: 2026-08-15
Approved by: maintainer-directed documentation review during the `1.01 Button` revalidation
Supersedes: no prior decision; extends `DOCUMENTATION_POLICY.md` and the F0.18 contract, and
follows the ADR-022 pattern of binding a prose obligation to a mechanical check

## Context

The Button revalidation closed finding B-7 — the documentation route showed a fraction of the
implemented surface — by rewriting the page from six sections to sixteen. It was the one finding
repaired without a guard, and the gap it left was proven immediately: opening the running docs
showed no outline, ghost or link buttons, because the page had never previewed them.

The obligation already existed in prose. `.agent/prompts/component-stage.md` §22 requires
documenting every applicable capability family and reconciling parity, implementation, tests and
documentation. `DOCUMENTATION_POLICY.md` requires documenting "variants/states". Neither is
checkable, and both were satisfied on paper by a page that showed two of eighteen features.

Two further facts shaped the rule. First, the registry already declares what a component can do, in
`features`; a second parallel list would drift from it. Second, not every feature can be a preview:
`ssr-hydration-rsc` has nothing to render, and `forced-colors` only exists under an emulated media
condition. A rule that demanded a preview for those would push authors to fabricate one.

## Options

1. **Per-value rule with a new `variants` registry block.** Precise, but introduces a second
   inventory next to `features` and says nothing about behavioural capabilities.
2. **Per-feature rule with no value clause.** Reuses `features` and scales to 127 components, but
   would have passed the page that started this: `appearance` is one feature, and showing `solid`
   alone satisfies it while `outline` stays invisible.
3. **Per-feature rule where an enumerated feature expands to its values, with a declared
   satisfaction mode per feature.** Keeps `features` as the single inventory, closes the hole in
   option 2, and lets behavioural and environment-conditional features be satisfied honestly.

## Decision

Adopt option 3.

`registry/components/<slug>.json` gains `featureCoverage`, mapping every declared feature to exactly
one satisfaction mode:

```text
preview  a rendered example on the route; an enumerated feature previews every value,
         written as an explicit prop assignment (`radius="sm"`)
section  a documented section with a durable id, for behaviour with nothing to render
fixture  environment-conditional behaviour proven by a named browser or visual case
```

`pnpm validate:documentation-experience` — the existing F0.18 gate, extended rather than a new
validator — rejects: a documented component with no `featureCoverage`; a declared feature with no
coverage entry; a coverage entry for an undeclared feature; an ungoverned mode; a `preview` or
`section` anchor the route does not define; an enumerated feature with no reflecting `data-`
attribute or an empty value list; an enumerated value that is never previewed; `fixture` coverage
naming evidence that does not exist; and a `pendingCoverage` entry that is unnamed, unowned or
unexplained. Thirteen rejection tests in `scripts/documentation-coverage.test.mjs` lock the
behaviour.

The static rule requires the value to appear as a prop assignment, not merely as a quoted string, so
naming a value in prose or in the API table cannot satisfy it. A browser case in
`tests/browser/docs-shell.spec.ts` then reads the registry and asserts each declared value renders
and is visible on the route, because a value can be documented and still paint nothing — which is
exactly what the neutral `outline` appearance did before this revalidation.

**Applicability boundary.** The rule binds from 2026-08-15 for every component at `documented`,
`parity-verified` or `improved`. `1.02 Icon` was documented before it existed and is recorded as the
single `pendingCoverage` entry in `registry/documentation/foundation.json`, naming its owning stage
and stating that adding a declaration without adding the previews does not clear it.

## Architectural impact

- No new validator, package, dependency, runtime surface or public API. The F0.18 gate grows one
  rule; validators stay at 38 and Node contract tests grow by thirteen.
- `registry/components/*.json` gains an optional block. The component schema does not forbid it, and
  no existing consumer reads it.
- The rule immediately found three unpreviewed `radius` values on the Button route, which were then
  documented. That is the intended behaviour, not a migration cost.
- Documentation information architecture is untouched. Per-capability routes and an interactive
  example harness are separate work, specified as stage `F0.19` under ADR-024.

## Consequences

- A component cannot reach `documented` while any declared feature is undemonstrated, and cannot
  claim a scale by showing one value of it.
- Docs examples stay explicit rather than generated from a loop: the rule wants literal prop
  assignments, which is also what a reader copies.
- `1.02 Icon` carries a visible, owned debt with seven sizes, eight tones and four flip modes to
  document at its revalidation.
- Adding a value to an enumerated public type now fails the docs gate until it is previewed, which
  is the same shape as adding a token without a theme entry.

## Rollout / rollback

Rolled out with the Button revalidation on `claude/stage-1-01-button-revalidate-bt573p`. Rollback
means removing `scripts/documentation-coverage.mjs`, its tests, the block in
`validate-documentation-experience.mjs`, the `featureCoverage` entries, the `pendingCoverage` list
and its schema property, and the browser case. The documentation itself remains valid either way, so
rollback loses enforcement, not content.

## Revisit trigger

A component whose feature list is not the right documentation unit — a complex widget whose single
`filtering` feature needs a dozen previews is the likely first case — or evidence that authors are
declaring `section` coverage to avoid writing previews.
