# Performance Budgets

Icon `1.02` regression scenario: render 1,000 alternating named Icons through `react-dom/server`
after production package builds on Node v24.18.0, Windows x64; ceiling 500 ms. Recorded result:
172.70 ms. The component adds no external dependency, client boundary, observer, listener, timer,
portal, network access, or SVG parser.

Budgets require scenario, dataset and environment. Track initial render, interaction latency, frame time, memory, bundle and server render cost where material. Complex widgets define explicit benchmark plans.

F0.15 engine regression scenario: 100,000 rows, 10,000 columns, 20,000 axis-window queries, 1,000
dynamic measurements with anchor checks, and 5,000 2D-window queries on the pinned Node runtime;
ceiling 5,000 ms. Browser render/frame/memory budgets remain component-stage requirements.

F0.16 engine regression scenario: 2,000 registered targets, 5,000 collision queries, and 50,000
bounded autoscroll calculations on the pinned Node runtime; ceiling 5,000 ms. Browser target/DOM
counts, drag-frame/input latency, memory, bundle and virtualized-component budgets remain later
component-stage requirements.

Button `1.01` regression scenario: render 1,000 initial toggleable Buttons and 1,000 updated pressed
projections through `react-dom/server` after production package builds, on Node v24.18.0, Windows
x64. Ceiling: 1,000 ms. Recorded stage result: 196.78 ms. The emitted Button implementation module
is 2,373 bytes before minification/compression and introduces no external runtime dependency,
observer, portal, timer, or global listener. This is a bounded regression scenario, not a universal
speed claim.
