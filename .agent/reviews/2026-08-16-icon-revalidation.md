# Icon Capability Revalidation: 2026-08-16

Stage: `1.02 Icon`, closed COMPLETE on 2026-08-14.
Decision: `.agent/decisions/ADR-022-component-capability-revalidation.md`.
Companion record: the `## Revalidation — 2026-08-16` section of `.agent/stages/1.02-icon.md`.

This document is the audit and remediation record. The original stage ledger sections are unchanged;
per `.agent/protocol.md` §7 their evidence stands and this record plus ADR-022 carry the
remediation. The principle the foundation and Button remediations established applies again:
**every finding is repaired together with the mechanical check that would have caught it**, wherever
a check is possible.

## Why this was run

`1.02` was the single `pendingRevalidation` entry in `.agent/capability-completeness.json` and the
single `pendingCoverage` entry in `registry/documentation/foundation.json`. ADR-022 states the
condition for clearing the first: a governed `1.02` revalidation with a fresh reference analysis,
explicitly not a hand edit of the parity table. ADR-023 states the condition for clearing the
second: `featureCoverage` declared **and** every enumerated value actually previewed.

The question was not "does Icon work" — it did — but whether every documented capability was
examined, and whether a reviewer can tell a gap from a decision. The answer, on both counts, was no,
and pulling that thread found five defects in shipped behaviour and one in the documentation that no
type could have caught while `name` was a free string.

## I-1 — reference analysis was not exhaustive · FIXED

The 2026-08-14 analysis examined eight pages plus four runnable example files, all reachable from
`common/icon`. Twenty-three materially related paths were never opened: the common package overview
and getting-started pages, the variant, provider, provider-type and class-structure API pages, all
four SVG-icon pages, the adaptive-mode page, both cross-cutting accessibility pages, five styling
pages including the font-to-SVG migration and unstyled mode, the server-components page, the RTL
support page, the content-security-policy page, the v15 breaking-changes entry, and the custom-SVG
knowledge-base article.

Four capability families are visible only in those pages and had no disposition before:
application-level icon configuration through a provider, drawing variants, the class-replacement
unstyled mode, and the two consumption modes with the migration and CSP reasoning behind them. Two
facts also changed how other rows read: the reference records Icon at WCAG 2.2 AA — the same
baseline ADR-009 fixed, unlike Button's `AAA` — and does not list Icon in the suite compliance table
at all, which confirms the absent keyboard model is a shared conclusion rather than a Casauran gap.

`specs/components/icon.reference-analysis.md` now lists all thirty-one examined paths, in two dated
blocks, and states that `common/examples/**` is deliberately not opened: runnable example source is
competitor implementation material, which §6 forbids implementing from. The original pass listed
four such files; the revalidation neither relies on them nor treats anything in them as a
requirement.

## I-2 — the parity document was nine lines of prose · FIXED

The 2026-08-14 audit was a paragraph. It was not dishonest, but it recorded no capability rows at
all, so nothing distinguished an implemented capability from one met differently on purpose from one
never examined — the exact condition ADR-022 was written to end.

`specs/components/icon.parity.md` is now a thirty-eight row audit with one governed disposition per
row:

| Disposition                       | Count |
| --------------------------------- | ----: |
| `IMPLEMENTED`                     |    16 |
| `IMPLEMENTED_DIFFERENTLY`         |     9 |
| `NOT_APPLICABLE`                  |     7 |
| `DEFERRED_TO_DECLARED_DEPENDENCY` |     3 |
| `INTENTIONALLY_DIVERGED`          |     3 |
| `BLOCKED`                         |     0 |

All three deferrals name stage `1.03 SVGIcon` and each states what `1.03` owes: the direct-definition
surface, the variant question, and caller-owned replacement of a built-in glyph. Every
`NOT_APPLICABLE` row names the owning subsystem and why Icon is not that owner.

**Guard.** `pnpm validate:capability-completeness` now reports `2 of 2 audited components` with `0
awaiting governed revalidation`. The `pendingRevalidation` list is empty.

## I-3 — the default tone ignored its context · FIXED

The most consequential finding, and invisible to every check that existed. `--csn-icon-color`
resolves to `text.primary` at the theme root, and `.csn-icon` painted it unconditionally, so
`tone="inherit"` — the default, documented as inheriting the surrounding colour — painted the
theme's primary text colour instead. An Icon composed into a solid accent Button rendered dark
artwork on a saturated fill; an icon on an inverse surface or beside critical text was equally
wrong.

This is the same class of defect as Button's B-5 and was missed for the same reason: the visual
matrix rendered icons only on the default surface, where the two colours coincide. `tone="inherit"`
now resolves to `currentColor`.

**Guard.** A browser case pins the computed colour of a default-tone icon to its container's colour
and to a solid Button's label colour, and requires the tone scale to resolve to distinct colours.
The visual matrix gained a composition panel and a toned-text sample, so the regression is visible
as well as asserted. Button's own baseline changed by twenty pixels — the `+` glyph in its
composition panel is now readable — and was regenerated and reviewed.

## I-4 — a blank label published an unnamed image · FIXED

`label` was tested only for `undefined`, so `label=""` produced `role="img"` with an empty
`aria-label`: an image a screen reader announces with no name, which is worse than the decorative
default it replaced. A whitespace-only label now keeps the icon decorative, and a real label is
trimmed.

**Guard.** Unit cases for `''`, `'   '` and `'\n\t'`, a trimming case, and a browser case asserting
the blank-label probe stays `aria-hidden` and never becomes an image.

## I-5 — a decorative element could take a tab stop · FIXED

`IconProps` extended `HTMLAttributes<HTMLSpanElement>`, so `tabIndex` passed through. A decorative
Icon is `aria-hidden`, and a focusable `aria-hidden` element is reachable by keyboard while invisible
to assistive technology. The reference exposes `tabIndex` deliberately; Casauran cannot, because it
inverted the accessibility default.

`tabIndex` is now rejected by the type, together with `role`, `aria-hidden` and `aria-label`, which
were previously accepted and then silently overwritten by the values the component derives from
`label` — a passthrough that looked supported and did nothing.

**Guard.** Five `@ts-expect-error` cases covering `tabIndex`, `role`, `aria-hidden`, `aria-label`
and `children`, and the docs API topic states the reservation and its reason.

## I-6 — the documented API did not exist · FIXED

The route's API table declared `tone` as `'current' | 'muted' | 'accent' | 'positive' | 'caution' |
'critical'` with a `'current'` default. The implemented union was `inherit | accent | muted | info |
positive | caution | critical | inverse` defaulting to `inherit`. Three values in the table were
wrong, two implemented values were missing, and the default named a value that does not exist.
`flip` was documented without its `none` default. `name` was documented as `IconName`, a type
nothing exported.

The table is corrected, and `IconName` now exists.

## I-7 — the route's only example rendered an empty box · FIXED

`<Icon label="Complete" name="check" size="xl" tone="positive" />` shipped in the documentation. The
catalog had no `check` definition, so the example rendered a labelled empty element — an
accessible-image announcement with no artwork behind it, published as the component's showcase.

Nothing could catch it, because `name` was `string`. It is fixed at the root: `name` is the
`IconName` catalog union, so the same mistake is now a build failure. `isIconName` narrows a name
that crossed a runtime boundary, and the fail-closed render behaviour remains for one that was not
narrowed. Four definitions were added — `check`, `error`, `info`, `warning` — because the tone scale
and the documentation genuinely need them; the catalog is fourteen definitions and `iconNames` is
authoritative.

**Guard.** The typed name, plus a unit case that renders every catalog definition and requires a
`viewBox` and at least one path, so an empty definition cannot ship either.

## I-8 — the `info` tone was a second name for one colour · FIXED

Recorded by the Button revalidation as belonging to this stage. `data-tone="info"` and
`data-tone="accent"` both resolved to `--csn-interactive-primary`, so two public API values were
indistinguishable in every theme. Button had already declined to repeat the alias. `info` is
removed; informational artwork uses `accent`, and Icon and Button now share one tone vocabulary.

**Guard.** A `@ts-expect-error` case for the removed value, and a browser case requiring every
remaining tone to resolve to a distinct colour.

## I-9 — the token seam behaved differently for defaults · FIXED

`md` and `inherit` had no rule of their own, so they fell through to the theme root while every
explicit value was assigned by an attribute selector inside the component layer. A consumer override
therefore worked for a default-sized, default-toned icon and lost to any explicit one. Every
enumerated size and tone now assigns its token at the same specificity, and the documented seam is
the `overrides` cascade layer, which outranks the component layer regardless of specificity.

**Guard.** A browser case asserting an `overrides`-layer override beats an explicit `accent` tone,
alongside the existing default-tone override case. The visual fixture's own override moved from
`@layer base` to `@layer overrides`, where it was always supposed to be.

## I-10 — documentation covered a fraction of the surface · FIXED

The route had five topics and one example. It documented no size scale, no tone scale, no direction
model, no rendering posture, no performance budget, and no limitations, and its single example
demonstrated three of eighteen features.

The route now publishes ten topics — overview, appearance and tone, sizes and shapes, icons/images
and content, API reference, accessibility, theming/density/RTL/globalization, Next.js and rendering,
performance, security, and known limitations — with seven examples, a seven-row API table, a
seven-row styling-hook table, and the catalog rendered by name. `registry/components/icon.json`
declares `featureCoverage` for all eighteen features, previewing every one of the seven sizes, seven
tones and four flip values as an explicit prop assignment.

**Guard.** The existing ADR-023 validator plus the docs-shell browser case that reads the registry
and asserts each declared value really renders. `pendingCoverage` is empty.

## I-11 — the benchmark reported no environment · FIXED

Left to this stage by the Button revalidation's B-10. `benchmarks/icon.mjs` printed a bare
millisecond figure, so the 172.70 ms recorded in `.agent/performance-budgets.md` could not be tied to
a runtime — the unqualified-claim pattern `PERFORMANCE_POLICY.md` prohibits. It now prints the Node
version, platform, architecture and the ceiling it was measured against, and the budget records both
the original result and the revalidation result with their environments.

## Observations recorded, not repaired

- **The catalog is small.** Fourteen independently drawn definitions against a reference set of more
  than five hundred. This is a deliberate `IMPLEMENTED_DIFFERENTLY` rather than a gap — copying an
  icon set would reproduce another product's artwork and naming — but the ratio is worth restating
  at each component stage that needs a glyph, and `iconNames` is the honest answer to "what exists".
- **Drawing variants are genuinely undecided.** A variant is a property of a definition, so the
  question belongs to `1.03 SVGIcon`; deciding it here would fix the shape of a contract that stage
  owns. It is recorded as a deferral, not as an omission.
- **Visual baselines remain the repository's open blocker.** This environment produced reviewed
  `chromium-linux` baselines; Firefox and WebKit cannot be installed here, and `theme-runtime`
  belongs to a Phase 0 foundation stage and was deliberately left alone.

## Summary

| Finding | State          |
| ------- | -------------- |
| I-1     | fixed          |
| I-2     | fixed, guarded |
| I-3     | fixed, guarded |
| I-4     | fixed, guarded |
| I-5     | fixed, guarded |
| I-6     | fixed          |
| I-7     | fixed, guarded |
| I-8     | fixed, guarded |
| I-9     | fixed, guarded |
| I-10    | fixed, guarded |
| I-11    | fixed          |

Validators: 38, unchanged — this revalidation added no new mechanical contract, because ADR-022 and
ADR-023 already expressed the two rules `1.02` was pending against, and clearing a governed debt is
what those contracts were for. Node contract tests: 159, unchanged by this revalidation. Vitest: 122 → 128. Parity rows
for Icon: 0 → 38. Documentation topics for Icon: 5 → 10. Catalog definitions: 10 → 14. Accepted
decisions: 25, unchanged.
