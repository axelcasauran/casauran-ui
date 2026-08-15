# Data Engine Foundation Specification

Stage: `F0.12`
Status: implemented

## Scope and ownership

F0.12 defines the internal framework-neutral data operation contract owned by
`@casauran-internal/data`: serializable descriptor families, own-property field access,
deterministic filtering, stable sorting, aggregation, grouping, paging, and composite processing.
It uses ECMAScript language primitives with no runtime dependency, React boundary, browser API, or
transport assumption.

The engine processes caller-owned row objects but never renders or mutates them. Collections owns
interaction item identity/selection; virtualization owns windowing; serialization owns persisted
versions; F0.13 i18n owns locale/collation; components own columns, product defaults, events,
semantics, and server protocol integration.

## Descriptor and state contract

`DataField<T>` is a string key of `T`. Filter, sort, group, aggregate, and page descriptors are
readonly provider-neutral structures. `DataState<T>` composes optional filter, ordered sort/group,
aggregate, and page descriptors. Descriptors contain no third-party types, transport syntax,
functions, UI state, or mutable engine instance and are JSON-serializable when their caller values
are serializable.

Simple filters support `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `contains`, `startsWith`,
`endsWith`, `isNull`, `isNotNull`, `isEmpty`, and `isNotEmpty`. Composite filters use explicit
`and | or` logic and may nest to a maximum validated depth of 64. Empty `and` is true and empty
`or` is false. Page `skip`/`take` are finite nonnegative safe integers; `take: 0` is valid.

## Field access and comparison

`getFieldValue` reads only an own property of an object. Missing, inherited, prototype, and
non-object fields resolve to `undefined`; the engine never expands dotted paths or writes through a
field. Getters remain caller code and are outside the engine's trust guarantee.

Default equality uses SameValueZero after optional locale-neutral string lowercasing. Relational
comparison supports finite numbers, bigint, strings by UTF-16 code-unit order, and valid Dates;
unsupported/mismatched/NaN values are not relational matches. Default sorting uses the same
comparable domains, always orders nullish/unsupported values after supported values, and preserves
input order for ties. Callers may supply field-keyed comparers as processing options;
comparers are execution policy and never part of serializable descriptors.

## Filtering and sorting

`filterData` validates the complete filter graph once, rejects cycles, invalid operators/logic,
non-string fields, and depth overflow, then returns a frozen new array without mutating rows or
input order. String operators require strings. `ignoreCase` is locale-neutral; F0.13 or a future
approved seam owns locale-aware behavior.

`sortData` validates descriptors and returns a stable frozen copy. Ordered descriptors break ties
left-to-right. Group descriptors are prepended as sort keys during composite processing so equal
group values remain contiguous; a matching explicit sort field is not applied twice.

## Aggregation and grouping

Aggregates are `count`, `sum`, `average`, `min`, and `max`. `count` includes own non-nullish field
values. `sum`/`average` include finite numeric values only; an empty numeric set yields `0` for sum
and `null` for average. `min`/`max` use the default comparable domains, ignore unsupported values,
and return `null` when empty. Results preserve descriptor order and are frozen.

`groupData` recursively partitions rows by SameValueZero field values in stable first-occurrence
order after caller sorting. Each immutable `DataGroup<T>` records field, value, leaf count, nested
items, and aggregates calculated over that group's complete leaf rows. Group nesting is iterative
over descriptor depth and rejects invalid/duplicate-free constraints through the shared descriptor
validation; it does not infer expansion, selection, visual headers, or ARIA structure.

## Paging and composite processing

`pageData` returns a frozen slice after validating the page descriptor. `processData` executes one
documented pipeline: filter → group-key/explicit stable sort → whole-filtered aggregate results →
page leaf rows → group the page. `total` is the filtered leaf count. Top-level aggregate results
describe all filtered rows; aggregates inside returned groups describe only the paged rows present
in those returned groups. Without grouping, `data` is the paged sorted row array.

This leaf-page contract is deterministic and transport-neutral. Components that require server
group paging or a different remote protocol emit the descriptors and let their integration owner
perform remote processing; the internal engine does not pretend local grouping is a database API.

## Security and trust boundaries

Filter/state descriptors may originate from untrusted serialized input. Every executable entry
point validates operator enums, fields, finite paging, descriptor shapes, recursive depth, and
cycles before processing. Unknown properties are inert because the engine reads only named
contract fields. No expression text, dynamic property path, code generation, `eval`, HTML, URL,
SVG, storage, network, database, query language, prototype write, or arbitrary callback from a
descriptor is executed.

Rows and optional processing comparers are trusted caller objects/code. The engine cannot make a
getter or supplied comparer pure; callers must not install untrusted executable accessors or
comparers. Failures throw typed `TypeError`/`RangeError` rather than silently changing semantics.

## Performance and large-data evidence

Filtering, paging, and aggregation are linear in processed rows; stable sorting is
`O(n log n)`; grouping is linear per group depth plus sorting; output storage is linear. Descriptor
validation is bounded to depth 64. A deterministic 100,000-row filter/sort/page scenario on the
repository-pinned Node runtime has a five-second local regression budget and verifies result
correctness without claiming universal speed. Virtualized rendering, network/database cost,
memory profiling, and component interaction budgets belong to their real owners/stages.

## Accessibility and product dimensions

The engine renders no semantics, focus, keyboard/pointer/touch/IME behavior, announcements, CSS,
theme, density, direction, responsive layout, or user-facing text. Data operations must not be the
only way a user can perceive state; components expose localized controls, results, counts, groups,
sort/filter state, loading/errors, and accessible interaction. Pure output is identical across
themes, RTL, reduced motion, forced colors, zoom, and input modality.

## SSR, compatibility, and integration

All modules execute on server and client without module-evaluation browser access, timers, random
sources, storage, network, React, or client directives. A production Next.js Server Component
imports the compiled package root and processes deterministic data during SSR; Playwright checks
the rendered results in Chromium, Firefox, and WebKit. The package remains private/internal with
one compiled ESM/declaration root export and no runtime dependency.

## F0.13 boundary

F0.13 owns internationalization. F0.12 adds no locale registry, message catalog, number/date
parser/formatter, plural rules, direction policy, `Intl.Collator` default, locale persistence, or
public localization API. It also adds no public Grid/TreeList/ListView component, React hook,
column/filter UI, remote adapter, persistence format, virtualization, tree/pivot/formula engine, or
future-stage implementation.
