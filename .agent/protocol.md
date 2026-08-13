# Agent Execution Protocol

## 1. Preflight

Before task actions:

1. inspect the worktree and preserve unrelated or prior-stage changes;
2. read `AGENTS.md`, `.agent/status.md`, and the active stage ledger;
3. verify prerequisite stages and authoritative status agree;
4. load relevant accepted ADRs, architecture/policy documents, and ownership records;
5. identify whether local reference validation is required;
6. confirm the requested work does not enter a later stage.

An invalid prerequisite, unresolved authority conflict, or required failed reference check blocks
dependent work.

## 2. Classify

Choose one primary task class:

| Task class          | Use                                                        |
| ------------------- | ---------------------------------------------------------- |
| `foundation`        | Phase 0 shared contract or infrastructure stage            |
| `public-component`  | Exactly one supported React component stage                |
| `engine`            | Shared capability creation or extension at its owner layer |
| `bug`               | Reproducible defect repair                                 |
| `documentation`     | Product or API documentation work                          |
| `accessibility`     | Semantic or interaction accessibility repair               |
| `performance`       | Measured performance regression or budget work             |
| `dependency`        | External runtime dependency evaluation                     |
| `architecture`      | Frozen architecture change                                 |
| `migration`         | Deprecated or breaking supported behavior                  |
| `release`           | Governed package/release preparation                       |
| `composed-artifact` | One Pattern, Block, or Template stage                      |

Then add applicable operations, modifiers, and domain routes from
`.agent/agent-operating-system.json`. A complex widget remains a `public-component` task with the
`complex-widget` modifier; it is not permission to create several public stages.

## 3. Route

Load the union of routed prompts, workflows, and skills completely before implementation. Prompts
constrain scope, workflows define procedure, and skills define expert review gates. None overrides
repository authority.

If a requested route is absent, classify using the closest existing task class only when its scope
and approval requirements are equivalent. Otherwise stop and update the operating contract through
the active governance scope rather than inventing an undocumented procedure.

## 4. Define acceptance

Translate repository requirements into observable acceptance criteria before implementation:

- required contract, implementation/configuration, tests, docs, and evidence;
- owning domain and affected consumers;
- applicable enterprise dimensions and explicit not-applicable reasons;
- exact targeted and repository-wide validation commands;
- stage boundary and excluded future work;
- required approvals, ADRs, dependency decisions, or security reviews.

For public components, the mandatory component-stage sequence in `AGENTS.md` is the minimum
acceptance path. For foundation work, define the contract, ownership, focused tests/validation,
documentation, and closure evidence without prebuilding later capabilities.

## 5. Execute

Work at the lowest reusable owner. Preserve strict types, tests, architecture validators, public
boundaries, clean-room rules, and one-public-component scope. Do not add speculative dependencies,
adapters, packages, APIs, or later-stage scaffolding.

Safe in-scope discovery and ordinary implementation are autonomous. Stop when continuation needs
new authority, credentials, external coordination, a material scope choice, or an unresolved
higher-authority change.

## 6. Validate

Run the cheapest meaningful targeted checks while developing, then the stage-required full gate.
Failed tests are evidence to investigate, not obstacles to disable. Real browser checks are used
for browser behavior; pure contract and routing logic can use Node or unit tests.

Record exact commands and outcomes. Warnings are classified as existing debt, new debt, blocker,
or harmless diagnostic with a reason. An unrun required gate is not a pass.

## 7. Record

Update specifications, registries, policies, tests, docs, stage ledger, and status as required by
the active route. Status transitions occur only after evidence exists. A completed or blocked
ledger follows `GOVERNANCE.md` and must agree with `.agent/stages/index.json` and
`.agent/status.md`.

Do not rewrite prior-stage evidence merely to make a new stage appear green. If new work discovers
a prior-stage defect, record and fix it through the correct active workflow.

## 8. Stop and report

Stop when:

- acceptance is satisfied and evidenced;
- an essential condition is blocked and recorded; or
- continuing would enter a later stage or materially exceed authorized scope.

Report `COMPLETE` or `BLOCKED` with self-contained evidence. Name the next stage only after a valid
close transition, and leave it `not-started`.

## Reference-analysis rule

Any route using `reference-baseline`, `reference-sync`, or `reference-to-spec` first runs
`pnpm reference:check` and reads only the resolved local corpus. Online fallback, private
implementation inspection, and production-code derivation from reference material are prohibited.

## Conflict rule

Never resolve an architectural contradiction from conversation memory or tool output when
repository authority exists. Identify the conflicting sources, follow precedence, and invoke the
architecture-change workflow when the frozen decision itself must change.
