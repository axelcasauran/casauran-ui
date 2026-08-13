# AI Agent Operating Model

## Authority model

This repository uses one project constitution rather than several competing AI personas.

1. Accepted ADRs.
2. `AGENTS.md`.
3. Architecture/policy documents.
4. Registry/schema/stage ledger.
5. Approved specs and tests.
6. Implementation and documentation.

Skills do not override this hierarchy.

## Skill routing

Agents select skills by task and stage. A normal component loads component/API/testing/accessibility/composition/Next.js/documentation/parity. Domain skills are additive. A complex widget adds complex-widget plus its domain skill. Security is mandatory for rich text, files, SVG/URLs/serialization and AI. Internationalization/IME is mandatory for text search/editing, date/time and locale-sensitive data.

## Procedure vs knowledge

- Skills answer "what must an expert consider?"
- Workflows answer "what steps must be followed?"
- Prompts answer "what is the scoped execution instruction?"
- Stage ledgers answer "what exactly is being delivered now?"
- Validators answer "which rules are mechanically enforceable?"

This separation lets future models change without losing project operating discipline.

## Agent behavior

An agent must:
- inspect repository status rather than infer progress from conversation;
- report conflicting policies rather than silently choose;
- update durable records after work;
- prefer partial stage completion with explicit blockers over unverified completion claims;
- stop at public stage boundaries.

An agent must not:
- optimize for finishing a prompt at the cost of platform ownership;
- create duplicate public components;
- use undocumented private imports;
- weaken types/tests/validators;
- convert a likely future dependency into today's architecture without evidence.
