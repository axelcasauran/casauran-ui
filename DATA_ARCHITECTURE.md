# Data Architecture

Data operations are independent of visual widgets.

Canonical descriptor families: filters, sorts, groups, aggregates, paging and composite DataState. Processing is deterministic, immutable-by-default, type-safe and serializable where practical.

Server operation is supported through state/event contracts without assuming database, REST, GraphQL or query libraries. Future alternate engines remain behind domain-owned seams and never define public API.
