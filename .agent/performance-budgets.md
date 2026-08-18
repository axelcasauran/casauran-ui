# Performance Budgets

Label `1.05` regression scenario: render 5,000 form captions through `react-dom/server` after a
production package build, cycling the requirement marker and its text, the invalid and disabled
reflections, and the empty caption, so the marker path, both state paths and the empty path are each
exercised; ceiling 500 ms. Recorded stage result: 216.34 ms on Node v22.22.2, linux x64. The pinned
toolchain is Node 24.18.0, which could not be installed in the stage environment, so this figure is
bounded to the runtime it names and will be re-measured on the pinned runtime at Phase 0
re-certification. Command: `pnpm benchmark:label`, which prints the Node version, platform and
architecture it measured. The component adds no external dependency, client boundary, observer,
listener, timer, portal, or network access. This is a bounded regression scenario, not a universal
speed claim.

Typography `1.04` regression scenario: render 5,000 text elements through `react-dom/server` after a
production package build, cycling the element, role, size, tone and spacing surfaces so an element
with a derived role, a role with a derived element, both given, explicit size and weight overrides,
and both spacing forms are each exercised; ceiling 500 ms. Recorded stage result: 194.85 ms on Node
v22.22.2, linux x64. The pinned toolchain is Node 24.18.0, which could not be installed in the stage
environment, so this figure is bounded to the runtime it names and will be re-measured on the pinned
runtime at Phase 0 re-certification. Command: `pnpm benchmark:typography`, which prints the Node
version, platform and architecture it measured. The component adds no external dependency, client
boundary, observer, listener, timer, portal, or network access. This is a bounded regression
scenario, not a universal speed claim.

SVGIcon `1.03` regression scenario: render 1,000 caller-owned three-layer definitions through
`react-dom/server` after production package builds, alternating a shipped variant with an absent one
so both variant resolution and the fallback path are exercised; ceiling 500 ms. Recorded stage
result: 146.90 ms on Node v24.18.0, linux x64. Command: `pnpm benchmark:svg-icon`, which prints the
Node version, platform and architecture it measured. The component adds no external dependency,
client boundary, observer, listener, timer, portal, network access, or SVG parser. This is a bounded
regression scenario, not a universal speed claim.

Icon `1.02` regression scenario: render 1,000 alternating named Icons through `react-dom/server`
after production package builds; ceiling 500 ms. Recorded stage result: 172.70 ms on Node v24.18.0,
Windows x64. Re-measured during the 2026-08-16 capability revalidation at 137.75 ms on Node
v24.18.0, linux x64. Command: `pnpm benchmark:icon`, which now prints the Node version, platform and
architecture it measured; the original script printed no environment at all, so its figure could not
be tied to a runtime. The component adds no external dependency, client boundary, observer,
listener, timer, portal, network access, or SVG parser. This is a bounded regression scenario, not a
universal speed claim.

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

F0.19 documentation interaction scenario: build the production documentation host and load one
component topic route that mounts an interactive example island
(`/components/button/events`), counting every client chunk the document references. Ceilings: the
example islands stay under 32 KiB raw in their own chunk, and a documentation route stays under
256 KiB of gzipped client JavaScript. Recorded result on Node v22.22.2, linux x64, Next 16.2.11:
the islands — the example frame plus four interactive Button examples, 5,304 bytes of source —
compile into a single 15.1 KiB chunk, and the route loads 624.6 KiB raw / 185.3 KiB gzipped across
8 chunks. Command: `pnpm --filter @casauran-internal/docs build`, then measure the chunks a topic
route references. Interactive examples are the first client JavaScript shipped to documentation
readers, so this budget is a ceiling on that decision, not a claim about page speed.

Button `1.01` regression scenario: render 1,000 initial toggleable Buttons and 1,000 updated pressed
projections through `react-dom/server` after production package builds, on Node v24.18.0, Windows
x64. Ceiling: 1,000 ms. Recorded stage result: 196.78 ms. The emitted Button implementation module
is 2,373 bytes before minification/compression and introduces no external runtime dependency,
observer, portal, timer, or global listener. This is a bounded regression scenario, not a universal
speed claim. Re-measured during the 2026-08-15 capability revalidation after the `xs` size and
icon-only geometry change; the revalidation result and its runtime/platform are recorded in
`.agent/stages/1.01-button.md`, because the additive change touches CSS and one type union rather
than the render path.
