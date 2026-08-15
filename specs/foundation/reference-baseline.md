# Reference Baseline Foundation Specification

Stage: `F0.17`
Status: implemented
Owner roles: maintainer and evidence reviewer

## Scope and ownership

F0.17 owns reproducible, local-only public-document provenance for later clean-room component
analysis. The canonical contract is `reference/kendo-react-baseline.json`; its immutable file/domain
inventory is `reference/kendo-react-inventory.json`; its 127-component navigation registry is
`reference/reference-map.json`. Registry schemas, repository-only validation, focused regression
tests, and the external-corpus preflight enforce those records.

The foundation owns no public API, runtime package, React component, component feature extraction,
independent component specification, or implementation.

## Provenance contract

The approved behavioral reference records repository `telerik/kendo-react`, branch `master`, path
`docs/content`, commit `6a05c926c4f08b89782c25336fc159fea3a3f26b`, and capture date
`2026-08-13`. Repository and commit are provenance metadata only because normal analysis reads the
external documentation-only snapshot, not a competitor source checkout.

The baseline is immutable during ordinary stage execution. Only the reference-sync workflow may
approve a new corpus inventory, provenance commit, map, or parity scope.

## Local resolution and preflight

`CASAURAN_KENDO_DOCS_PATH` resolves the external snapshot; when unset it defaults to
`../references/kendo-react-docs/docs/content`. The resolved target must be a directory whose final
segments are exactly `docs/content`. Online fallback is disabled.

Every baseline, sync, or component reference-analysis task runs `pnpm reference:check` before
opening a document. Missing paths, malformed roots, missing mapped domains, symbolic links,
inventory drift, or a digest mismatch block dependent work.

## Immutable inventory and digest

The inventory sorts all regular files by root-relative POSIX path. For every file it hashes the
exact bytes with SHA-256 and feeds `<path> NUL <byte-count> NUL <content-hash> LF` into both its
top-level domain digest and the aggregate digest. It records domain/file/byte counts and digests;
the baseline repeats the aggregate summary so provenance and snapshot identity cannot drift
independently.

The hash is integrity evidence, not permission to inspect or derive from every file. F0.17 used
mechanical byte hashing for the corpus and semantically examined only the three public overview
documents listed in the stage evidence.

## Component reference map

The map contains exactly one entry for each of the 127 public-component stages. Component name,
category, reference path, commit, and `unreviewed` lifecycle agree with
`registry/components/*.json`. Every mapped path is relative to `docs/content`, remains inside the
validated root, and exists in the pinned inventory.

F0.17 corrects the stale Icon, SVGIcon, and Typography mappings to their local public Common
Utilities locations. It does not extract their feature inventory or advance their lifecycles.

## Analysis records and clean-room boundary

Later component stages record every relative public document examined, observed facts separately
from Casauran design choices, applicable enterprise dimensions, and resulting independent
specification/test evidence. Production work consumes the approved Casauran specification rather
than continuously reading competitor documentation.

Allowed inputs are public documented functionality, states, interaction, keyboard/accessibility,
adaptive behavior, i18n/RTL, integrations, and edge cases. Competitor source, CSS/theme values,
assets, bundles, private architecture, undocumented DOM/classes, online fallback, and direct
production-code derivation are forbidden.

## Security and trust boundaries

The external path, directory entries, document bytes, and stored JSON are untrusted inputs.
Resolution is bounded to an exact `docs/content` root; map paths reject traversal; inventory rejects
symbolic links and unsupported entries; validators parse data without executing corpus content,
opening URLs, or invoking shell text from reference files. The corpus is read-only and never a
runtime/build dependency.

## Performance contract

Repository-only validation is linear in the 127-entry map and stored domain inventory. The
external preflight is linear in corpus files and bytes because immutability requires exact hashing.
It runs only for reference-analysis/sync work, not normal builds or application runtime. No
universal latency, memory, bundle, or application-performance claim is made.

## Enterprise applicability

Functionality and documentation provenance are applicable and complete for this foundation.
Accessibility, keyboard, pointer/touch/IME, theming/density, forced colors, reduced motion,
RTL/i18n, responsive/adaptive rendering, SSR/hydration/RSC, and consumer API typing are not runtime
surfaces of a metadata/validator stage. Those dimensions remain `unreviewed` for every component
and must be decided from targeted public references plus independent Casauran requirements in the
owning component stage.

## Lifecycle and sync

`pnpm validate:reference-baseline` checks repository contracts without requiring the external
snapshot. `pnpm reference:check` additionally verifies the configured snapshot against the pinned
inventory. `pnpm reference:inventory:write` is a deliberate mutating maintenance command and may
be used only during an approved reference-baseline/reference-sync operation followed by review.

## Stage boundary

F0.17 creates no component source directory, public export, feature claim, API, test derived from
competitor internals, package dependency, visual story, or production runtime. Phase certification
and stage `1.01` remained outside this stage and were not started automatically. This heading names
no successor stage because F0.17 was the final foundation stage in the approved sequence at the time
it closed; ADR-020 later inserted `F0.18` at the ledger boundary after stage `1.02`.
