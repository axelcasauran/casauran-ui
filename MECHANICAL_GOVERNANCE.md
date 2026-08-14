# Mechanical Governance

## Purpose and authority

Mechanical governance converts already accepted repository contracts into deterministic local
checks. It does not create product architecture, approve a change, or replace human review. The
authority order in `AGENTS.md`, the ownership and lifecycle contract in `GOVERNANCE.md`, and the
task-routing contract in `AI_AGENT_OPERATING_MODEL.md` remain authoritative.

The canonical gate registry is `.agent/mechanical-governance.json`; its structural schema is
`.agent/mechanical-governance.schema.json`. The maintainer owns gate behavior and the evidence
reviewer owns acceptance and close evidence. Validator entries may add other repository roles when
their governed contracts require domain, security, or release accountability.

F0.03 operationalizes existing decisions and therefore does not require an ADR. A validator that
would change a frozen decision, package boundary, public API, dependency rule, or compatibility
contract must first follow the governing change workflow and obtain the required ADR or approval.

## Guarantees

The contract and its meta-validator enforce these invariants:

1. Every `scripts/validate-*.mjs` entry point is catalogued exactly once.
2. Every validator has a unique id, an independently runnable package script, explicit owner
   roles, and at least one existing governed contract.
3. Owner roles resolve through `.agent/repository-governance.json`; mechanical checks cannot invent
   an unassigned approval role.
4. Validator execution sources are catalogued, use only Node platform or relative repository
   modules, do not access the network, and do not mutate the repository.
5. The pre-install runner always executes the meta-validator and derives the remaining suite from
   the machine contract, preventing a hand-maintained runner list from drifting.
6. The root static and full gates retain their required composition, and GitHub Actions invokes the
   full gate.
7. Invalid configuration reports every detected error and exits non-zero. A missing command,
   source, owner, test, or CI link is a failure rather than an implicit exemption.

These checks prove wiring and repository state, not the correctness of an unimplemented future
feature. A validator must inspect authoritative artifacts and must not encode model memory,
undocumented reference behavior, or a lower-authority workaround.

## Gate levels

| Level       | Command                                                      | Responsibility                                                             |
| ----------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Pre-install | `node scripts/verify-scaffold.mjs` or `pnpm verify:scaffold` | Read-only governance and policy checks using Node built-ins only           |
| Focused     | `pnpm validate:<domain>`                                     | One independently runnable contract check                                  |
| Static      | `pnpm validate:static`                                       | Mechanical suite plus format, lint, types, architecture, tests, and builds |
| Full        | `pnpm validate`                                              | Static gate plus browser integration; required for stage close and CI      |

The registry records gate membership and ownership; `package.json` remains the executable command
source. The meta-validator requires those sources to agree. F0.03 does not change tool versions,
test runners, browser matrices, build products, coverage policy, or application test
infrastructure; those are F0.04 concerns.

## Execution and failure semantics

`scripts/verify-scaffold.mjs` is the canonical pre-install runner. It first invokes
`scripts/validate-mechanical-governance.mjs` even if the registry is malformed, then invokes every
catalogued validator and collects failures before returning a non-zero status. Validators are
read-only and network-free so a result depends only on the checkout and declared environment
inputs. The local reference corpus is never read by this general suite; reference-analysis work
uses the separate `pnpm reference:check` preflight required by `AGENTS.md`.

A pass means the checked state satisfies the validator at that revision. It does not mean remote
branch protection is enabled, a required reviewer has approved, or a command not executed has
passed. Stage evidence records the exact commands actually run and any warnings or exclusions.

## Adding or changing a validator

An in-scope change that introduces, renames, or removes a validator must update all of the
following in one change:

1. the authoritative policy or contract being enforced;
2. the validator and focused regression tests at the cheapest reliable layer;
3. `.agent/mechanical-governance.json`, including id, script, package command, owners, and governed
   contracts;
4. `package.json` with an independently runnable `validate:*` command;
5. ownership or contributor documentation when responsibility changes;
6. active-stage evidence describing the gate and its validation result.

F0.15 adds the read-only `virtualization-foundation` validator and focused rejection suite. It
checks the canonical inventory/boundaries, package ownership and dependency/SSR/security rules,
future-stage isolation, specification/API markers, unit/production-browser evidence, and the
large-data benchmark contract; it does not execute the benchmark or mutate generated artifacts.

F0.16 adds the read-only `drag-drop-foundation` validator and focused rejection suite. It checks
the canonical inventory/boundaries, internal zero-dependency/SSR/security ownership, future-stage
isolation, session/capture/autoscroll markers, unit and three-browser evidence, and the pinned
benchmark contract; it does not execute browser interaction or mutate artifacts.

F0.17 adds the repository-only `reference-baseline` validator and focused rejection suite. It
checks pinned provenance, inventory/map structure and agreement, clean-room ownership boundaries,
the complete Phase 0 prefix, and isolation from public component lifecycles. The general scaffold
suite never opens the external corpus; `pnpm reference:check` separately recomputes its exact
SHA-256 file/domain inventory before reference analysis or sync.

The validator must use precise failure messages and cover at least one rejection case for each new
invariant. Broad exceptions, warning-only enforcement, network-dependent checks, generated file
rewrites, test disabling, and silent validator discovery are prohibited. If a rule cannot be
checked reliably, document the remaining review responsibility instead of presenting a heuristic
as proof.

## Security and trust boundary

Repository files, environment values, command output, and external/reference material are
untrusted inputs. Validators parse narrowly, never execute data from governed files as shell code,
never print secrets, and do not contact external services. The suite runner executes only script
paths present in the reviewed mechanical-governance contract; changes to that registry are owned
and reviewed like other repository governance.

## Applicability

Mechanical governance is repository tooling, not a consumer runtime surface. Accessibility,
keyboard, pointer, touch, IME, theming, density, RTL, localization, responsive layout, and
SSR/hydration behavior are not directly applicable because F0.03 renders no UI and exports no
public API. Their accepted policies remain catalogued by relevant validators and become product
acceptance gates in the stages that introduce those behaviors. Runtime performance is likewise
unchanged; validator work is limited to deterministic local inspection without performance claims.
