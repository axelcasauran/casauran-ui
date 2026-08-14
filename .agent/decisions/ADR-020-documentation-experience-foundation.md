# ADR-020: Documentation Experience Foundation

Status: Accepted
Date: 2026-08-14
Approved by: maintainer-directed governance remediation

## Context

The accepted architecture names `apps/docs` as the canonical customer documentation host, but the
approved roadmap has no stage that owns its reusable shell, information architecture, presentation
primitives, registry integration, or deterministic visual evidence. Component stages 1.01 and 1.02
therefore produced isolated pages inside a placeholder host. Continuing that pattern would copy
documentation scaffolding across every later public stage and leave `apps/playground` at risk of
becoming the de facto customer experience.

## Evidence

- `.agent/stages/index.json` previously contained no documentation-platform foundation stage.
- `apps/docs` contained only a root placeholder and standalone Button/Icon pages with no shared
  navigation, page table of contents, example/API/accessibility structures, preferences, or docs
  shell visual contract.
- `DOCUMENTATION_POLICY.md` requires complete executable product documentation but did not assign
  ownership for the reusable application experience.

## Options

1. Continue adding private page markup in each component stage. This has no architecture change,
   but guarantees duplication and inconsistent accessibility, navigation, and API presentation.
2. Move the customer experience into `apps/playground`. This conflicts with the accepted four-host
   topology and collapses customer documentation into an engineering sandbox.
3. Add a governed internal `apps/docs` foundation stage at the current stage boundary. The app
   owns reusable documentation presentation and registry-derived metadata while supported product
   behavior remains in public packages. This preserves host separation and gives later stages a
   stable documentation contract.

## Decision

Adopt option 3 as `F0.18 Documentation Experience Foundation`. Insert it at the current ordered
ledger boundary after completed stage 1.02 and before 1.03; do not rewrite historical completion
order. F0.18 is a Phase 0 foundation remediation executed during Phase 1 readiness.

`apps/docs` owns the canonical customer documentation shell, documentation-only presentation
primitives, stable routes/deep links, registry-derived search/navigation metadata, and its local
interactive preference boundary. `apps/playground` remains a separate engineering sandbox.
`apps/visual-tests` remains the deterministic browser fixture owner, with Playwright also starting
the production docs host for shell tests.

The implementation uses the existing Next.js/React/theme workspaces and native platform APIs. It
adds no runtime dependency, public package, supported consumer API, or public component.

## Architectural impact

- Dependency direction remains `public packages -> apps`; documentation primitives stay private to
  `apps/docs` and cannot be imported by packages.
- Routes and content default to Server Components. Only presentation preference controls use a
  local client boundary after hydration.
- Documentation metadata is a versioned private contract sourced from the stage registry, not a
  second component lifecycle registry.
- Static CSS/custom properties, logical layout, theme attributes, reduced motion, forced colors,
  and WCAG 2.2 AA remain governing contracts.
- Example/source rendering is trusted repository-authored text and React content. The foundation
  provides no raw HTML, executable source, remote URL, or dynamic module-evaluation path.

## Consequences

Future component stages must compose the F0.18 page, example, API, accessibility, keyboard, and
callout structures instead of creating a parallel shell. Search providers may later consume the
metadata endpoint behind an independently governed integration; F0.18 does not add search SaaS,
analytics, authentication, content management, or deployment architecture.

Compatibility impact is internal because `apps/docs` is not a supported package. Existing Button
and Icon deep links are preserved. SSR output remains deterministic; switching theme, density, or
direction occurs after hydration and changes only documented root attributes. The visual suite now
starts both the visual-test and docs production hosts, increasing browser-gate duration modestly.

## Rollout / rollback

Roll out in one stage: add the contract/specification, build the shared docs shell and primitives,
migrate existing routes, add production browser/visual evidence, validate, and close F0.18. If the
foundation must be rolled back before later stages consume it, restore the prior app sources and
remove the F0.18 contract/stage/validator together. After later stages depend on it, rollback must
preserve routes and provide a documented migration.

## Revisit trigger

Reconsider only with measured evidence that Next.js cannot satisfy the supported documentation
requirements, that the private metadata contract blocks a required content workflow, or that a
real external search/content platform requires a separately approved dependency or integration.
