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
