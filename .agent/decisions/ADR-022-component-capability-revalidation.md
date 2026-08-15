# ADR-022: Component capability revalidation and governed parity dispositions

Status: Accepted
Date: 2026-08-15
Approved by: maintainer-directed component-stage revalidation of `1.01 Button`
Supersedes: no prior decision; extends `PARITY_DEFINITION.md` and follows the ADR-021 remediation
precedent

## Context

`.agent/prompts/component-stage.md` was rewritten on 2026-08-15 into a 36-section execution
contract. Two of its sections describe obligations that no repository contract expressed when
`1.01 Button` and `1.02 Icon` closed on 2026-08-14:

- §8 requires a capability matrix in which every materially relevant capability carries one of six
  explicit dispositions, and forbids `UNKNOWN`, `NOT_CHECKED`, a silent omission, or a `TODO`
  without an owner as a final state;
- §26 requires historical remediation of a completed component to preserve the original completion
  record and to run through the repository's governance mechanism rather than a silent rewrite.

The Button revalidation recorded in `.agent/reviews/2026-08-15-button-revalidation.md` showed why
this matters. The 2026-08-14 parity document was a table of twelve `pass` rows. It was not
dishonest, but it could not distinguish three different things: a capability that was implemented, a
capability that was met differently on purpose, and a capability that was never examined. Under the
narrower analysis of that day, eleven materially related reference families were never opened, and
five documented capability families — direct SVG icon definitions, an independent icon size, image
content, the class-replacement customization mode, and the dense `xs` control size — had no recorded
disposition at all. One of them, the dense size step, was a real gap; the rest were legitimate
differences that simply had never been written down. A `pass` row cannot tell a reviewer which is
which, and no validator could see the difference either.

`.agent/protocol.md` §7 also forbids rewriting prior-stage evidence to make later work look green,
so the mechanism for correcting a closed stage has to be explicit rather than improvised.

## Options

1. **Leave the disposition requirement in the prompt only.** No contract change. Rejected: a prompt
   constrains the agent that reads it, not the repository. The same omission recurs the next time a
   component closes, and nothing detects it.
2. **Insert a governed remediation stage at the current ledger boundary**, the way ADR-020 inserted
   `F0.18`. Rejected on repository fact: `pnpm validate:documentation-experience` requires `F0.18`
   to sit exactly between `1.02` and `1.03`, and `GOVERNANCE.md` requires completed stages to form a
   contiguous prefix. A new stage at the boundary can only be inserted by loosening the
   documentation validator, which would weaken an existing gate to accommodate this change.
3. **Revalidate the component in place, under the closed stage, and bind the disposition
   requirement to a mechanical contract.** The stage ledger keeps its original outcome and gains a
   dated revalidation section; the audit and remediation are recorded as a review document; a new
   validator enforces the disposition contract from now on. This is the shape ADR-021 used for the
   foundation remediation four hours earlier in the same repository.

## Decision

Adopt option 3.

**Revalidation mechanism.** A completed component stage is revalidated in place. The ledger's
`Outcome`, `Delivered scope`, `Contracts and files`, `Validation`, `Enterprise applicability`,
`Decisions, debt, and blockers`, and `Boundary audit` sections keep the text they closed with. A
dated `Revalidation` section is appended recording what was re-examined, what changed, what was
executed, and what remains unexecuted. The paired audit and remediation record lives in
`.agent/reviews/<date>-<component>-revalidation.md`. `.agent/status.md` carries the open item until
the repository gate confirms it. A revalidation may advance the component's registry lifecycle from
`parity-verified` to `improved`; it may not restate the original close.

**Disposition contract.** `.agent/capability-completeness.json` declares the six governed
dispositions, the forbidden non-final states, and the components that still await their own
revalidation. `pnpm validate:capability-completeness`, the 38th governed validator, rejects: a
component at `parity-verified` or `improved` with no parity document; a parity document with no
capability table carrying a `Disposition` column; a capability row with zero or several
dispositions; a forbidden state used inside an audit table; a `DEFERRED_TO_DECLARED_DEPENDENCY` row
that names no owning stage; a `NOT_APPLICABLE`, `INTENTIONALLY_DIVERGED`, `IMPLEMENTED_DIFFERENTLY`,
or `BLOCKED` row with no written rationale; a published disposition summary that disagrees with the
table it summarizes; a registry parity dimension marked `not-applicable` with no reason in the
document; and a pending-revalidation entry that is unnamed, unowned, or unexplained. Sixteen
rejection tests in `scripts/capability-completeness.test.mjs` lock those behaviors.

**Applicability boundary.** The contract binds from 2026-08-15. `1.02 Icon` closed before it existed
and is recorded as the single pending entry, naming its owning stage and the condition for closing
it: a governed `1.02` revalidation with a fresh reference analysis. Editing the Icon parity document
to satisfy the validator without re-running that analysis is explicitly not a valid way to clear the
entry, because the point of the contract is the examination, not the table.

**Button API amendment.** The revalidation added one supported public API value, `size="xs"`, and
corrected icon-only geometry so both axes resolve from one internal size custom property. Both were
approved under `API_GOVERNANCE.md` before implementation, specified in `specs/components/button.spec.md`,
and released through a changeset. The addition is additive and non-breaking.

## Architectural impact

- No new runtime dependency, package, component, engine, host, token, or theme. `ButtonSize` gains
  one union member; every other public type is unchanged.
- Governed validators move from 37 to 38; Node contract tests grow by sixteen.
- The frozen architecture in ADR-999, the styling architecture in ADR-003, the token architecture in
  ADR-006, and the accessibility baseline in ADR-009 are unaffected. This decision records how a
  closed component stage is re-audited; it does not change what the platform is.
- Stage ordering, the 127-component inventory, and the documentation foundation boundary are
  untouched, which is the concrete reason option 2 was rejected.

## Consequences

- Every future component stage must publish a disposition table and a matching summary, or its gate
  fails. A capability that is genuinely not Button's problem is cheap to record and impossible to
  omit silently.
- A completed component can be corrected without erasing what it originally claimed, and a reviewer
  can always see both the original close and the later correction.
- `1.02 Icon` now carries a visible, owned debt instead of an unstated one. It cannot be cleared by
  a documentation edit.
- The disposition summary is machine-checked against the table, so a later hand edit that drops a
  capability row fails the gate instead of quietly shrinking the audit.

## Rollout / rollback

Rolled out with the Button revalidation on `claude/stage-1-01-button-revalidate-bt573p`. Rollback
means removing `scripts/validate-capability-completeness.mjs`,
`scripts/capability-completeness.mjs`, its tests, its registration in
`.agent/mechanical-governance.json` and `package.json`, and `.agent/capability-completeness.json`.
The parity documents themselves remain valid Markdown either way, so rollback loses enforcement, not
content — which is exactly the state that produced the omissions this decision corrects.

## Revisit trigger

A component whose genuine capability audit cannot be expressed as one disposition per row — a
complex widget with per-feature sub-matrices is the likely first case — or evidence that the
`pendingRevalidation` list is being used to defer work rather than to sequence it.
