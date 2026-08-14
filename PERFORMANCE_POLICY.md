# Performance Policy

Budgets require scenario + dataset + environment. Measure initial render, update/input latency, frame behavior during scroll/drag, memory and bundle contribution. Complex server-rendered widgets may also measure server cost.

Do not promise arbitrary universal timings. Regression thresholds are based on approved benchmarks with controlled variance.

Collection snapshots use map-backed lookup and iterative traversal. F0.09 guards complete ordering
and stack safety with a deterministic 10,000-item deep-tree test; this is a correctness scenario,
not an unqualified timing claim or substitute for later component/virtualization budgets.

Overlay top lookup is constant-time after deterministic registration ordering; focus traversal
queries only the active scope and modal isolation walks its ancestor/sibling branches. F0.10 uses a
1,000-layer deterministic correctness case for order/cleanup and makes no universal latency,
memory, or bundle claim. Component stages define realistic overlay interaction budgets as needed.

Animation timing/presence and keyed lookup are constant-time; registry clear/dispose are linear in
active handles. F0.11 uses a deterministic 1,000-key interruption/cleanup correctness case and
short browser-native transform/opacity effects. It makes no universal frame-rate, latency,
memory, or bundle claim; component stages define representative motion budgets.

Data filtering/paging/aggregation are linear in rows, stable sorting is `O(n log n)`, and grouping
is linear per bounded group depth plus sorting. F0.12 runs a deterministic 100,000-row
filter/sort/page scenario with a five-second regression ceiling on the pinned Node runtime and
records the observed environment. This is an engine regression case, not a universal database,
network, rendering, memory, or component-interaction claim.

F0.13 exposes reusable number/date-time formatter and collator factories so repeated formatting
can amortize native `Intl` construction. It deliberately has no global option-key cache, which
avoids unbounded keys and SSR request coupling. Locale data size and native implementation cost
belong to the deployed runtime; the stage makes no universal latency, memory, or bundle claim.

F0.14 calendar/range/time operations are constant-time. A created timezone strategy reuses one
native formatter and performs bounded offset sampling per local-to-instant conversion without a
global/unbounded cache or background work. Native timezone data/cost belong to the deployed
runtime; the stage makes no universal latency, memory, or bundle claim.

F0.15 axis total/offset lookup and dynamic measurement update are logarithmic; window queries are
`O(log n + rendered items)`, count rebuilds are linear, and 2D composition never materializes a
cell matrix. A deterministic 100,000-row by 10,000-column pinned-Node benchmark performs 20,000
axis queries, 1,000 measurements/anchor checks, and 5,000 grid queries under a five-second
regression ceiling. Component stages still define DOM-node, frame, input, memory, server-fallback,
and bundle budgets; this is not a universal timing claim.

F0.16 drag session transitions are constant-time, collision is linear in the caller's current
target count, and autoscroll is linear in the nested container chain with at most one owned frame.
A deterministic pinned-Node benchmark resolves 5,000 queries across 2,000 targets and performs
50,000 autoscroll calculations under a five-second regression ceiling. Component stages still
define representative target/DOM counts, drag-frame/input latency, memory and bundle budgets; this
is not a universal timing or frame-rate claim.

F0.17 external-corpus verification is linear in the 12,179 pinned files and their exact bytes;
repository-only validation is linear in 127 component mappings and 62 stored domains. Exact hashing
runs only before reference analysis or sync, never in application runtime or the general scaffold
suite. These integrity checks make no application latency, memory, server, or bundle claim.
