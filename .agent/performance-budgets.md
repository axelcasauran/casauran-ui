# Performance Budgets

Budgets require scenario, dataset and environment. Track initial render, interaction latency, frame time, memory, bundle and server render cost where material. Complex widgets define explicit benchmark plans.

F0.15 engine regression scenario: 100,000 rows, 10,000 columns, 20,000 axis-window queries, 1,000
dynamic measurements with anchor checks, and 5,000 2D-window queries on the pinned Node runtime;
ceiling 5,000 ms. Browser render/frame/memory budgets remain component-stage requirements.

F0.16 engine regression scenario: 2,000 registered targets, 5,000 collision queries, and 50,000
bounded autoscroll calculations on the pinned Node runtime; ceiling 5,000 ms. Browser target/DOM
counts, drag-frame/input latency, memory, bundle and virtualized-component budgets remain later
component-stage requirements.
