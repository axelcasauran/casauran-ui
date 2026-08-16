# ADR-024: Per-capability documentation routes and an interactive example harness

Status: Accepted
Date: 2026-08-15
Approved by: maintainer-directed documentation review during the `1.01 Button` revalidation
Supersedes: no prior decision; extends ADR-020 and the F0.18 contract, and follows the ADR-020
precedent of a governed foundation stage inserted at the current ledger boundary

## Context

Reviewing the Button documentation route against the enterprise expectation exposed two structural
gaps that ADR-023's coverage rule cannot close, because they are properties of the documentation
experience rather than of any component's page.

**Information architecture.** A component's documentation is one long page with anchor sections.
The expected model is a page per capability — overview, appearance, sizes, states, icons, events,
forms, keyboard, accessibility, globalization, API — reachable from a nested sidebar. The F0.18
contract fixes the current shape: `specs/foundation/documentation-experience.md` states that
"component URLs use `/components/<slug>`" with sections addressed by anchors, and
`docs-shell.tsx` renders a flat list derived from `docsDocuments`.

**Example harness.** Examples render statically and expose their source through a disclosure. A
reader cannot toggle a toggleable button, submit a form, or see cancellation behave. Worse, the
source string is hand-written next to the JSX it claims to describe: the two can disagree and
nothing detects it. The F0.18 contract also states that documentation surfaces are Server Components
by default with only presentation controls on the client.

Both changes would apply to all 127 component routes, so they belong to the documentation foundation
owner, not to whichever component stage happens to notice them. At roughly eight topics per
component the route set approaches a thousand pages, which rules out hand-authored routes.

## Options

1. **Enrich the single page.** More examples, better source presentation, no route change. Cheapest,
   keeps the current contract, but never reaches the expected navigation model and makes long pages
   longer as components grow.
2. **Absorb the change into each component stage.** Every stage builds its own topic pages. Rejected
   outright: it duplicates shell work 127 times, breaks the one-public-component boundary, and
   guarantees divergent structures.
3. **A governed foundation stage that generates per-capability routes from a declared topic model
   and ships an interactive example primitive.** One contract, one shell change, one migration of
   the two existing routes, and every later component inherits it.

For the harness specifically, the alternatives were per-example theme and density switchers matching
the reference, versus interactive previews with the shell keeping global presentation control. The
former multiplies client islands across a thousand routes for a control the shell already provides.

## Decision

Adopt option 3 as stage `F0.19 Documentation Interaction Foundation`, inserted at the current ledger
boundary after `F0.18`, and adopt the narrower harness: examples are interactive, presentation
control stays global.

`F0.19` owns:

- a declared topic model — the required and optional capability topics a component route may
  publish — with routes and nested navigation generated from it rather than hand-authored;
- migration of the existing Button and Icon routes onto the topic model with no loss of content or
  durable anchors, and redirects or equivalent continuity for existing `/components/<slug>#section`
  deep links;
- an example primitive whose preview is interactive through a narrow client island, so toggles
  toggle and forms submit;
- a single source of truth for example code, so the displayed source is the code that renders or is
  mechanically verified against it;
- extension of ADR-023's coverage rule to resolve a feature's declared anchor against the topic that
  owns it, instead of a section id on one page;
- browser and visual evidence for the new navigation, including keyboard and mobile behaviour.

`F0.19` explicitly does **not** own: per-example theme, density or direction switchers; a props
playground; search; versioned documentation; or any component behaviour.

The `F0.18` boundary assertion in `scripts/validate-documentation-experience.mjs` is generalised
from "F0.18 sits immediately between `1.02` and `1.03`" to "F0.18 follows `1.02` and precedes the
next public component stage". The assertion's intent — F0.18 was inserted at the boundary after
`1.02` and did not start `1.03` — is preserved, and a rejection test locks it. Without this, no
governed stage could ever be inserted after `F0.18`, which would make the ledger boundary
un-extendable by accident rather than by decision.

## Architectural impact

- Stage inventory moves from 172 to 173 and foundation stages from 18 to 19; every published mirror
  is reconciled and `pnpm validate:stages` enforces it.
- `F0.19` becomes the next stage. `1.03 SVGIcon` remains `not-started` and moves one place later, so
  every component from `1.03` onward lands on the finished documentation model rather than being
  migrated afterwards. This is a deliberate roadmap change, not a side effect.
- Client boundaries in `apps/docs` grow from two to three or more, all local example islands. The
  package root and route modules stay server-safe, and the `use client` audit in the documentation
  validator is updated to describe the new allowed set rather than removed.
- No public package, component, token, or supported API changes. Nothing in Phase 1 component
  behaviour depends on this stage.

## Consequences

- Documentation work moves from "write a page" to "declare topics and fill them", which is what
  makes the model survive 127 components.
- Deep links published before the migration must keep working; the stage owns that continuity, and
  breaking them would be a regression in `stable-routing`, an existing F0.18 capability.
- Interactive examples ship JavaScript to documentation readers for the first time. The stage must
  measure and record the cost, and keep islands per example rather than per page.
- Until `F0.19` runs, ADR-023 keeps documentation honest on the current single-page model. The two
  decisions are independent: the coverage rule does not assume the topic model, and the topic model
  does not weaken the coverage rule.

## Rollout / rollback

`F0.19` is defined and inserted as `not-started` by this decision; no implementation ships with it.
Rolling back before the stage runs means removing the stage entry, its ledger, the mirror counts and
this decision. Rolling back after it runs means restoring the single-page routes from the topic
model, which the stage must keep reversible by generating routes rather than rewriting content.

## Revisit trigger

Measured evidence that per-capability routes harm discovery rather than help it, or that interactive
examples cost more in hydration than they return in comprehension. Either would justify re-deciding
the model before it is applied to the remaining 125 components.
