# Repository Governance

## Purpose and scope

This policy governs how Casauran UI repository changes are owned, reviewed, evidenced, and
merged. It applies to humans, automation, and AI agents. Product architecture remains governed
by accepted ADRs and `AGENTS.md`; this document operationalizes those decisions without changing
their authority.

The machine-readable mirror is `.agent/repository-governance.json`. When that file and this
policy disagree, resolve the conflict before merging. Authority precedence still follows
`AGENTS.md`.

## Roles and current assignment

Governance uses durable roles rather than assuming that a file author may approve their own
change merely because they created it.

| Role              | Accountability                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Maintainer        | Repository administration, governance interpretation, architecture approval, and final merge authority |
| Domain owner      | Correctness and compatibility inside the affected capability, package, application, or policy domain   |
| Evidence reviewer | Acceptance criteria, validation output, stage boundary, and ledger consistency                         |
| Security reviewer | Trust boundaries, credentials, dependency risk, disclosure handling, and negative security evidence    |
| Release manager   | Versioning, changesets, compatibility, migration, and release-channel decisions                        |

The current repository has one assigned maintainer, `@axelcasauran`, who also holds the other
roles until additional maintainers are explicitly assigned in
`.agent/repository-governance.json`. A role is still a separate review responsibility even when
one person holds several roles. GitHub path ownership is mirrored in `.github/CODEOWNERS`.

## Ownership model

Every change has one primary domain owner. Shared behavior is owned by the lowest reusable
capability package identified in `.agent/package-ownership.md`; supported public React surfaces
are owned by `@casauran/react`. Repository-wide policy, stage sequencing, schemas, CI, and release
configuration are maintained by the maintainer role.

Ownership grants responsibility, not permission to bypass higher-authority contracts. A domain
owner cannot approve an architecture change as ordinary implementation, and a maintainer cannot
mark a stage complete without the required evidence.

## Change classification and approval

Classify a change before implementation and follow the linked workflow.

| Change class                  | Governing workflow or policy                            | Required responsibilities                                       |
| ----------------------------- | ------------------------------------------------------- | --------------------------------------------------------------- |
| Active-stage implementation   | `.agent/protocol.md`                                    | Domain ownership, maintainer review, stage evidence             |
| Architecture                  | `.agent/workflows/architecture-change.md`               | Domain impact analysis, maintainer approval, accepted ADR       |
| Runtime dependency            | `.agent/workflows/dependency-proposal.md`               | Domain evaluation, security review, maintainer approval         |
| Public API or compatibility   | `API_GOVERNANCE.md` and `.agent/workflows/migration.md` | Domain review, migration/versioning review, maintainer approval |
| Reference scope or provenance | `.agent/workflows/reference-sync.md`                    | Evidence review, maintainer approval, pinned provenance         |
| Security-sensitive            | `.agent/workflows/security-review.md`                   | Domain review, security review, maintainer approval             |
| Release                       | `.agent/workflows/release.md`                           | Evidence review, release-manager review, maintainer approval    |

A pull request that spans multiple classes satisfies the union of their gates. Conversation or
issue approval does not replace a required ADR, stage ledger entry, test result, or migration
record.

## Stage lifecycle

The stage index is ordered. Valid states are `not-started`, `in-progress`, `complete`, and
`blocked`. Normal transitions are:

- `not-started` to `in-progress`;
- `in-progress` to `complete` after every exit gate is evidenced;
- `in-progress` to `blocked` when an in-scope prerequisite cannot be satisfied;
- `blocked` to `in-progress` only after the blocking condition changes and work resumes.

Completed or blocked stages must form a contiguous prefix of `.agent/stages/index.json`; later
stages remain `not-started`. At most one stage is `in-progress`. A blocked stage cannot be skipped.
Closing a stage may identify the next stage in `.agent/status.md`, but it must not start that stage.

## Required stage evidence

The stage Markdown ledger is the durable close record. A completed or blocked stage records:

1. outcome and completion date;
2. delivered scope and explicit boundary audit;
3. contracts and files changed;
4. exact validation commands and results;
5. decisions, debt, and blockers;
6. applicability of functionality, API/typing, accessibility, input/IME, security, performance,
   theming, RTL/i18n, SSR/hydration/RSC, responsive behavior, integration, and documentation;
7. confirmation that the index and program status agree.

`not-applicable` is acceptable only with a reason. A validation command that was not run is not a
pass and must be recorded as debt or a blocker according to the governing gate.

## Pull request and merge gates

All repository changes use the pull request template. Before merge:

- scope names the active stage and change class;
- affected owners and required review roles are identified;
- higher-authority contract changes include their required workflow records;
- repository validation passes at the level required by the active stage;
- stage evidence and status are updated only when the stage actually closes;
- secrets, generated reports, local environment files, and unapproved artifacts are excluded.

Branch protection is repository-host configuration and must require the CI validation job and
CODEOWNERS review when collaborators are added. Local files do not falsely claim that remote
branch protection is enabled.

## Exceptions and urgent changes

There is no silent exception path. An urgent fix may reduce rollout ceremony, but it still records
scope, owner, risk, validation performed, follow-up debt, and the approving maintainer. Security
reports follow `SECURITY.md`; exploitable details and credentials do not enter public issues,
examples, or logs.

## Mechanical enforcement

`pnpm validate:governance` validates the machine contract, authority sources, role assignments,
CODEOWNERS mirror, change routing, stage ordering, completed-stage evidence, and program-status
alignment. `pnpm test:governance` exercises rejection cases for the validator.
`pnpm validate:agent-os` verifies the owned task-routing catalog and its prompt, workflow, and skill
coverage. `MECHANICAL_GOVERNANCE.md` and `.agent/mechanical-governance.json` define the wider
read-only validator registry. `pnpm validate:mechanical-governance` rejects validator inventory,
command, ownership, contract, safety, root-gate, or CI drift; `pnpm test:mechanical-governance`
exercises its failure cases. The wider suite consumes this governance contract and the Agent
Operating System rather than redefining either one.
