# Data Architecture

Data operations are independent of visual widgets.

Canonical descriptor families: filters, sorts, groups, aggregates, paging and composite DataState. Processing is deterministic, immutable-by-default, type-safe and serializable where practical.

Server operation is supported through state/event contracts without assuming database, REST, GraphQL or query libraries. Future alternate engines remain behind domain-owned seams and never define public API.

The F0.12 engine implements readonly provider-neutral descriptors, own-property field access,
bounded composite filters, stable sorting, deterministic aggregates/groups, leaf paging, and one
documented composite pipeline. It validates untrusted descriptor shape/depth/cycles and never
mutates rows. Default string comparison is locale-neutral; F0.13 owns collation and formatting.
Consumers may explicitly supply an F0.13 collator through their own comparer policy; the data
engine does not silently choose a locale or import the i18n package.
Remote integrations consume state but own database/query/transport translation, fetching,
caching, synchronization, and errors. Serialization owns persisted versions; virtualization owns
render windows; components own columns, product defaults, events, semantics, and UI.
