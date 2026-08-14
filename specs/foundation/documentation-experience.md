# Documentation Experience Foundation Specification

Status: accepted for implementation by F0.18 and ADR-020

## Scope and ownership

`apps/docs` is the canonical customer documentation application. It owns a private reusable shell,
documentation presentation primitives, stable route conventions, and registry-derived navigation
metadata. It consumes supported Casauran packages from the application layer and exports no
consumer API. `apps/playground` remains an engineering sandbox; `apps/visual-tests` remains the
fixture host while the browser gate additionally runs the production docs host.

## Information architecture and routing

The global shell contains a skip link, branded header, primary documentation navigation, a
category/component sidebar, page content landmark, and page-level table of contents. Canonical
component URLs use `/components/<slug>`. Page sections use durable explicit IDs and plain anchor
links so server-rendered deep links work without client JavaScript.

Navigation and search metadata are derived from `.agent/stages/index.json` through a private typed
module. Only completed public component stages become active component documentation links; planned
stages may be described without creating routes or advancing lifecycle. A versioned JSON endpoint
exposes normalized title, summary, category, route, headings, keywords, and stage ID for future
search indexing. Repository-authored strings are serialized as data and never injected as HTML.

## Documentation presentation primitives

The private page contract composes a title/summary/status header, ordered table-of-contents model,
semantic sections, and optional next-step footer. Reusable primitives cover:

- component examples with a labelled preview and repository-authored source text;
- syntax-preserving source presentation using escaped React text in `pre`/`code`;
- API reference tables with name, type, default, and description;
- accessibility guidance and keyboard interaction tables;
- semantic note, information, success, caution, and security callouts.

These primitives are documentation structures, not public UI components. Examples import only
supported package exports. The source panel never evaluates, fetches, compiles, or dynamically
imports displayed code.

## Visual system, theme, density, and direction

The docs application uses an independently designed Casauran visual language: warm neutral canvas,
ink surfaces, electric mint/coral accents, editorial typography, and restrained grid motifs. It
consumes existing theme semantic custom properties where applicable and adds private `--docs-*`
aliases for the application shell. It does not copy competitor branding, DOM, CSS, values, assets,
or implementation architecture.

`data-theme`, `data-density`, and `dir` are explicit on `<html>`. Server output defaults to light,
comfortable, LTR. A narrow client control updates only those enumerated attributes after hydration;
it performs no initial storage or media read, so the first client render matches SSR. Light/dark,
comfortable/compact, RTL logical layout, forced-colors, and reduced-motion presentations are
supported.

## Accessibility and responsive behavior

The application targets WCAG 2.2 AA. Landmarks have names, the skip link becomes visible on focus,
headings remain ordered, tables include captions/headers, examples and source regions are labelled,
all controls have programmatic names, focus is visible, current navigation uses `aria-current`,
and color is not the only status cue. Source blocks scroll without forcing page overflow.

At narrow widths the desktop sidebar and table of contents stop occupying fixed columns. Native
disclosure navigation remains keyboard/touch operable without a client overlay or focus trap.
Content reflows at 320 CSS pixels and high zoom. Motion is decorative and disabled under reduced
motion; forced colors use system color boundaries.

## SSR, hydration, and RSC

Root layout, navigation derivation, pages, examples, API tables, keyboard tables, callouts, and the
metadata route are Server Component/server-only surfaces by default. Only presentation controls
declare `use client`. No module reads `window`, `document`, storage, random values, or current time
during server evaluation. Production `next build` and direct HTML requests prove stable SSR, and
browser tests fail on hydration/runtime console errors.

## Security and CSP

Documentation content is trusted repository source but is still rendered through React escaping.
There is no Markdown-to-HTML bypass, `dangerouslySetInnerHTML`, remote source fetch, protocol sink,
dynamic import from metadata, `eval`, or `Function` construction. The metadata endpoint returns
static JSON. Future CMS, search, analytics, interactive code execution, or external URL support is
a new trust boundary requiring its owning workflow and tests. The foundation is compatible with a
strict CSP and introduces no inline script requirement.

## Performance and deterministic visual evidence

The shell is mostly server-rendered HTML/CSS with one small preference client boundary. Navigation
derivation is linear in the stage registry at build/server render and does not ship the full stage
ledger to the client. There is no universal performance claim; the acceptance concern is bounded
metadata generation and absence of client shell hydration.

Playwright starts the production docs host alongside the visual fixture host. Deterministic light,
dark/compact/RTL, desktop, and mobile scenarios freeze color scheme, reduced motion, locale,
timezone, viewport, animation, and repository content. Screenshots cover the shell rather than
component visual parity.

## Future component-stage contract

Each subsequent public component stage adds its route and metadata through these private
primitives, documents all dimensions required by `DOCUMENTATION_POLICY.md`, and supplies executable
examples from supported public APIs. It must not fork the shell, create a second registry, or move
the customer experience into `apps/playground`. F0.18 does not implement or begin SVGIcon.
