# Performance Budgets

Icon `1.02` regression scenario: render 1,000 alternating named Icons through `react-dom/server`
after production package builds on Node v24.18.0, Windows x64; ceiling 500 ms. Recorded result:
172.70 ms. The component adds no external dependency, client boundary, observer, listener, timer,
portal, network access, or SVG parser.

Budgets require scenario, dataset and environment. Track initial render, interaction latency, frame time, memory, bundle and server render cost where material. Complex widgets define explicit benchmark plans.

Every entry below records its scenario, its ceiling, and the result observed when its stage closed.
A ceiling without a recorded result and environment is an incomplete budget.

F0.12 engine regression scenario: 100,000-row filter, stable sort and page through the compiled data
package root; ceiling 5,000 ms. Recorded result: 21.94 ms on Node v24.18.0, win32 x64. Database,
network, rendering and memory cost belong to their real owners; this is a local engine guard only.
Command: `pnpm benchmark:data-engine`.

F0.15 engine regression scenario: 100,000 rows, 10,000 columns, 20,000 axis-window queries, 1,000
dynamic measurements with anchor checks, and 5,000 2D-window queries on the pinned Node runtime;
ceiling 5,000 ms. Recorded result: 174.47 ms on Node v24.18.0, Windows x64. Browser
render/frame/memory budgets remain component-stage requirements.
Command: `pnpm benchmark:virtualization`.

F0.16 engine regression scenario: 2,000 registered targets, 5,000 collision queries, and 50,000
bounded autoscroll calculations on the pinned Node runtime; ceiling 5,000 ms. Recorded result:
870.64 ms on Node v24.18.0, Windows x64. Browser target/DOM counts, drag-frame/input latency,
memory, bundle and virtualized-component budgets remain later component-stage requirements.
Command: `pnpm benchmark:drag-drop`.

Button `1.01` regression scenario: render 1,000 initial toggleable Buttons and 1,000 updated pressed
projections through `react-dom/server` after production package builds, on Node v24.18.0, Windows
x64. Ceiling: 1,000 ms. Recorded stage result: 196.78 ms. The emitted Button implementation module
is 2,373 bytes before minification/compression and introduces no external runtime dependency,
observer, portal, timer, or global listener. This is a bounded regression scenario, not a universal
speed claim.
