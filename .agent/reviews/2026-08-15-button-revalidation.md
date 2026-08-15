# Button Capability Revalidation: 2026-08-15

Stage: `1.01 Button`, closed COMPLETE on 2026-08-14.
Decision: `.agent/decisions/ADR-022-component-capability-revalidation.md`.
Companion record: the `## Revalidation — 2026-08-15` section of `.agent/stages/1.01-button.md`.

This document is the audit and remediation record. The original stage ledger sections are unchanged;
per `.agent/protocol.md` §7 their evidence stands and this record plus the ADR carry the
remediation. The principle from the 2026-08-15 foundation remediation applies here too: **every
finding is repaired together with the mechanical check that would have caught it**, wherever a check
is possible.

## Why this was run

`.agent/prompts/component-stage.md` now requires an exhaustive reference analysis (§7), a capability
matrix with one explicit disposition per capability (§8), resolution of integration obligations owed
to the stage (§25), and historical remediation through the repository's governance mechanism (§26).
Button closed before those obligations existed as contracts. The question this revalidation had to
answer was not "does Button work" — it did — but "was every documented capability actually examined,
and can a reviewer tell the difference between a capability that was implemented, one that was met
differently on purpose, and one that was never looked at."

## B-1 — reference analysis was not exhaustive · FIXED

The 2026-08-14 analysis examined twelve pages, all under `buttons/`. Eleven materially related
paths were never opened: the buttons package overview and getting-started pages, both cross-cutting
accessibility pages, three styling and customization pages, the server-components page, both ripple
pages, and the Web MCP Button command surface.

Two facts only visible in those pages now appear in the analysis: the reference classifies Button's
keyboard support as _standard_ — one tab stop, no component-owned shortcut table, which confirms
Casauran is not missing an interaction model — and its compliance table records Button at WCAG 2.2
`AAA`, one level above the `AA` baseline ADR-009 fixed for this platform.

`specs/components/button.reference-analysis.md` now lists all twenty-three examined paths and states
explicitly that `buttons/examples/**` was deliberately not opened, because runnable example source
is competitor implementation material rather than behavioral documentation.

## B-2 — parity document could not distinguish a gap from a decision · FIXED

The old audit was twelve rows of `pass`. Nothing in it was false, but five documented capability
families had no row at all: direct SVG icon definitions, independent icon sizing, image content,
the class-replacement (unstyled) customization mode, and the dense `xs` control size. A reader could
not tell whether they were considered and rejected or never examined.

`specs/components/button.parity.md` is now a thirty-one row audit with one governed disposition per
row:

| Disposition                       | Count |
| --------------------------------- | ----: |
| `IMPLEMENTED`                     |    16 |
| `IMPLEMENTED_DIFFERENTLY`         |    11 |
| `DEFERRED_TO_DECLARED_DEPENDENCY` |     1 |
| `NOT_APPLICABLE`                  |     2 |
| `INTENTIONALLY_DIVERGED`          |     1 |
| `BLOCKED`                         |     0 |

The single deferral names stage `1.03 SVGIcon`. Both `NOT_APPLICABLE` rows name the owning
subsystem and why Button is not that owner: ripple decoration is a separate component in the
reference and would belong to the animation foundation; agent command registration belongs to the
`ai` capability, which is `planned` with no approved contract.

**Guard.** `pnpm validate:capability-completeness`, the 38th governed validator, with the contract in
`.agent/capability-completeness.json` and fifteen rejection tests in
`scripts/capability-completeness.test.mjs`. It rejects a missing disposition table, a row with zero
or several dispositions, a forbidden state inside an audit table, a deferral with no owning stage, a
`NOT_APPLICABLE`/`INTENTIONALLY_DIVERGED`/`IMPLEMENTED_DIFFERENTLY`/`BLOCKED` row with no rationale,
a published disposition summary that disagrees with its own table, a registry `not-applicable`
dimension with no reason, and an unowned or unexplained pending-revalidation entry.

## B-3 — dense control size missing · FIXED

The reference exposes four control sizes; Casauran shipped three. `size="xs"` is now supported, with
its own spacing, typography and square icon-only geometry, specified, unit- and browser-tested,
documented, and rendered in the visual matrix. It is an additive, non-breaking public API change,
approved under `API_GOVERNANCE.md` and released through `.changeset/button-dense-size-and-contrast.md`.

## B-4 — icon-only geometry was not square away from the default size · FIXED

`.csn-button[data-icon-only]` set `inline-size` from `--csn-button-min-block-size` while the size
variants changed `min-block-size` directly, so an icon-only `sm` action was wider than it was tall
and an icon-only `lg` action was taller than it was wide. Both axes now resolve from one private
`--_csn-button-size` property.

**Guard.** A browser case measures all four icon-only sizes, requires each bounding box to be square
within one pixel, and requires the scale to increase monotonically.

## B-5 — transparent appearances were unreadable on the neutral tone · FIXED

Found by manual review of the regenerated visual baseline. `outline`, `ghost` and `link` set their
foreground from `--_csn-button-tone`, which for the neutral tone is the pale control _surface_
colour, not a text colour. Neutral outline, ghost and link buttons therefore rendered pale grey text
on the canvas. The original stage missed it because the appearance panel of the visual matrix
rendered every appearance with `tone="accent"`, where the two happen to be the same colour.

Transparent appearances now use `--_csn-button-tone-foreground`, which resolves to the readable text
colour for every tone, and `outline` takes its border from the tone's border colour.

**Guard.** A browser case asserts that `outline`, `ghost` and `link` on the neutral tone all paint
the same colour as the readable `soft` text, never the control surface, and keep a transparent
background. The visual matrix gained a neutral appearance row so the regression is also visible.

## B-6 — Button × Icon integration obligation was never revalidated · FIXED

`1.01` deferred artwork to the Icon stage; `1.02` shipped Icon without revalidating the integration
in either direction. Composition is now evidenced from Button's side: unit cases render `Icon` in a
decorative slot and as icon-only content, a browser case proves three composed buttons expose three
buttons, three icons, no `img` role and no second accessible name, the docs route documents icon,
image and third-party-class composition, and the visual matrix renders a composition panel.

The obligation owed to stage `1.03 SVGIcon` is restated in the parity document: implement the
definition surface, then revalidate Button × SVGIcon evidence without reimplementing Button.

## B-7 — documentation covered a fraction of the implemented surface · FIXED

The docs route had six sections and an eight-row API table. It documented neither the size and
radius scales, the states, icon and content composition, events, forms, controlled ownership, the
performance budget, nor the component's limitations, and its `appearance` default row said `solid`
while the implementation defaults to `soft`.

The route now has sixteen sections with durable IDs, a fourteen-row API table, a styling-hook table,
and a corrected default. Deep links from `apps/docs/lib/content.ts` were extended to match. One
constraint surfaced while building it: documentation pages are Server Components, so example
handlers are shown as source rather than wired into previews, and the page says so instead of
implying the previews are interactive.

## B-8 — `pnpm lint` could not pass with the reference corpus present · FIXED

`kdocs/` was committed after the foundation remediation and is not excluded from ESLint. `pnpm lint`
reported 7,368 parse errors, every one a vendored reference file outside every tsconfig, which
blocks `pnpm validate:static` for any stage. The corpus is now in the ESLint ignore list with the
reason recorded inline: it is behavioral input under `KENDO_REFERENCE_POLICY.md`, and a lint finding
there could only be fixed by editing competitor material the policy forbids modifying.

## B-9 — `pnpm format:write` rewrote the pinned reference corpus · FIXED

Worse than the lint failure, and found by running it: `prettier --write .` reformatted 9,164
vendored reference files in one command. That modifies read-only competitor material and changes the
bytes behind the reference baseline digest that `pnpm reference:check` verifies. The change was
reverted with `git checkout -- kdocs` and the snapshot re-verified. `kdocs` is now in
`.prettierignore` with the same rationale.

This is the finding with the widest blast radius in this revalidation: it is silent, it is a single
command away, and its damage is to provenance rather than to code.

## B-10 — the Button benchmark reported a fabricated environment · FIXED

`benchmarks/button.mjs` printed `(Node ${process.version}, win32 x64)` with the platform hardcoded.
Any recorded Button performance evidence therefore claimed Windows regardless of where it ran, which
is exactly the kind of unqualified claim `PERFORMANCE_POLICY.md` prohibits. It now reports
`process.platform` and `process.arch`. The sibling `data-engine`, `drag-drop` and `virtualization`
benchmarks already did; `icon.mjs` prints no environment at all and is left for the `1.02`
revalidation to decide, since changing it now would be editing another stage's evidence.

## B-11 — a repository generator emitted output its own format gate rejects · FIXED

`.agent/prompts/component-stage.md` §29 requires validation to be idempotent: regenerating a
repository-owned artifact must not leave the gate failing. `scripts/generate-required-by.mjs` wrote
`JSON.stringify(value, null, 2)`, which expands every array, while Prettier at `printWidth: 100`
collapses short ones. Running `pnpm generate:required-by` therefore rewrote 102 lines of a committed
file and made `pnpm format` fail, every time, on a repository that was otherwise clean. It was latent
because `pnpm validate` does not run generators.

The generator now emits the Prettier shape directly — inline when the entry fits in 100 columns,
expanded when it does not — and reproduces the committed file byte for byte.

**Guard.** The existing format gate is the guard once the generator and Prettier agree: the
generated file is committed and `prettier --check .` covers it, so any future drift between the two
fails `pnpm format` instead of silently rewriting a tracked file.

## Observations recorded, not repaired

- **Neutral `solid` and `soft` are nearly indistinguishable.** Both resolve to the same control
  fill, because the neutral tone owns one surface token. The five appearances remain distinct for
  every tone that has a colour ramp. Making neutral solid a distinct step is a token-owner decision
  (F0.05/ADR-006), not a Button decision, so it is recorded rather than changed here.
- **`Icon` exposes an `info` tone that resolves to the same custom property as its `accent` tone.**
  Button deliberately does not repeat that alias. Whether Icon should keep it belongs to the `1.02`
  revalidation.
- **Visual baselines remain the repository's open blocker.** This environment produced a reviewed
  `chromium-linux` Button baseline; Firefox and WebKit cannot be installed here, and the other four
  fixtures belong to other stages, so their baselines were deliberately not committed.

## Summary

| Finding | State            |
| ------- | ---------------- |
| B-1     | fixed            |
| B-2     | fixed, guarded   |
| B-3     | fixed, guarded   |
| B-4     | fixed, guarded   |
| B-5     | fixed, guarded   |
| B-6     | fixed, evidenced |
| B-7     | fixed            |
| B-8     | fixed            |
| B-9     | fixed            |
| B-10    | fixed            |
| B-11    | fixed, guarded   |

Validators: 37 → 38. Node contract tests: 129 → 144. Vitest: 117 → 122. Browser evidence: Chromium
only in this environment, 69 passed with 4 pre-existing missing-baseline failures; Firefox and
WebKit unrun and unrunnable here.
