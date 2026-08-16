# Documentation Interaction Foundation Specification

Stage: `F0.19`
Status: approved

## Scope and ownership

`F0.19` owns how documentation is _structured and operated_, where `F0.18` owns the shell it is
structured in. It adds a declared topic model, generated per-capability routes and nested
navigation, and an interactive example primitive with a single source of truth for example code. It
owns no component behaviour, no public package surface, and no content: the words on each page stay
with the component stage that writes them.

The stage is accepted by ADR-024 and follows the ADR-020 precedent of a governed foundation stage
inserted at the current ledger boundary. It exists because the `1.01 Button` revalidation showed
that documentation completeness (ADR-023) and documentation experience are different problems, and
because both changes apply to all 127 component routes rather than to any one component.

## Topic model

A topic is a capability-sized unit of a component's documentation: overview, appearance, sizes,
states, icons and content, events, forms, controlled state, keyboard, accessibility, globalization,
performance, security, API, limitations. The model declares which topics are required for every
component, which are optional, and the order they appear in. A component publishes a subset; it may
not invent a topic outside the model, and it may not omit a required one.

The model is data, not code. Routes, sidebar nesting, per-topic tables of contents, and search
metadata are derived from it, so adding a component means declaring topics and writing content
rather than hand-authoring page files. At roughly eight topics across 127 components the generated
route set approaches a thousand pages, which is why generation is a contract requirement rather than
an implementation preference.

## Routing and navigation

Component documentation is addressable per topic. Every route published before this stage — the
`/components/<slug>` pages and their section anchors — must continue to resolve, because
`stable-routing` is an existing `F0.18` capability and published deep links are a compatibility
surface. Navigation nests component topics under their component, keeps a single skip link, and
preserves keyboard and mobile behaviour proven by the existing shell evidence.

## Example harness

An example that demonstrates interactive behaviour is interactive: toggles toggle, forms submit,
cancellation visibly cancels. Interactivity is a narrow client island per example, never a page-wide
or route-wide client boundary, and never a package-root directive. Route modules and the
documentation package root stay server-safe.

Displayed source is the code that renders, or is mechanically verified against it. Hand-written
source strings beside the JSX they claim to describe are prohibited: they can disagree with the
preview, and nothing detects it.

Global theme, density and direction remain shell-level presentation controls. Per-example switchers
are deliberately excluded: they multiply client islands across the generated route set for a control
the shell already provides.

## Coverage interaction

`ADR-023` binds every declared component feature to a preview, a section, or a fixture. Under the
topic model a feature's declared anchor resolves against the topic that owns it rather than a
section id on a single page. The coverage rule is not relaxed by this stage; its resolution changes
and its enforcement stays in `pnpm validate:documentation-experience`.

## Accessibility, SSR, and security

Generated routes keep WCAG 2.2 AA behaviour: one main landmark per page, durable heading order,
visible focus, and keyboard-operable navigation including the nested sidebar. Pages stay
server-rendered with hydration-stable markup and no browser global at module evaluation. The
documentation content sinks that are already prohibited — raw HTML, dynamic code, remote modules,
untrusted URLs — remain prohibited, and interactive examples introduce no new sink.

## Performance evidence

Interactive examples ship JavaScript to documentation readers for the first time. The stage records
the hydration cost and bundle contribution of the example islands with a defined scenario and
environment, and states the ceiling it holds itself to. A route that becomes interactive without a
measured cost is not complete.

## Stage boundary

`F0.19` does not own per-example theme, density or direction switchers, a props playground,
documentation search, versioned documentation, analytics, or any public component, token, or API
change. Component content remains owned by each component stage; `1.03` is the first stage expected
to author against the finished model, and no `1.03` work belongs to this stage.
